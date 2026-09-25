import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import logoFullAr from '../assets/1.png';

export default function Footer({ navigateRoute }) {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetchEnabledPolicies();
    }, []);

    const fetchEnabledPolicies = async () => {
        const { data } = await supabase.from('site_policies').select('key, title, is_enabled').eq('is_enabled', true);
        if (data) setPolicies(data);
    };

    return (
        <footer className="w-full bg-dark-card border border-dark-border px-6 py-4 rounded-3xl shadow-xl mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-sans">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateRoute('home')}>
                <img src={logoFullAr} alt="dtell" className="h-8 object-contain" />
            </div>

            <div className="flex flex-wrap items-center gap-5">
                {policies.map((p, index) => (
                    <React.Fragment key={p.key}>
                        {index > 0 && <span className="text-dark-border">•</span>}
                        <button 
                            onClick={() => navigateRoute(p.key)} 
                            className="hover:text-indigo-400 transition cursor-pointer font-bold flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-shield-halved text-[11px]"></i> {p.title}
                        </button>
                    </React.Fragment>
                ))}
            </div>
        </footer>
    );
}