import React from 'react';

export default function FeaturesPage({ features = [], onToggleFeature, navigateRoute }) {
    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-5">
                <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                        <i className="fa-solid fa-sliders text-indigo-500"></i> إعدادات وتصميم ميزات منصة الإرسال
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">تفعيل أو إخفاء ميزات واجهة الإرسال للمستخدمين فوراً. الميزات الأساسية مقفلة ولا يمكن إيقافها.</p>
                </div>
                <button 
                    onClick={() => navigateRoute('admin-overview')} 
                    className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer flex items-center gap-2 shadow"
                >
                    <i className="fa-solid fa-arrow-right"></i> لوحة التحكم
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map(feat => (
                    <div key={feat.key} className={`bg-dark-input border p-5 rounded-2xl flex items-center justify-between shadow-inner ${feat.is_locked ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-dark-border'}`}>
                        <div className="space-y-1">
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                                {feat.name}
                                {feat.is_locked && (
                                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-indigo-500/30">
                                        ميزة أساسية (مقفلة)
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-400 text-xs">
                                {feat.is_enabled ? 'الميزة ظاهرة وتعمل للمستخدمين' : 'الميزة مخفية ومعطلة تماماً من الواجهة'}
                            </div>
                        </div>

                        <button 
                            onClick={() => !feat.is_locked && onToggleFeature(feat.key, !feat.is_enabled)}
                            disabled={feat.is_locked}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow ${
                                feat.is_locked 
                                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30' 
                                    : feat.is_enabled 
                                        ? 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 cursor-pointer' 
                                        : 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 cursor-pointer'
                            }`}
                        >
                            {feat.is_locked ? (
                                <>
                                    <i className="fa-solid fa-lock"></i> إجباري
                                </>
                            ) : feat.is_enabled ? (
                                <>
                                    <i className="fa-solid fa-check"></i> مفعلة (إيقاف)
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-xmark"></i> معطلة (تفعيل)
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}