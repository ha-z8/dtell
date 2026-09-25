import React from 'react';
import logoFullAr from '../assets/5.png';

export default function AdminHeader({ navigateRoute }) {
    return (
        <header className="w-full bg-dark-card border border-dark-border px-6 py-4 rounded-3xl shadow-xl flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateRoute('admin-overview')}>
                <img src={logoFullAr} alt="dtell" className="h-7 object-contain" />
                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-xl font-bold border border-indigo-500/30">
                    لوحة المشرفين
                </span>
            </div>

            <button onClick={() => navigateRoute('home')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow">
                الذهاب للموقع الرئيسي
            </button>
        </header>
    );
}