import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function WebhookPage({ tempWebhook, setTempWebhook, onSaveWebhook, navigateRoute }) {
    const [anonName, setAnonName] = useState('مجهول | dtell');
    const [anonAvatar, setAnonAvatar] = useState('https://cdn.discordapp.com/embed/avatars/0.png');
    const [savedMsg, setSavedMsg] = useState('');

    useEffect(() => {
        fetchAnonBotSettings();
    }, []);

    const fetchAnonBotSettings = async () => {
        const { data } = await supabase.from('settings').select('*').in('key', ['anon_bot_name', 'anon_bot_avatar']);
        if (data) {
            data.forEach(item => {
                if (item.key === 'anon_bot_name') setAnonName(item.value);
                if (item.key === 'anon_bot_avatar') setAnonAvatar(item.value);
            });
        }
    };

    const handleSaveAnonBot = async (e) => {
        e.preventDefault();
        await supabase.from('settings').upsert({ key: 'anon_bot_name', value: anonName });
        await supabase.from('settings').upsert({ key: 'anon_bot_avatar', value: anonAvatar });
        setSavedMsg('تم حفظ إعدادات البوت المجهول بنجاح!');
        setTimeout(() => setSavedMsg(''), 3000);
    };

    return (
        <div className="w-full bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
            <div className="flex justify-between items-center border-b border-dark-border pb-4">
                <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                    <i className="fa-solid fa-gear"></i> إعدادات الويب هوك والبوت المجهول
                </h2>
                <button onClick={() => navigateRoute('admin-overview')} className="bg-dark-input px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:border-indigo-500 transition cursor-pointer">
                    العودة للوحة التحكم
                </button>
            </div>

            {savedMsg && (
                <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center text-xs font-bold border border-emerald-500/30">
                    {savedMsg}
                </div>
            )}

            {/* إعدادات الويب هوك الأساسي */}
            <form onSubmit={onSaveWebhook} className="space-y-3 bg-dark-input p-4 rounded-2xl border border-dark-border">
                <label className="block text-xs font-bold text-gray-300">رابط الويب هوك (Discord Webhook URL)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text"
                        value={tempWebhook}
                        onChange={(e) => setTempWebhook(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                        required
                        className="flex-grow bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow">
                        حفظ الويب هوك
                    </button>
                </div>
            </form>

            {/* إعدادات اسم وصورة البوت المجهول */}
            <form onSubmit={handleSaveAnonBot} className="space-y-4 bg-dark-input p-4 rounded-2xl border border-dark-border">
                <label className="block text-xs font-bold text-gray-300 flex items-center gap-2">
                    <i className="fa-solid fa-user-secret text-indigo-400"></i> تخصيص اسم وصورة البوت عندما يكون الإرسال (مجهول)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] text-gray-400 mb-1">اسم البوت المجهول</label>
                        <input 
                            type="text"
                            value={anonName}
                            onChange={(e) => setAnonName(e.target.value)}
                            required
                            className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-gray-400 mb-1">رابط صورة (Avatar) البوت المجهول</label>
                        <input 
                            type="url"
                            value={anonAvatar}
                            onChange={(e) => setAnonAvatar(e.target.value)}
                            required
                            className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-100 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                    </div>
                </div>

                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow">
                    حفظ إعدادات المجهول
                </button>
            </form>
        </div>
    );
}