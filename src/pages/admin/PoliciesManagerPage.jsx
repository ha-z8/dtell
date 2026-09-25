import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function PoliciesManagerPage({ navigateRoute, showAlert }) {
    const [policies, setPolicies] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // خيارات نوع البند الجاهزة بدلاً من الكتابة العشوائية
    const [selectedType, setSelectedType] = useState('privacy');
    const [customKey, setCustomKey] = useState('');
    const [newTitle, setNewTitle] = useState('سياسة الخصوصية');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        const { data } = await supabase.from('site_policies').select('*');
        if (data) setPolicies(data);
    };

    // تحديث العنوان الافتراضي تلقائياً عند تغيير الاختيار من القائمة
    const handleTypeChange = (type) => {
        setSelectedType(type);
        if (type === 'privacy') setNewTitle('سياسة الخصوصية');
        else if (type === 'terms') setNewTitle('شروط الاستخدام');
        else setNewTitle('');
    };

    const handleAddPolicy = async (e) => {
        e.preventDefault();
        const finalKey = selectedType === 'custom' ? customKey.trim().toLowerCase().replace(/\s+/g, '_') : selectedType;

        if (!finalKey || !newTitle.trim() || !newContent.trim()) {
            showAlert('يرجى ملء كافة الحقول المطلوبة', 'error');
            return;
        }

        const { error } = await supabase.from('site_policies').upsert([{
            key: finalKey,
            title: newTitle,
            content: newContent,
            is_enabled: true
        }]);

        if (!error) {
            showAlert('تم حفظ وحفظ البند بنجاح');
            setCustomKey('');
            setNewContent('');
            setShowAddModal(false);
            fetchPolicies();
        } else {
            showAlert('فشل الحفظ، تأكد من البيانات', 'error');
        }
    };

    const handleUpdatePolicy = async (key, title, content, is_enabled) => {
        const { error } = await supabase.from('site_policies').update({ title, content, is_enabled }).eq('key', key);
        if (!error) {
            showAlert('تم تحديث البند بنجاح');
            fetchPolicies();
        } else {
            showAlert('فشل التحديث', 'error');
        }
    };

    const handleToggleEnable = async (key, currentStatus) => {
        const { error } = await supabase.from('site_policies').update({ is_enabled: !currentStatus }).eq('key', key);
        if (!error) {
            showAlert('تم تغيير حالة الظهور بنجاح');
            fetchPolicies();
        }
    };

    const handleDeletePolicy = async (key) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا البند نهائياً؟')) return;
        const { error } = await supabase.from('site_policies').delete().eq('key', key);
        if (!error) {
            showAlert('تم حذف البند بنجاح');
            fetchPolicies();
        } else {
            showAlert('فشل الحذف', 'error');
        }
    };

    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-10 rounded-3xl shadow-2xl space-y-8 font-sans relative">
            
            {/* نافذة منبثقة عصرية لإضافة أو تعديل بند */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-5">
                        <div className="flex justify-between items-center border-b border-dark-border pb-4">
                            <h3 className="text-white font-black text-base flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center text-sm shadow-inner">
                                    <i className="fa-solid fa-file-circle-plus"></i>
                                </div>
                                إضافة أو تحديث سياسة / شروط
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white bg-dark-input w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddPolicy} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2">اختر نوع البند الأساسي أو مخصص</label>
                                <select 
                                    value={selectedType} 
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
                                >
                                    <option value="privacy">سياسة الخصوصية (Privacy Policy)</option>
                                    <option value="terms">شروط الاستخدام (Terms of Use)</option>
                                    <option value="custom">بند مخصص جديد (Custom Policy)</option>
                                </select>
                            </div>

                            {selectedType === 'custom' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 mb-2">مفتاح الرابط الإنجليزي (مثل: refund_policy)</label>
                                    <input 
                                        type="text" 
                                        value={customKey} 
                                        onChange={(e) => setCustomKey(e.target.value)} 
                                        placeholder="refund_policy" 
                                        required
                                        className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-xs text-white font-mono"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2">عنوان البند (يظهر في الموقع والفوتر)</label>
                                <input 
                                    type="text" 
                                    value={newTitle} 
                                    onChange={(e) => setNewTitle(e.target.value)} 
                                    placeholder="عنوان البند..." 
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-xs text-white font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 mb-2">محتوى وتفاصيل البند</label>
                                <textarea 
                                    rows="5" 
                                    value={newContent} 
                                    onChange={(e) => setNewContent(e.target.value)} 
                                    placeholder="اكتب التفاصيل والنقاط هنا..." 
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 text-xs text-gray-200 resize-none font-sans leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-600/30">
                                    حفظ النشر الفوري
                                </button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-dark-input hover:bg-dark-border text-gray-300 py-3 rounded-2xl text-xs font-bold transition cursor-pointer">
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* رأس الصفحة */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-6">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center text-base shadow-inner">
                            <i className="fa-solid fa-scale-balanced"></i>
                        </div>
                        إدارة السياسات والشروط والبنود
                    </h2>
                    <p className="text-gray-400 text-xs mt-1.5">تحكم كامل، اختيار نوع البند، التعديل الفوري، وإدارة ظهور الروابط في الموقع والفوتر.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowAddModal(true)} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> إضافة أو تحديث بند
                    </button>
                    <button 
                        onClick={() => navigateRoute('admin-overview')} 
                        className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-300 transition cursor-pointer shadow flex items-center gap-2"
                    >
                        <i className="fa-solid fa-arrow-right"></i> لوحة التحكم
                    </button>
                </div>
            </div>

            {/* قائمة البنود الحالية */}
            <div className="grid grid-cols-1 gap-6">
                {policies.length === 0 ? (
                    <div className="text-center py-16 bg-dark-input/40 rounded-3xl border border-dark-border space-y-3">
                        <i className="fa-solid fa-folder-open text-3xl text-gray-500"></i>
                        <p className="text-gray-400 text-xs">لا توجد سياسات أو شروط مضافة حتى الآن.</p>
                    </div>
                ) : (
                    policies.map(p => (
                        <PolicyCard 
                            key={p.key} 
                            policy={p} 
                            onSave={handleUpdatePolicy} 
                            onToggle={handleToggleEnable} 
                            onDelete={handleDeletePolicy} 
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function PolicyCard({ policy, onSave, onToggle, onDelete }) {
    const [title, setTitle] = useState(policy.title);
    const [content, setContent] = useState(policy.content);

    return (
        <div className="bg-dark-input border border-dark-border p-6 md:p-8 rounded-3xl space-y-5 shadow-xl transition hover:border-indigo-500/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-2/3">
                    <span className="bg-dark-bg text-indigo-400 font-mono text-[11px] px-3 py-1.5 rounded-xl border border-dark-border shadow-inner font-bold">
                        {policy.key}
                    </span>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="bg-dark-bg border border-dark-border rounded-2xl px-4 py-2.5 text-xs font-black text-white w-full focus:border-indigo-500 transition"
                    />
                </div>
                
                <div className="flex items-center gap-2.5">
                    <button 
                        onClick={() => onToggle(policy.key, policy.is_enabled)} 
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow border ${
                            policy.is_enabled 
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' 
                                : 'bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/25'
                        }`}
                    >
                        <i className={`fa-solid ${policy.is_enabled ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        {policy.is_enabled ? 'الظهور مفعل' : 'مخفي عن الزوار'}
                    </button>

                    <button 
                        onClick={() => onDelete(policy.key)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2.5 rounded-xl text-xs transition cursor-pointer shadow border border-red-500/20"
                        title="حذف البند نهائياً"
                    >
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div>
                <textarea 
                    rows="4" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 text-xs md:text-sm text-gray-200 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed shadow-inner"
                    placeholder="محتوى البند..."
                ></textarea>
            </div>

            <div className="flex justify-end pt-1">
                <button 
                    onClick={() => onSave(policy.key, title, content, policy.is_enabled)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                    <i className="fa-solid fa-floppy-disk"></i> حفظ وتحديث التعديلات
                </button>
            </div>
        </div>
    );
}