import React, { useState } from 'react';
import logoAvatar11 from '../../assets/11.png';

export default function MessagesPage({ messages, onDeleteMessage, onDeleteSelectedMessages, onDeleteAllMessages, onBlockSender, navigateRoute }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteType, setDeleteType] = useState('all');
    
    // حالة النافذة المنبثقة لمعلومات المرسل الحقيقي
    const [selectedSenderInfo, setSelectedSenderInfo] = useState(null);

    const toggleSelectMessage = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m.id));
        }
    };

    const renderDiscordMarkdown = (text) => {
        if (!text) return null;

        if (text.includes('```')) {
            const parts = text.split('```');
            return parts.map((part, index) => {
                if (index % 2 === 1) {
                    let codeContent = part;
                    let isDiff = false;

                    if (part.startsWith('diff\n')) {
                        isDiff = true;
                        codeContent = part.replace('diff\n', '');
                    }

                    if (isDiff) {
                        const lines = codeContent.split('\n');
                        return (
                            <div key={index} className="bg-[#2b2d31] p-3 rounded-lg font-mono text-xs text-gray-200 border border-gray-700/50 my-1 space-y-1">
                                {lines.map((line, lIdx) => {
                                    let colorClass = "text-gray-200";
                                    if (line.startsWith('-')) colorClass = "text-[#f23f43]";
                                    else if (line.startsWith('+')) colorClass = "text-[#23a55a]";
                                    else if (line.startsWith('!')) colorClass = "text-[#f0b232]";
                                    else if (line.startsWith('#')) colorClass = "text-[#949ba4] italic";
                                    return <div key={lIdx} className={colorClass}>{line}</div>;
                                })}
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="bg-[#1e1f22] p-3 rounded-lg font-mono text-xs text-gray-200 border border-gray-700/50 my-1 overflow-x-auto">
                            <pre>{part}</pre>
                        </div>
                    );
                }
                return <span key={index}>{part}</span>;
            });
        }

        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/\|\|(.*?)\|\|/g, '<span class="bg-[#393c43] hover:bg-[#4e5058] text-transparent hover:text-gray-100 rounded px-1 transition cursor-pointer select-none" title="انقر للإظهار">$1</span>')
            .replace(/`(.*?)`/g, '<code class="bg-[#1e1f22] px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]">$1</code>');
        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 font-sans relative">
            
            {/* نافذة منبثقة لعرض معلومات المرسل الحقيقي عند النقر على الأفاتار */}
            {selectedSenderInfo && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-5 animate-in fade-in zoom-in-95 duration-200 text-center relative">
                        <button 
                            onClick={() => setSelectedSenderInfo(null)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-white bg-dark-input hover:bg-dark-border w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="flex flex-col items-center space-y-3 pt-2">
                            <img 
                                src={selectedSenderInfo.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                                alt="Avatar" 
                                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-xl"
                            />
                            <div>
                                <h3 className="text-white font-black text-base">{selectedSenderInfo.username || "مستخدم غير معروف"}</h3>
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                                    مرسل الرسالة الحقيقي (حتى لو كان متخفياً)
                                </span>
                            </div>
                        </div>

                        <div className="bg-dark-bg p-4 rounded-2xl border border-dark-border text-right space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">معرف ديسكورد (ID):</span>
                                <span className="text-indigo-400 font-mono select-all font-bold">{selectedSenderInfo.discordId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">الاسم الظاهر:</span>
                                <span className="text-gray-200 font-bold">{selectedSenderInfo.username}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setSelectedSenderInfo(null)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد الحذف */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
                        <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-inner">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h3 className="text-white font-black text-base">
                            {deleteType === 'all' ? 'هل أنت متأكد من حذف جميع الرسائل؟' : `حذف (${selectedIds.length}) من الرسائل المحددة؟`}
                        </h3>
                        <p className="text-gray-400 text-xs">سيتم حذف الرسائل نهائياً من قاعدة البيانات ولا يمكن التراجع عن هذا الإجراء.</p>
                        <div className="flex gap-2 pt-2">
                            <button 
                                onClick={() => {
                                    if (deleteType === 'all') {
                                        onDeleteAllMessages();
                                    } else {
                                        onDeleteSelectedMessages(selectedIds);
                                        setSelectedIds([]);
                                    }
                                    setShowConfirmModal(false);
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow"
                            >
                                نعم، تأكيد الحذف
                            </button>
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-dark-input hover:bg-dark-border text-gray-300 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-4">
                <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <i className="fa-solid fa-inbox text-indigo-500"></i> صندوق الرسائل الواردة ({messages.length})
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">كشف هويات المرسلين الحقيقية وإدارة الرسائل الواردة.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {messages.length > 0 && (
                        <>
                            <button 
                                onClick={handleSelectAll} 
                                className="bg-dark-input hover:bg-dark-border border border-dark-border px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer shadow"
                            >
                                {selectedIds.length === messages.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                            </button>

                            {selectedIds.length > 0 && (
                                <button 
                                    onClick={() => { setDeleteType('selected'); setShowConfirmModal(true); }} 
                                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow animate-pulse"
                                >
                                    <i className="fa-solid fa-trash-can"></i> حذف المحددة ({selectedIds.length})
                                </button>
                            )}

                            <button 
                                onClick={() => { setDeleteType('all'); setShowConfirmModal(true); }} 
                                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border border-red-500/20 shadow"
                            >
                                <i className="fa-solid fa-trash-can-arrow-up"></i> حذف الكل
                            </button>
                        </>
                    )}
                    <button onClick={() => navigateRoute('admin-overview')} className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer shadow">
                        العودة لوحة التحكم
                    </button>
                </div>
            </div>

            <div className="space-y-4 pr-1">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-xs py-12">لا توجد رسائل واردة حتى الآن.</p>
                ) : (
                    messages.map(msg => {
                        const isSelected = selectedIds.includes(msg.id);
                        return (
                            <div 
                                key={msg.id} 
                                className={`bg-dark-input border p-5 rounded-2xl space-y-4 shadow-lg transition relative ${
                                    isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5' : 'border-dark-border'
                                }`}
                            >
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer bg-dark-bg/80 backdrop-blur px-3 py-1.5 rounded-xl border border-dark-border shadow">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected} 
                                            onChange={() => toggleSelectMessage(msg.id)}
                                            className="w-4 h-4 accent-indigo-500 cursor-pointer rounded"
                                        />
                                        <span className="text-[11px] font-bold text-gray-300">تحديد</span>
                                    </label>
                                </div>

                                <div className="bg-[#313338] rounded-2xl p-4 text-gray-100 text-xs shadow-inner space-y-3 font-sans">
                                    <div className="flex items-start gap-3">
                                        {/* الأفاتار قابل للنقر لعرض معلومات المرسل الحقيقي فوراً */}
                                        <img 
                                            src={msg.sender_avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                                            alt="Avatar" 
                                            onClick={() => setSelectedSenderInfo({
                                                username: msg.sender_username,
                                                avatar: msg.sender_avatar,
                                                discordId: msg.sender_discord_id || msg.sender_hash
                                            })}
                                            className="w-10 h-10 rounded-full object-cover mt-0.5 border-2 border-amber-500/60 cursor-pointer hover:scale-105 transition shadow"
                                            title="انقر لعرض معلومات الحساب الحقيقي"
                                        />
                                        <div className="flex-grow overflow-hidden pr-16 sm:pr-0">
                                            <div className="flex items-center gap-2">
                                                {/* عرض اسم المرسل الحقيقي فوراً بدلاً من مجهول في لوحة المشرفين */}
                                                <span 
                                                    onClick={() => setSelectedSenderInfo({
                                                        username: msg.sender_username,
                                                        avatar: msg.sender_avatar,
                                                        discordId: msg.sender_discord_id || msg.sender_hash
                                                    })}
                                                    className="font-bold text-white text-sm cursor-pointer hover:underline"
                                                    title="انقر لعرض معلومات الحساب الحقيقي"
                                                >
                                                    {msg.sender_username || "مستخدم غير معروف"}
                                                </span>

                                                {msg.is_anonymous && (
                                                    <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                                                        (أرسل بتخفي)
                                                    </span>
                                                )}

                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(msg.created_at).toLocaleString('ar-SA')}
                                                </span>
                                            </div>

                                            {msg.outside_image_url && <img src={msg.outside_image_url} alt="" className="rounded-lg mt-2 max-h-32 object-cover w-full" />}

                                            <div className="mt-2 bg-[#2b2d31] rounded-lg border-l-4 p-3.5 space-y-2.5 relative shadow" style={{ borderColor: msg.embed_color || '#5865F2' }}>
                                                
                                                {msg.author_name && (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                        {msg.author_icon && <img src={msg.author_icon} alt="" className="w-5 h-5 rounded-full object-cover" />}
                                                        <span>{msg.author_name}</span>
                                                    </div>
                                                )}

                                                {msg.title && (
                                                    <div className="font-bold text-white text-sm">
                                                        {msg.title_url ? <a href={msg.title_url} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{msg.title}</a> : msg.title}
                                                    </div>
                                                )}

                                                {msg.thumbnail_url && <img src={msg.thumbnail_url} alt="" className="absolute top-4 left-4 w-14 h-14 rounded-lg object-cover shadow" />}

                                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed break-words font-sans">
                                                    {renderDiscordMarkdown(msg.content)}
                                                </div>

                                                {msg.description && (
                                                    <div className="text-gray-400 text-xs whitespace-pre-wrap">
                                                        {renderDiscordMarkdown(msg.description)}
                                                    </div>
                                                )}

                                                {msg.fields && msg.fields.length > 0 && (
                                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                                        {msg.fields.map((f, i) => f.name && (
                                                            <div key={i} className={f.inline ? "inline-block mr-4" : "block"}>
                                                                <div className="font-bold text-gray-200 text-[11px]">{f.name}</div>
                                                                <div className="text-gray-400 text-[11px]">{f.value}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {msg.image_url && <img src={msg.image_url} alt="" className="rounded-lg mt-2 max-h-40 object-cover w-full shadow" />}

                                                <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-400 border-t border-gray-700/40">
                                                    <img src={logoAvatar11} alt="" className="w-4 h-4 rounded-full object-cover" />
                                                    <span>powered by dtell • {new Date(msg.created_at).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-dark-border/60">
                                    <button 
                                        onClick={() => onDeleteMessage(msg.id)} 
                                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                                    >
                                        <i className="fa-solid fa-trash-can"></i> حذف الرسالة
                                    </button>
                                    <button 
                                        onClick={() => onBlockSender(msg.sender_discord_id || msg.sender_hash)} 
                                        className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                                    >
                                        <i className="fa-solid fa-ban"></i> حظر المرسل
                                    </button>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}