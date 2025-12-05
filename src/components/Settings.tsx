import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, DollarSign, Shield, Smartphone, Mail, Key, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [currency, setCurrency] = useState('INR');
    const [isUpstoxAuthenticated, setIsUpstoxAuthenticated] = useState(false);
    const [tokenExpiresIn, setTokenExpiresIn] = useState<number | null>(null);

    // Check Upstox authentication status
    useEffect(() => {
        const checkAuth = () => {
            setIsUpstoxAuthenticated(authService.isAuthenticated());
            setTokenExpiresIn(authService.getTokenExpiresIn());
        };

        checkAuth();
        // Check every minute
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleUpstoxLogin = () => {
        const loginUrl = authService.getLoginUrl();
        window.location.href = loginUrl;
    };

    const handleUpstoxLogout = () => {
        authService.clearTokens();
        setIsUpstoxAuthenticated(false);
        setTokenExpiresIn(null);
    };

    const formatTimeRemaining = (ms: number | null) => {
        if (!ms || ms <= 0) return 'Expired';
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your preferences and application settings</p>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-blue-600" />}
                        Appearance
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Upstox Integration */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        Upstox Integration
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Connect your Upstox account to enable real-time market data and automatic token refresh.
                    </p>

                    {isUpstoxAuthenticated ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Upstox</p>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        Token expires in: {formatTimeRemaining(tokenExpiresIn)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleUpstoxLogout}
                                className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Disconnect Upstox Account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                    Not connected. Using simulated data or environment token.
                                </p>
                            </div>
                            <button
                                onClick={handleUpstoxLogin}
                                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Key className="w-5 h-5" />
                                Login with Upstox
                                <ExternalLink className="w-4 h-4" />
                            </button>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                You'll be redirected to Upstox to authorize this application.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Notifications
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily digests and important alerts</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time alerts for price movements</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Preferences
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Default Currency</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred currency for display</p>
                            </div>
                        </div>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
