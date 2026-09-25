import React, { useState } from 'react';
import logoIcon from '../assets/1.png';

export default function Header({ user, isAdmin, navigateRoute, handleLogin, handleLogout, t }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="w-full mx-auto flex justify-between items-center bg-dark-card border border-dark-border px-6 py-4 rounded-3xl shadow-2xl mb-8 relative z-50 font-sans">
            
            {/* الشعار */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigateRoute('home')}>
                <div className="w-11 h-11 bg-dark-input border border-indigo-500/40 rounded-2xl flex items-center justify-center p-2.5 shadow-inner group-hover:border-indigo-500 transition">
                    <img src={logoIcon} alt="Icon" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* الأزرار وقائمة الحساب */}
            <div className="flex items-center gap-3 relative">
                
                {user ? (
                    <div className="relative">
                        <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2.5 bg-dark-input border border-dark-border px-4 py-2 rounded-2xl cursor-pointer hover:border-indigo-500 transition select-none"
                        >
                            <img src={user.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-indigo-500/30" />
                            <span className="text-xs font-bold text-gray-200">{user.global_name}</span>
                            <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                        </div>

                        {/* القائمة المنسدلة */}
                        {isDropdownOpen && (
                            <div className="absolute mt-2 w-56 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden py-2 z-50 left-0">
                                <div className="px-4 py-2 border-b border-dark-border mb-1">
                                    <div className="text-[11px] text-gray-400">حسابك المتصل</div>
                                    <div className="text-xs font-bold text-white truncate">@{user.username}</div>
                                </div>

                                {isAdmin && (
                                    <button 
                                        onClick={() => { navigateRoute('admin-overview'); setIsDropdownOpen(false); }}
                                        className="w-full text-right px-4 py-2.5 text-xs text-gray-200 hover:bg-indigo-600/20 hover:text-indigo-400 transition flex items-center gap-2.5 cursor-pointer font-bold"
                                    >
                                        <i className="fa-solid fa-gear w-4 text-indigo-400"></i> لوحة التحكم والإدارة
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                                    className="w-full text-right px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition flex items-center gap-2.5 cursor-pointer font-bold mt-0.5 border-t border-dark-border/50"
                                >
                                    <i className="fa-solid fa-right-from-bracket w-4"></i> تسجيل الخروج
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={handleLogin}
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
                    >
                        <i className="fa-brands fa-discord"></i> تسجيل الدخول عبر ديسكورد
                    </button>
                )}

            </div>

        </header>
    );
}