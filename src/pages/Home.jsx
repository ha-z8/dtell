import React, { useState } from 'react';
import logoAvatar11 from '../assets/11.png';

export default function Home({ user, features = [], onSendMessage, onLogin }) {
    const [messageContent, setMessageContent] = useState('');
    const [title, setTitle] = useState('');
    const [titleUrl, setTitleUrl] = useState('');
    const [description, setDescription] = useState('');
    
    const [authorName, setAuthorName] = useState('');
    const [authorIcon, setAuthorIcon] = useState('');
    const [showTimestamp, setShowTimestamp] = useState(true);
    
    const [imageUrl, setImageUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [outsideImageUrl, setOutsideImageUrl] = useState('');
    
    const [fields, setFields] = useState([{ name: '', value: '', inline: false }]);
    const [embedColor, setEmbedColor] = useState('#5865F2');
    const [isAnonymous, setIsAnonymous] = useState(true);

    const isFeatureEnabled = (key) => {
        const feat = features.find(f => f.key === key);
        return feat ? feat.is_enabled : true;
    };

    const handleResetForm = () => {
        setMessageContent('');
        setTitle('');
        setTitleUrl('');
        setDescription('');
        setAuthorName('');
        setAuthorIcon('');
        setShowTimestamp(true);
        setImageUrl('');
        setThumbnailUrl('');
        setOutsideImageUrl('');
        setFields([{ name: '', value: '', inline: false }]);
        setEmbedColor('#5865F2');
        setIsAnonymous(true);
    };

    const handleAddField = () => setFields([...fields, { name: '', value: '', inline: false }]);
    const handleFieldChange = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };
    const handleRemoveField = (index) => setFields(fields.filter((_, i) => i !== index));
    
    const handleMoveField = (index, direction) => {
        const newFields = [...fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newFields.length) {
            const temp = newFields[index];
            newFields[index] = newFields[targetIndex];
            newFields[targetIndex] = temp;
            setFields(newFields);
        }
    };

    const insertFormatting = (syntax, wrapper = false) => {
        if (wrapper) {
            setMessageContent(prev => `${prev}${syntax}نص هنا${syntax}`);
        } else {
            setMessageContent(prev => prev + syntax);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage({
            content: messageContent,
            title,
            titleUrl,
            description,
            authorName,
            authorIcon,
            showTimestamp,
            thumbnailUrl,
            imageUrl,
            outsideImageUrl,
            fields: fields.filter(f => f.name.trim() !== ''),
            embedColor,
            isAnonymous
        });
        handleResetForm();
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
                        <div key={index} className="bg-[#1e1f22] p-3 rounded-lg font-mono text-xs text-gray-200 border border-gray-700/50 my-1 overflow-x-auto shadow-inner">
                            <pre>{part}</pre>
                        </div>
                    );
                }
                return <span key={index}>{part}</span>;
            });
        }

        let formatted = text
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-500 pl-3 my-1 text-gray-400 italic">$1</blockquote>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/\|\|(.*?)\|\|/g, '<span class="bg-[#393c43] text-transparent hover:text-gray-100 rounded px-1 transition cursor-pointer select-none" title="انقر للإظهار">$1</span>')
            .replace(/`(.*?)`/g, '<code class="bg-[#1e1f22] px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]">$1</code>');
        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start font-sans">
            
            {/* المعاينة الحية */}
            <div className="xl:col-span-4 bg-dark-card border border-dark-border p-5 rounded-3xl shadow-2xl xl:sticky xl:top-6">
                <div className="flex items-center justify-between mb-4 border-b border-dark-border pb-3">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                        <i className="fa-solid fa-eye"></i> معاينة الرسالة الحية
                    </span>
                </div>

                <div className="bg-[#313338] rounded-2xl p-4 text-gray-100 text-xs shadow-inner space-y-3 font-sans">
                    <div className="flex items-start gap-3">
                        <img 
                            src={!isAnonymous && user ? user.avatar : logoAvatar11} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full object-cover mt-0.5 border border-indigo-500/30"
                        />
                        <div className="flex-grow overflow-hidden">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                    {!isAnonymous && user ? user.global_name : "مجهول | dtell"}
                                </span>
                                <span className="bg-[#5865F2] text-white text-[10px] px-1.5 py-0.2 rounded font-semibold">BOT</span>
                            </div>

                            {isFeatureEnabled('media') && outsideImageUrl && <img src={outsideImageUrl} alt="" className="rounded-lg mt-2 max-h-32 object-cover w-full" />}

                            <div className="mt-2 bg-[#2b2d31] rounded-lg border-l-4 p-3.5 space-y-2.5 relative shadow" style={{ borderColor: embedColor }}>
                                
                                {isFeatureEnabled('author') && authorName && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        {authorIcon && <img src={authorIcon} alt="" className="w-5 h-5 rounded-full object-cover" />}
                                        <span>{authorName}</span>
                                    </div>
                                )}

                                {title && (
                                    <div className="font-bold text-white text-sm">
                                        {isFeatureEnabled('title_url') && titleUrl ? <span className="text-indigo-400 underline">{title}</span> : title}
                                    </div>
                                )}
                                
                                {isFeatureEnabled('media') && thumbnailUrl && <img src={thumbnailUrl} alt="" className="absolute top-4 left-4 w-14 h-14 rounded-lg object-cover shadow" />}
                                
                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                                    {messageContent ? renderDiscordMarkdown(messageContent) : <span className="text-gray-500 italic">اكتب محتوى الرسالة هنا...</span>}
                                </div>

                                {description && (
                                    <div className="text-gray-400 text-xs whitespace-pre-wrap">
                                        {renderDiscordMarkdown(description)}
                                    </div>
                                )}

                                {isFeatureEnabled('fields') && fields.length > 0 && fields.some(f => f.name) && (
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                        {fields.map((f, i) => f.name && (
                                            <div key={i} className={f.inline ? "inline-block mr-4" : "block"}>
                                                <div className="font-bold text-gray-200 text-[11px]">{f.name}</div>
                                                <div className="text-gray-400 text-[11px]">{f.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isFeatureEnabled('media') && imageUrl && <img src={imageUrl} alt="" className="rounded-lg mt-2 max-h-40 object-cover w-full shadow" />}

                                <div className="flex items-center gap-2 pt-2 text-[10px] text-gray-400 border-t border-gray-700/40">
                                    <img src={logoAvatar11} alt="" className="w-4 h-4 rounded-full object-cover" />
                                    <span>powered by dtell {showTimestamp ? '• اليوم الساعة 12:00 ص' : ''}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* نموذج الإرسال */}
            <div className="xl:col-span-8 bg-dark-card border border-dark-border p-6 md:p-8 rounded-3xl shadow-2xl w-full space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-4">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2.5 mb-1">
                            <i className="fa-solid fa-paper-plane text-indigo-500"></i> منصة إرسال الرسائل المجهولة
                        </h2>
                        <p className="text-gray-400 text-xs">قم بتصميم وإرسال رسائلك المجهولة المخصصة بكل احترافية.</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleResetForm}
                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border border-red-500/20 shadow"
                    >
                        <i className="fa-solid fa-rotate-right"></i> إعادة تعيين
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {isFeatureEnabled('author') && (
                        <div className="bg-dark-input border border-dark-border p-4 rounded-2xl space-y-4">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                <i className="fa-solid fa-signature text-indigo-400"></i> تخصيص المرسل (Author)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="اسم المرسل المخصص" className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-200" />
                                <input type="url" value={authorIcon} onChange={(e) => setAuthorIcon(e.target.value)} placeholder="رابط الأيقونة (Icon URL)" className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-200 font-mono" />
                            </div>
                        </div>
                    )}

                    <div className="bg-dark-input border border-dark-border p-4 rounded-2xl space-y-4">
                        <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                            <i className="fa-solid fa-message text-indigo-400"></i> محتوى الرسالة والتنسيقات
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الرسالة الرئيسي" className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-200" />
                            {isFeatureEnabled('title_url') && (
                                <input type="url" value={titleUrl} onChange={(e) => setTitleUrl(e.target.value)} placeholder="رابط العنوان (Title URL)" className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-200 font-mono" />
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[11px] text-gray-400">أدوات التنسيق السريع</label>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-1.5 bg-dark-bg p-2.5 rounded-xl border border-dark-border mb-2.5">
                                <button type="button" onClick={() => insertFormatting('**', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs font-bold cursor-pointer">عريض</button>
                                <button type="button" onClick={() => insertFormatting('*', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs italic cursor-pointer">مائل</button>
                                <button type="button" onClick={() => insertFormatting('__', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs underline cursor-pointer">تسطير</button>
                                <button type="button" onClick={() => insertFormatting('~~', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs line-through cursor-pointer">توسط</button>
                                <button type="button" onClick={() => insertFormatting('||', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs cursor-pointer">مخفي</button>
                                <button type="button" onClick={() => insertFormatting('`', true)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-gray-300 text-xs font-mono cursor-pointer">`كود`</button>
                                <button type="button" onClick={() => insertFormatting('```\nالنص هنا\n```', false)} className="px-2.5 py-1.5 hover:bg-dark-input rounded text-indigo-300 text-xs font-mono font-bold cursor-pointer">``` بلوك كود ```</button>
                                
                                <div className="h-4 w-[1px] bg-dark-border mx-1"></div>

                                <button type="button" onClick={() => insertFormatting('```diff\n- عنصر محذوف\n+ عنصر مضاف\n! تنبيه مهم\n# ملاحظة جانبية\n```', false)} className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer flex items-center gap-1 shadow-sm">
                                    <i className="fa-solid fa-code-merge text-[10px]"></i> قالب الألوان
                                </button>

                                <button type="button" onClick={() => insertFormatting('> ', false)} className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shadow-sm">
                                    <i className="fa-solid fa-quote-right text-[10px]"></i> اقتباس
                                </button>
                            </div>
                        </div>

                        <textarea 
                            rows="6"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder="اكتب محتوى الرسالة هنا..."
                            required
                            className="w-full bg-dark-bg border border-dark-border rounded-2xl p-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition resize-none font-mono leading-relaxed"
                        ></textarea>

                        <textarea 
                            rows="2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="وصف إضافي..."
                            className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                        ></textarea>
                    </div>

                    {isFeatureEnabled('fields') && (
                        <div className="bg-dark-input border border-dark-border p-4 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                    <i className="fa-solid fa-list text-indigo-400"></i> الحقول الإضافية
                                </label>
                                <button type="button" onClick={handleAddField} className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[11px] px-3 py-1.5 rounded-xl font-bold transition cursor-pointer">
                                    + إضافة حقل
                                </button>
                            </div>
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-center gap-2 bg-dark-bg p-3 rounded-2xl border border-dark-border">
                                        <input 
                                            type="text" 
                                            value={field.name}
                                            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                            placeholder="العنوان"
                                            className="flex-grow w-full bg-dark-input border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200"
                                        />
                                        <input 
                                            type="text" 
                                            value={field.value}
                                            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                            placeholder="القيمة"
                                            className="flex-grow w-full bg-dark-input border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200"
                                        />
                                        <div className="flex gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border">
                                            <button type="button" onClick={() => handleMoveField(index, 'up')} disabled={index === 0} className="w-7 h-6 flex items-center justify-center bg-dark-input text-gray-300 rounded-lg text-xs disabled:opacity-25 cursor-pointer"><i className="fa-solid fa-chevron-up text-[9px]"></i></button>
                                            <button type="button" onClick={() => handleMoveField(index, 'down')} disabled={index === fields.length - 1} className="w-7 h-6 flex items-center justify-center bg-dark-input text-gray-300 rounded-lg text-xs disabled:opacity-25 cursor-pointer"><i className="fa-solid fa-chevron-down text-[9px]"></i></button>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveField(index)} className="bg-red-500/20 hover:bg-red-500 text-white px-3 py-2 rounded-xl text-xs transition cursor-pointer"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isFeatureEnabled('media') && (
                        <div className="bg-dark-input border border-dark-border p-4 rounded-2xl space-y-4">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                <i className="fa-solid fa-image text-indigo-400"></i> الوسائط والصور
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] text-gray-400 mb-1">صورة رئيسية</label>
                                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-gray-400 mb-1">صورة مصغرة</label>
                                    <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-gray-400 mb-1">صورة خارجية</label>
                                    <input type="url" value={outsideImageUrl} onChange={(e) => setOutsideImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200 font-mono" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-dark-input border border-dark-border p-4 rounded-2xl space-y-4">
                        <div>
                            <label className="block text-[11px] text-gray-400 mb-1">لون البطانة</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={embedColor} onChange={(e) => setEmbedColor(e.target.value)} className="w-10 h-10 bg-dark-bg border border-dark-border rounded-xl cursor-pointer p-1" />
                                <input type="text" value={embedColor} onChange={(e) => setEmbedColor(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-gray-200 font-mono" />
                            </div>
                        </div>

                        {user && (
                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="anonCheck" checked={!isAnonymous} onChange={(e) => setIsAnonymous(!e.target.checked)} className="w-4 h-4 accent-indigo-500 cursor-pointer rounded" />
                                <label htmlFor="anonCheck" className="text-xs text-gray-300 cursor-pointer select-none font-medium">
                                    إرسال باسم حسابي الحقيقي ({user.global_name})
                                </label>
                            </div>
                        )}
                    </div>

                    {user ? (
                        <button type="submit" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 rounded-2xl text-sm transition shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer">
                            <i className="fa-solid fa-paper-plane"></i> إرسال الرسالة الآن
                        </button>
                    ) : (
                        <button type="button" onClick={onLogin} className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 rounded-2xl text-sm transition shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer">
                            <i className="fa-brands fa-discord"></i> تسجيل الدخول للإرسال
                        </button>
                    )}

                </form>
            </div>

        </div>
    );
}