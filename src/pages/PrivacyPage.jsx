import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PrivacyPage({ currentRoute, navigateRoute }) {
    const [policy, setPolicy] = useState(null);
    const policyKey = currentRoute || 'privacy';

    useEffect(() => {
        fetchPolicy();
    }, [currentRoute]);

    const fetchPolicy = async () => {
        const { data } = await supabase.from('site_policies').select('*').eq('key', policyKey).single();
        if (data) setPolicy(data);
    };

    if (!policy || !policy.is_enabled) {
        return (
            <div className="w-full bg-dark-card border border-dark-border p-12 rounded-3xl shadow-2xl text-center space-y-4 max-w-2xl mx-auto font-sans">
                <div className="text-amber-400 text-3xl"><i className="fa-solid fa-triangle-exclamation"></i></div>
                <h3 className="text-white font-black text-lg">عذراً، هذه الصفحة غير متوفرة أو تم تعطيلها مؤقتاً.</h3>
                <button onClick={() => navigateRoute('home')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer">العودة للرئيسية</button>
            </div>
        );
    }

    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-10 rounded-3xl shadow-2xl space-y-6 font-sans max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-dark-border pb-5">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                        <i className="fa-solid fa-shield-halved text-indigo-500"></i> {policy.title}
                    </h2>
                </div>
                <button onClick={() => navigateRoute('home')} className="bg-dark-input hover:bg-dark-border border border-dark-border px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition cursor-pointer shadow flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right"></i> العودة للموقع
                </button>
            </div>

            <div className="bg-dark-input p-6 rounded-2xl border border-dark-border text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {policy.content}
            </div>
        </div>
    );
}