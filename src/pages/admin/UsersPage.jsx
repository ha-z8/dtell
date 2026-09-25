import React, { useState } from 'react';

export default function UsersPage({ usersList = [], bannedList = [], onUpdateRole, onDeleteUser, onBlockUser, onUnblockSender, navigateRoute }) {
    const [showBannedOnly, setShowBannedOnly] = useState(false);
    const MY_ADMIN_ID = "755178727352172566";

    const isUserBanned = (userId) => {
        return bannedList.some(b => b.sender_hash === userId);
    };

    const sortedUsers = [...usersList].sort((a, b) => {
        if (a.id === MY_ADMIN_ID) return -1;
        if (b.id === MY_ADMIN_ID) return 1;

        const aIsAdmin = a.role === 'admin';
        const bIsAdmin = b.role === 'admin';
        if (aIsAdmin && !bIsAdmin) return -1;
        if (!aIsAdmin && bIsAdmin) return 1;

        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateA - dateB;
    });

    const filteredUsers = sortedUsers.filter(u => {
        const banned = isUserBanned(u.id);
        return showBannedOnly ? banned : !banned;
    });

    const bannedCount = usersList.filter(u => isUserBanned(u.id)).length;
    const activeCount = usersList.length - bannedCount;

    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-border pb-5">
                <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                        <i className="fa-solid fa-users-gear text-indigo-500"></i> نظام إدارة المستخدمين والمحظورين
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">الترتيب التلقائي: المالك أولاً، ثم المشرفون، يليهم المستخدمون بحسب تاريخ التسجيل.</p>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* زر التبديل بالألوان المطلوبة */}
                    <button 
                        onClick={() => setShowBannedOnly(!showBannedOnly)} 
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow border ${
                            showBannedOnly 
                                ? 'bg-dark-input text-gray-300 border-dark-border hover:border-indigo-500' // إذا كنا في قائمة المحظورين
                                : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'   // إذا كنا في القائمة العادية (يكون لونه أحمر)
                        }`}
                    >
                        <i className={`fa-solid ${showBannedOnly ? 'fa-user-check text-emerald-400' : 'fa-user-slash text-red-400'}`}></i>
                        {showBannedOnly ? `عرض المستخدمين المفعلين (${activeCount})` : `عرض المحظورين فقط (${bannedCount})`}
                    </button>

                    <button 
                        onClick={() => navigateRoute('admin-overview')} 
                        className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer flex items-center gap-2 shadow"
                    >
                        <i className="fa-solid fa-arrow-right"></i> لوحة التحكم
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-dark-border text-gray-400 text-xs font-bold">
                            <th className="py-3 px-4">المستخدم</th>
                            <th className="py-3 px-4">اسم الحساب (Username)</th>
                            <th className="py-3 px-4">Discord ID</th>
                            <th className="py-3 px-4">تاريخ التسجيل</th>
                            <th className="py-3 px-4">حالة الحساب</th>
                            <th className="py-3 px-4">الصلاحية</th>
                            <th className="py-3 px-4 text-center">الإجراءات والتحكم</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border text-xs">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-gray-500 italic">
                                    {showBannedOnly ? "لا يوجد مستخدمون محظورون حالياً." : "لا يوجد مستخدمون مسجلون في القائمة."}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(u => {
                                const banned = isUserBanned(u.id);
                                const isOwner = u.id === MY_ADMIN_ID;

                                return (
                                    <tr key={u.id} className={`hover:bg-dark-input/50 transition ${isOwner ? 'bg-indigo-500/5' : ''}`}>
                                        <td className="py-4 px-4 flex items-center gap-3">
                                            <img 
                                                src={u.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                                                alt="" 
                                                className="w-9 h-9 rounded-full object-cover border border-dark-border shadow-inner" 
                                            />
                                            <div>
                                                <div className="font-bold text-white text-sm flex items-center gap-2">
                                                    {u.global_name || u.username}
                                                    {isOwner && <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">المالك</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-300 font-mono">@{u.username}</td>
                                        <td className="py-4 px-4 text-gray-400 font-mono">{u.id}</td>
                                        <td className="py-4 px-4 text-gray-400 text-[11px]">
                                            {u.created_at ? new Date(u.created_at).toLocaleString('ar-SA') : 'غير متوفر'}
                                        </td>
                                        
                                        <td className="py-4 px-4">
                                            {banned ? (
                                                <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-xl font-bold text-[11px] border border-red-500/30 flex items-center gap-1.5 w-fit">
                                                    <i className="fa-solid fa-ban text-red-400"></i> محظور
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                                                    <i className="fa-solid fa-circle-check text-emerald-400"></i> فعال
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4">
                                            <select 
                                                value={u.role || 'user'} 
                                                onChange={(e) => onUpdateRole(u.id, e.target.value)}
                                                disabled={isOwner}
                                                className="bg-dark-bg border border-dark-border px-3.5 py-2 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-bold shadow-sm disabled:opacity-50"
                                            >
                                                <option value="user">مستخدم (User)</option>
                                                <option value="admin">مشرف (Admin)</option>
                                            </select>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {banned ? (
                                                    <button 
                                                        onClick={() => {
                                                            const banRecord = bannedList.find(b => b.sender_hash === u.id);
                                                            if (banRecord) onUnblockSender(banRecord.id);
                                                        }} 
                                                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                                                    >
                                                        <i className="fa-solid fa-rotate-left"></i> فك الحظر
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => onBlockUser(u.id)} 
                                                        disabled={isOwner}
                                                        className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="fa-solid fa-ban"></i> حظر
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => onDeleteUser(u.id)} 
                                                    disabled={isOwner}
                                                    className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="حذف الحساب"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i> حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}