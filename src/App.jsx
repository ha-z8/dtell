import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import Alert from './components/Alert';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MessagesPage from './pages/admin/MessagesPage';
import UsersPage from './pages/admin/UsersPage';
import FeaturesPage from './pages/admin/FeaturesPage';
import PoliciesManagerPage from './pages/admin/PoliciesManagerPage';
import WebhookPage from './pages/admin/WebhookPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [currentRoute, setCurrentRoute] = useState('home');
    
    const [messages, setMessages] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [bannedList, setBannedList] = useState([]);
    const [features, setFeatures] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [tempWebhook, setTempWebhook] = useState('');
    
    const [alert, setAlert] = useState({ text: '', type: '', key: 0 });

    const CLIENT_ID = "1552770073121394810";
    const REDIRECT_URI = "http://localhost:5174/";
    const MY_ADMIN_ID = "755178727352172566";

    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('/admin')) {
            setCurrentRoute('admin-overview');
        }

        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
        if (accessToken) {
            fetchDiscordUser(accessToken);
        } else {
            const savedUser = localStorage.getItem('dtell_user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                checkAdminStatus(parsedUser.id);
            }
        }
        fetchMessages();
        fetchUsersList();
        fetchWebhook();
        fetchBannedSenders();
        fetchFeatures();
    }, []);

    const fetchDiscordUser = async (token) => {
        try {
            const res = await fetch('https://discord.com/api/users/@me', {
                headers: { authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.id) {
                let avatarUrl = `https://cdn.discordapp.com/embed/avatars/0.png`;
                if (data.avatar) {
                    const format = data.avatar.startsWith('a_') ? 'gif' : 'png';
                    avatarUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${format}`;
                }

                const { data: dbUser } = await supabase.from('users').select('role').eq('id', data.id).single();
                const userRole = (data.id === MY_ADMIN_ID || (dbUser && dbUser.role === 'admin')) ? 'admin' : 'user';

                const userData = {
                    id: data.id,
                    username: data.username,
                    global_name: data.global_name || data.username,
                    avatar: avatarUrl,
                    role: userRole
                };

                setUser(userData);
                localStorage.setItem('dtell_user', JSON.stringify(userData));
                checkAdminStatus(data.id);

                await supabase.from('users').upsert({
                    id: userData.id,
                    username: userData.username,
                    global_name: userData.global_name,
                    avatar: userData.avatar,
                    role: userData.role
                });

                fetchUsersList();
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const checkAdminStatus = async (userId) => {
        if (userId === MY_ADMIN_ID) {
            setIsAdmin(true);
            return;
        }
        const { data } = await supabase.from('users').select('role').eq('id', userId).single();
        if (data && data.role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    const fetchMessages = async () => {
        const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
    };

    const fetchUsersList = async () => {
        const { data } = await supabase.from('users').select('*');
        if (data) setUsersList(data);
    };

    const fetchWebhook = async () => {
        const { data } = await supabase.from('settings').select('value').eq('key', 'webhook_url').single();
        if (data) {
            setWebhookUrl(data.value);
            setTempWebhook(data.value);
        }
    };

    const fetchBannedSenders = async () => {
        const { data } = await supabase.from('banned_senders').select('*');
        if (data) setBannedList(data);
    };

    const fetchFeatures = async () => {
        const { data } = await supabase.from('feature_toggles').select('*');
        if (data) setFeatures(data);
    };

    const handleToggleFeature = async (key, newState) => {
        const { error } = await supabase.from('feature_toggles').update({ is_enabled: newState }).eq('key', key);
        if (!error) {
            showAlert('تم تحديث حالة الميزة بنجاح');
            fetchFeatures();
        } else {
            showAlert('فشل تحديث الميزة', 'error');
        }
    };

    const showAlert = (text, type = 'success') => {
        setAlert({ text, type, key: Date.now() });
    };

    const handleLogin = () => {
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    };

    const handleLogout = () => {
        setUser(null);
        setIsAdmin(false);
        navigateRoute('home');
        localStorage.removeItem('dtell_user');
        showAlert('تم تسجيل الخروج بنجاح');
    };

    const navigateRoute = (route) => {
        setCurrentRoute(route);
        if (route.startsWith('admin')) {
            window.history.pushState({}, '', '/admin');
        } else {
            window.history.pushState({}, '', '/');
        }
    };

    const handleSaveWebhook = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('settings').update({ value: tempWebhook }).eq('key', 'webhook_url');
        if (!error) {
            setWebhookUrl(tempWebhook);
            showAlert('تم تحديث إعدادات النظام بنجاح');
        } else {
            showAlert('فشل حفظ الويب هوك', 'error');
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        if (userId === MY_ADMIN_ID && newRole !== 'admin') {
            showAlert('لا يمكن تغيير صلاحية الحساب الأساسي للمالك!', 'error');
            return;
        }
        const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
        if (!error) {
            showAlert('تم تحديث صلاحية المستخدم بنجاح');
            fetchUsersList();
            if (user && user.id === userId) {
                checkAdminStatus(userId);
            }
        } else {
            showAlert('فشل تحديث الصلاحية', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === MY_ADMIN_ID) {
            showAlert('لا يمكن حذف الحساب الأساسي للمالك أبداً!', 'error');
            return;
        }
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (!error) {
            showAlert('تم حذف المستخدم بنجاح');
            fetchUsersList();
        } else {
            showAlert('فشل حذف المستخدم', 'error');
        }
    };

    const handleBlockUserFromAdmin = async (userId) => {
        if (userId === MY_ADMIN_ID) {
            showAlert('لا يمكن حظر الحساب الأساسي للمالك أبداً!', 'error');
            return;
        }
        const { data, error } = await supabase.from('banned_senders').insert([{ sender_hash: userId, reason: 'Admin Action' }]).select();
        if (!error) {
            if (data) {
                setBannedList(prev => [...prev, data[0]]);
            }
            showAlert('تم حظر المستخدم بنجاح');
            fetchBannedSenders();
        } else {
            showAlert('المستخدم محظور مسبقاً', 'error');
        }
    };

    const handleBlockSender = async (senderHash) => {
        if (!senderHash) return;
        if (senderHash === MY_ADMIN_ID) {
            showAlert('لا يمكن حظر الحساب الأساسي!', 'error');
            return;
        }
        const { data, error } = await supabase.from('banned_senders').insert([{ sender_hash: senderHash, reason: 'Spam/Abuse' }]).select();
        if (!error) {
            if (data) {
                setBannedList(prev => [...prev, data[0]]);
            }
            showAlert('تم حظر هذا المرسل بنجاح');
            fetchBannedSenders();
        } else {
            showAlert('المرسل محظور مسبقاً أو حدث خطأ', 'error');
        }
    };

    const handleUnblockSender = async (id) => {
        await supabase.from('banned_senders').delete().eq('id', id);
        setBannedList(prev => prev.filter(b => b.id !== id));
        showAlert('تم فك الحظر عن المرسل');
        fetchBannedSenders();
    };

    const handleDeleteMessage = async (id) => {
        await supabase.from('messages').delete().eq('id', id);
        showAlert('تم حذف الرسالة');
        fetchMessages();
    };

    const handleDeleteSelectedMessages = async (ids) => {
        const { error } = await supabase.from('messages').delete().in('id', ids);
        if (!error) {
            showAlert('تم حذف الرسائل المحددة بنجاح');
            fetchMessages();
        } else {
            showAlert('فشل حذف الرسائل المحددة', 'error');
        }
    };

    const handleDeleteAllMessages = async () => {
        const { error } = await supabase.from('messages').delete().not('id', 'is', null);
        if (!error) {
            showAlert('تم حذف جميع الرسائل بنجاح');
            fetchMessages();
        } else {
            showAlert('فشل حذف الرسائل', 'error');
        }
    };

    const handleSendMessage = async (formData) => {
        if (!user) {
            showAlert('يجب تسجيل الدخول بواسطة ديسكورد لتتمكن من إرسال الرسائل!', 'error');
            return;
        }

        if (!formData.content.trim()) return;

        const senderHash = user.id;

        const { data: latestBans } = await supabase
            .from('banned_senders')
            .select('sender_hash')
            .or(`sender_hash.eq.${senderHash},sender_hash.eq.${user.id}`);

        const isCurrentlyBanned = latestBans && latestBans.length > 0;
        const isBannedLocally = bannedList.some(b => b.sender_hash === senderHash || b.sender_hash === user.id);

        if (isCurrentlyBanned || isBannedLocally) {
            showAlert('عذراً، أنت محظور من إرسال رسائل عبر هذه المنصة.', 'error');
            return;
        }

        const { error } = await supabase.from('messages').insert([{
            sender_hash: senderHash,
            sender_discord_id: user.id,
            sender_username: user.global_name,
            sender_avatar: user.avatar,
            is_anonymous: formData.isAnonymous,
            content: formData.content,
            title: formData.title,
            title_url: formData.titleUrl,
            description: formData.description,
            author_name: formData.authorName,
            author_icon: formData.authorIcon,
            thumbnail_url: formData.thumbnailUrl,
            image_url: formData.imageUrl,
            outside_image_url: formData.outsideImageUrl,
            fields: formData.fields,
            embed_color: formData.embedColor
        }]);

        if (!error) {
            if (webhookUrl) {
                let botName = 'مجهول | dtell';
                let botAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';

                if (formData.isAnonymous) {
                    const { data: settingsData } = await supabase.from('settings').select('*').in('key', ['anon_bot_name', 'anon_bot_avatar']);
                    if (settingsData) {
                        settingsData.forEach(item => {
                            if (item.key === 'anon_bot_name') botName = item.value;
                            if (item.key === 'anon_bot_avatar') botAvatar = item.value;
                        });
                    }
                }

                const webhookUsername = !formData.isAnonymous ? user.global_name : botName;
                const webhookAvatar = !formData.isAnonymous ? user.avatar : botAvatar;
                const dtellLogoUrl = "https://raw.githubusercontent.com/ha-z8/ZP-web/main/src/assets/11.png";

                const embed = {
                    title: formData.title || undefined,
                    url: formData.titleUrl || undefined,
                    description: formData.content + (formData.description ? `\n\n${formData.description}` : ''),
                    color: parseInt(formData.embedColor.replace('#', ''), 16),
                    image: formData.imageUrl ? { url: formData.imageUrl } : undefined,
                    thumbnail: formData.thumbnailUrl ? { url: formData.thumbnailUrl } : undefined,
                    fields: formData.fields && formData.fields.length > 0 ? formData.fields : undefined,
                    footer: {
                        text: "powered by dtell",
                        icon_url: dtellLogoUrl 
                    },
                    timestamp: formData.showTimestamp ? new Date().toISOString() : undefined
                };

                if (formData.authorName) {
                    embed.author = {
                        name: formData.authorName,
                        icon_url: formData.authorIcon || undefined
                    };
                }

                const payload = {
                    username: webhookUsername,
                    avatar_url: webhookAvatar,
                    content: formData.outsideImageUrl ? formData.outsideImageUrl : undefined,
                    embeds: [embed]
                };

                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.log("Webhook dispatch error:", err));
            }

            showAlert('تم إرسال رسالتك بنجاح!');
            fetchMessages();
        } else {
            showAlert('فشل إرسال الرسالة', 'error');
        }
    };

    const isAdminRoute = currentRoute.startsWith('admin');

    return (
        <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col justify-between p-4 md:p-6 w-full select-none relative overflow-hidden" dir="rtl">
            
            <Alert alert={alert} onDismiss={() => setAlert({ text: '', type: '', key: 0 })} />

            {!isAdminRoute ? (
                <Header 
                    user={user} 
                    isAdmin={isAdmin} 
                    currentRoute={currentRoute} 
                    navigateRoute={navigateRoute} 
                    handleLogin={handleLogin} 
                    handleLogout={handleLogout} 
                />
            ) : (
                <AdminHeader navigateRoute={navigateRoute} />
            )}

            <main className="w-full flex-grow">
                {currentRoute === 'home' && (
                    <Home user={user} features={features} onSendMessage={handleSendMessage} onLogin={handleLogin} />
                )}
                {currentRoute !== 'home' && !currentRoute.startsWith('admin') && (
                    <PrivacyPage currentRoute={currentRoute} navigateRoute={navigateRoute} />
                )}
                {currentRoute === 'admin-overview' && (
                    <Dashboard messages={messages} bannedList={bannedList} usersList={usersList} navigateRoute={navigateRoute} />
                )}
                {currentRoute === 'admin-messages' && (
                    <MessagesPage 
                        messages={messages} 
                        onDeleteMessage={handleDeleteMessage} 
                        onDeleteSelectedMessages={handleDeleteSelectedMessages}
                        onDeleteAllMessages={handleDeleteAllMessages} 
                        onBlockSender={handleBlockSender} 
                        navigateRoute={navigateRoute} 
                    />
                )}
                {currentRoute === 'admin-users' && (
                    <UsersPage 
                        usersList={usersList} 
                        bannedList={bannedList}
                        onUpdateRole={handleUpdateUserRole} 
                        onDeleteUser={handleDeleteUser} 
                        onBlockUser={handleBlockUserFromAdmin} 
                        onUnblockSender={handleUnblockSender}
                        navigateRoute={navigateRoute} 
                    />
                )}
                {currentRoute === 'admin-features' && (
                    <FeaturesPage 
                        features={features} 
                        onToggleFeature={handleToggleFeature} 
                        navigateRoute={navigateRoute} 
                    />
                )}
                {currentRoute === 'admin-policies' && (
                    <PoliciesManagerPage 
                        navigateRoute={navigateRoute} 
                        showAlert={showAlert} 
                    />
                )}
                {currentRoute === 'admin-webhook' && (
                    <WebhookPage tempWebhook={tempWebhook} setTempWebhook={setTempWebhook} onSaveWebhook={handleSaveWebhook} navigateRoute={navigateRoute} />
                )}
            </main>

            {!isAdminRoute ? (
                <Footer navigateRoute={navigateRoute} />
            ) : (
                <AdminFooter />
            )}

        </div>
    );
}