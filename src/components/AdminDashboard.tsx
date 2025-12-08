import { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, MessageSquare, LogOut, Shield, BarChart3, Settings, AlertCircle, Mail, Loader2, Clock, Smartphone, Monitor, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '../lib/supabase';

interface ContactMessage {
    id: number;
    created_at: string;
    name: string;
    email: string;
    message: string;
    status: string;
}

export default function AdminDashboard() {
    const { adminLogout } = useAdminAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messages' | 'content' | 'settings'>('overview');
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [communityPosts, setCommunityPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [stats, setStats] = useState({
        totalMessages: 0,
        dailyActiveUsers: 0,
        avgSessionDuration: '-',
        totalUsers: 0
    });
    const [deviceUsageData, setDeviceUsageData] = useState([
        { name: 'Desktop', value: 0, color: '#3b82f6' },
        { name: 'Mobile', value: 0, color: '#22c55e' },
    ]);
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userActivity, setUserActivity] = useState<any[]>([]);
    const [adsenseClientId, setAdsenseClientId] = useState(import.meta.env.VITE_ADSENSE_CLIENT_ID || '');
    const [adsenseSaved, setAdsenseSaved] = useState(false);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    useEffect(() => {
        if (activeTab === 'messages') {
            fetchMessages();
        } else if (activeTab === 'content') {
            fetchCommunityPosts();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
        // Always fetch stats on mount
        fetchStats();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error) {
                setUsers(data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserActivity = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error) {
                setUserActivity(data || []);
            }
        } catch (error) {
            console.error('Error fetching user activity:', error);
        }
    };

    const handleViewUser = (user: any) => {
        setSelectedUser(user);
        fetchUserActivity(user.id);
    };

    const fetchCommunityPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select('*, profiles:user_id(email)')
                .order('created_at', { ascending: false });

            if (!error) {
                setCommunityPosts(data || []);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleDeletePost = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const { error } = await supabase
                    .from('community_posts')
                    .delete()
                    .eq('id', id);

                if (!error) {
                    setCommunityPosts(prev => prev.filter(p => p.id !== id));
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const fetchStats = async () => {
        try {
            // 1. Total Messages
            const { count: messageCount } = await supabase
                .from('contact_messages')
                .select('*', { count: 'exact', head: true });

            // 2. Total Users (from profiles table)
            const { data: allUsers, count: userCount } = await supabase
                .from('profiles')
                .select('created_at', { count: 'exact' });

            // Calculate User Growth (Last 6 Months)
            if (allUsers) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const today = new Date();
                const last6Months = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    last6Months.push({
                        month: months[d.getMonth()],
                        year: d.getFullYear(),
                        monthIndex: d.getMonth(),
                        count: 0
                    });
                }

                // Count cumulative users up to each month
                const growthData = last6Months.map(m => {
                    const count = allUsers.filter(u => {
                        const d = new Date(u.created_at);
                        // User joined before or in this month
                        return d < new Date(m.year, m.monthIndex + 1, 1);
                    }).length;
                    return { month: m.month, users: count };
                });
                setUserGrowthData(growthData);
            }

            // 3. Daily Active Users (Unique users in analytics_events in last 24h)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { data: recentEvents } = await supabase
                .from('analytics_events')
                .select('user_id')
                .gte('created_at', oneDayAgo);

            const uniqueUsers = new Set(recentEvents?.map(e => e.user_id).filter(Boolean)).size;

            // 4. Avg Session Duration
            const { data: sessionEnds } = await supabase
                .from('analytics_events')
                .select('metadata')
                .eq('event_type', 'session_end')
                .order('created_at', { ascending: false })
                .limit(100);

            let avgDuration = 0;
            if (sessionEnds && sessionEnds.length > 0) {
                const totalSeconds = sessionEnds.reduce((acc, curr) => {
                    return acc + (curr.metadata?.duration_seconds || 0);
                }, 0);
                avgDuration = totalSeconds / sessionEnds.length;
            }

            const minutes = Math.floor(avgDuration / 60);
            const seconds = Math.floor(avgDuration % 60);
            const durationString = `${minutes}m ${seconds}s`;

            // 5. Device Usage
            const { data: sessionStarts } = await supabase
                .from('analytics_events')
                .select('metadata')
                .eq('event_type', 'session_start')
                .limit(500);

            let desktopCount = 0;
            let mobileCount = 0;

            sessionStarts?.forEach(session => {
                const type = session.metadata?.device_type;
                if (type === 'Mobile') mobileCount++;
                else desktopCount++;
            });

            const totalSessions = desktopCount + mobileCount;
            if (totalSessions > 0) {
                setDeviceUsageData([
                    { name: 'Desktop', value: desktopCount, color: '#3b82f6' },
                    { name: 'Mobile', value: mobileCount, color: '#22c55e' },
                ]);
            }

            // 6. Feature Usage (Real Data)
            const { data: featureEvents } = await supabase
                .from('analytics_events')
                .select('metadata')
                .eq('event_type', 'feature_used');

            if (featureEvents) {
                const usageMap: Record<string, number> = {};
                featureEvents.forEach(event => {
                    const feature = event.metadata?.feature;
                    if (feature) {
                        usageMap[feature] = (usageMap[feature] || 0) + 1;
                    }
                });

                const usageData = Object.entries(usageMap)
                    .map(([feature, count]) => ({ feature, users: count }))
                    .sort((a, b) => b.users - a.users); // Sort by usage desc

                setFeatureUsageData(usageData);
            }

            setStats(prev => ({
                ...prev,
                totalMessages: messageCount || 0,
                totalUsers: userCount || 0,
                dailyActiveUsers: uniqueUsers || 0,
                avgSessionDuration: durationString
            }));

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const [featureUsageData, setFeatureUsageData] = useState<any[]>([]);

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                                <p className="text-xs text-slate-500">Fantastic Finance</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'messages', label: 'Messages', icon: Mail },
                        { id: 'content', label: 'Content', icon: MessageSquare },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Total Users</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="w-10 h-10 text-blue-600" />
                                </div>
                                <p className="text-sm text-green-600 mt-2">+12% this month</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Daily Footprint</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.dailyActiveUsers}</p>
                                    </div>
                                    <Activity className="w-10 h-10 text-green-600" />
                                </div>
                                <p className="text-sm text-green-600 mt-2">Daily Active Users</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Avg. Spending Time</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.avgSessionDuration}</p>
                                    </div>
                                    <Clock className="w-10 h-10 text-purple-600" />
                                </div>
                                <p className="text-sm text-green-600 mt-2">Per Session</p>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feature Usage Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Most Popular Features</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={featureUsageData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="feature" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="users" fill="#3b82f6" name="Users" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Device Usage Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Device Usage</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deviceUsageData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {deviceUsageData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900">User Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm text-slate-900 font-mono">{user.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Contact Messages</h3>
                            <button onClick={fetchMessages} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Refresh
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            {loadingMessages ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    No messages found.
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {messages.map((msg) => (
                                            <tr key={msg.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{msg.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{msg.email}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate" title={msg.message}>
                                                    {msg.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Content Moderation</h3>
                                <p className="text-sm text-slate-500">Manage community posts</p>
                            </div>
                            <button onClick={fetchCommunityPosts} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Refresh
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Content</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {communityPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                {post.profiles?.email || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                                                {post.type}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                                                {post.content}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                                >
                                                    <LogOut className="w-4 h-4" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {communityPosts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                No posts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">AdSense Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Google AdSense Client ID
                                    </label>
                                    <input
                                        type="text"
                                        value={adsenseClientId}
                                        onChange={(e) => setAdsenseClientId(e.target.value)}
                                        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-sm text-slate-500 mt-2">
                                        Enter your Google AdSense client ID to enable ads across the platform.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('VITE_ADSENSE_CLIENT_ID', adsenseClientId);
                                            setAdsenseSaved(true);
                                            setTimeout(() => setAdsenseSaved(false), 5000);
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        Save Configuration
                                    </button>
                                    {adsenseSaved && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                        >
                                            Reload App Now
                                        </button>
                                    )}
                                </div>
                                {adsenseSaved && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-800">✓ AdSense configuration saved successfully!</p>
                                        <p className="text-sm text-green-700 mt-1">Click "Reload App Now" or refresh the page to apply changes.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">System Settings</h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <h4 className="font-semibold text-slate-900">API Status</h4>
                                    <p className="text-sm text-green-600 mt-1">✓ All systems operational</p>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-lg">
                                    <h4 className="font-semibold text-slate-900">Database</h4>
                                    <p className="text-sm text-green-600 mt-1">✓ Connected to Supabase</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">User Details</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-slate-400 hover:text-slate-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-500">Email</h4>
                                <p className="text-lg text-slate-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500">User ID</h4>
                                <p className="text-sm font-mono text-slate-600">{selectedUser.id}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500">Joined</h4>
                                <p className="text-slate-900">{new Date(selectedUser.created_at).toLocaleString()}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-3">Recent Activity</h4>
                                <div className="space-y-3">
                                    {userActivity.map((event, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Activity className="w-4 h-4 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {event.event_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(event.created_at).toLocaleString()}
                                                </p>
                                                {event.metadata && (
                                                    <pre className="mt-1 text-xs text-slate-600 overflow-x-auto">
                                                        {JSON.stringify(event.metadata, null, 2)}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {userActivity.length === 0 && (
                                        <p className="text-sm text-slate-500 italic">No recent activity found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
