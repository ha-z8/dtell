import React from 'react';
import logoFullAr from '../assets/5.png';

export default function Dashboard({ messages, usersList = [], bannedList = [], navigateRoute }) {
    const bannedCount = bannedList.length;
    const activeUsersCount = usersList.length - bannedCount;

    return (
        <div className="w-full space-y-6 py-2 font-sans">
            
            {/* الهيدر الترحيبي للوحة التحكم */}
            <div className="bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <img src={logoFullAr} alt="dtell" className="h-8 object-contain mb-2" />
                    <h1 className="text-2xl font-black text-white">لوحة التحكم والأمان</h1>
                    <p className="text-gray-400 text-xs">إدارة النظام، صندوق الرسائل، المستخدمين، تصميم الميزات، إدارة السياسات، والويب هوك.</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-300 hover:border-indigo-500 transition cursor-pointer flex items-center gap-2 shadow"
                >
                    <i className="fa-solid fa-rotate"></i> تحديث البيانات
                </button>
            </div>

            {/* بطاقات الإحصائيات والأقسام */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* بطاقة صندوق الرسائل */}
                <div 
                    onClick={() => navigateRoute('admin-messages')} 
                    className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-xl hover:border-indigo-500/50 transition cursor-pointer flex justify-between items-center group"
                >
                    <div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">صندوق الرسائل الواردة</div>
                        <div className="text-2xl font-black text-white">{messages.length}</div>
                    </div>
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 text-xl group-hover:scale-110 transition shadow-inner">
                        <i className="fa-solid fa-inbox"></i>
                    </div>
                </div>

                {/* بطاقة المستخدمين */}
                <div 
                    onClick={() => navigateRoute('admin-users')} 
                    className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-xl hover:border-emerald-500/50 transition cursor-pointer flex justify-between items-center group"
                >
                    <div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">المستخدمون المسجلون</div>
                        <div className="text-2xl font-black text-emerald-400">{activeUsersCount >= 0 ? activeUsersCount : 0}</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition shadow-inner">
                        <i className="fa-solid fa-users"></i>
                    </div>
                </div>

                {/* بطاقة تصميم الميزات */}
                <div 
                    onClick={() => navigateRoute('admin-features')} 
                    className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-xl hover:border-amber-500/50 transition cursor-pointer flex justify-between items-center group"
                >
                    <div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">إدارة وتصميم الميزات</div>
                        <div className="text-sm font-bold text-amber-400">تفعيل وتعطيل الميزات</div>
                    </div>
                    <div className="w-12 h-12 bg-amber-600/20 rounded-2xl flex items-center justify-center text-amber-400 text-xl group-hover:scale-110 transition shadow-inner">
                        <i className="fa-solid fa-sliders"></i>
                    </div>
                </div>

                {/* بطاقة إدارة سياسة الخصوصية والشروط */}
                <div 
                    onClick={() => navigateRoute('admin-policies')} 
                    className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-xl hover:border-blue-500/50 transition cursor-pointer flex justify-between items-center group"
                >
                    <div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">إدارة السياسات والشروط</div>
                        <div className="text-sm font-bold text-blue-400">تعديل وحذف وتعطيل الظهور</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 text-xl group-hover:scale-110 transition shadow-inner">
                        <i className="fa-solid fa-file-shield"></i>
                    </div>
                </div>

                {/* بطاقة إعدادات الويب هوك */}
                <div 
                    onClick={() => navigateRoute('admin-webhook')} 
                    className="bg-dark-card border border-dark-border p-6 rounded-3xl shadow-xl hover:border-purple-500/50 transition cursor-pointer flex justify-between items-center group"
                >
                    <div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">إعدادات الويب هوك</div>
                        <div className="text-sm font-bold text-purple-400">تعديل الرابط والبوت</div>
                    </div>
                    <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 text-xl group-hover:scale-110 transition shadow-inner">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                </div>

            </div>

        </div>
    );
}