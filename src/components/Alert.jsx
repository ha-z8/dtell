import React, { useEffect, useState } from 'react';

export default function Alert({ alert, onDismiss }) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!alert.text) return;

        setProgress(100);
        const duration = 4000; // 4 ثوانٍ
        const intervalTime = 40;
        const decrement = (intervalTime / duration) * 100;

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(progressTimer);
                    return 0;
                }
                return prev - decrement;
            });
        }, intervalTime);

        const hideTimer = setTimeout(() => {
            onDismiss();
        }, duration);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(hideTimer);
        };
    }, [alert.key]);

    if (!alert.text) return null;

    const isError = alert.type === 'error';

    return (
        <div className="fixed bottom-6 left-6 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className={`relative overflow-hidden flex items-center justify-between gap-4 p-4 rounded-2xl shadow-2xl border text-xs font-bold backdrop-blur-md min-w-[300px] max-w-md ${
                isError 
                    ? 'bg-red-500/15 text-red-300 border-red-500/30' 
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}>
                <div className="flex items-center gap-3">
                    <i className={`fa-solid ${isError ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-emerald-400'} text-base`}></i>
                    <span>{alert.text}</span>
                </div>

                {/* زر الإغلاق اليدوي */}
                <button 
                    onClick={onDismiss}
                    className="w-6 h-6 flex items-center justify-center rounded-xl bg-black/20 hover:bg-black/40 transition text-gray-300 cursor-pointer text-[10px]"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* شريط التقدم الزمني المنبثق */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                    <div 
                        className={`h-full transition-all duration-75 linear ${isError ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}