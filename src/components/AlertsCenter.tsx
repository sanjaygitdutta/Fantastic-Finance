import { Bell, TrendingUp, AlertTriangle, Info, Clock, Plus, X } from 'lucide-react';
import AdSlot from './AdSlot';
import { useState } from 'react';
import { DisplayAd } from './AdSense';

interface Alert {
    id: number;
    type: 'price' | 'volume' | 'news';
    title: string;
    message: string;
    time: string;
    severity: 'high' | 'medium' | 'info';
    read: boolean;
}

interface NewAlert {
    symbol: string;
    condition: 'above' | 'below';
    price: string;
    alertType: 'price' | 'volume';
}

export default function AlertsCenter() {
    const [filter, setFilter] = useState<'all' | 'price' | 'volume' | 'news'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAlert, setNewAlert] = useState<NewAlert>({
        symbol: '',
        condition: 'above',
        price: '',
        alertType: 'price'
    });

    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: 1,
            type: 'price',
            title: 'NIFTY 50 Crossed 19,800',
            message: 'NIFTY 50 has crossed the resistance level of 19,800 with strong momentum.',
            time: '10 mins ago',
            severity: 'high',
            read: false
        },
        {
            id: 2,
            type: 'volume',
            title: 'Unusual Volume in RELIANCE',
            message: 'RELIANCE Industries showing 300% spike in volume compared to 10-day average.',
            time: '45 mins ago',
            severity: 'medium',
            read: false
        },
        {
            id: 3,
            type: 'news',
            title: 'RBI Policy Announcement',
            message: 'RBI keeps repo rate unchanged at 6.5%. Market sentiment bullish.',
            time: '2 hours ago',
            severity: 'info',
            read: true
        },
        {
            id: 4,
            type: 'price',
            title: 'BANKNIFTY Support Broken',
            message: 'BANKNIFTY has broken the support level of 44,500.',
            time: '3 hours ago',
            severity: 'high',
            read: true
        },
        {
            id: 5,
            type: 'volume',
            title: 'HDFCBANK Block Deal',
            message: 'Large block deal detected in HDFCBANK: 500k shares traded.',
            time: '5 hours ago',
            severity: 'medium',
            read: true
        }
    ]);

    const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

    const handleCreateAlert = () => {
        if (!newAlert.symbol || !newAlert.price) {
            window.alert('Please fill all fields');
            return;
        }

        const price = parseFloat(newAlert.price);
        if (isNaN(price)) {
            window.alert('Please enter a valid price');
            return;
        }

        // Create new alert object
        const newAlertItem: Alert = {
            id: alerts.length + 1,
            type: newAlert.alertType,
            title: `${newAlert.symbol} Price Alert`,
            message: `Alert will trigger when ${newAlert.symbol} goes ${newAlert.condition} ₹${price.toLocaleString()} `,
            time: 'Just now',
            severity: 'info',
            read: false
        };

        setAlerts([newAlertItem, ...alerts]);
        setNewAlert({ symbol: '', condition: 'above', price: '', alertType: 'price' });
        setShowCreateModal(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'price': return <TrendingUp className="w-5 h-5" />;
            case 'volume': return <AlertTriangle className="w-5 h-5" />;
            case 'news': return <Info className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'price': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case 'volume': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'news': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Bell className="w-8 h-8 text-blue-600" />
                            Alerts Center
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">Stay updated with real-time market notifications</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Create Alert
                        </button>
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'price', 'volume', 'news'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px - 4 py - 2 rounded - full text - sm font - medium capitalize transition ${filter === f
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            } `}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredAlerts.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No alerts found for this filter</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`p - 6 hover: bg - slate - 50 dark: hover: bg - slate - 700 / 50 transition flex gap - 4 ${!alert.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                    } `}
                            >
                                <div className={`p - 3 rounded - xl h - fit ${getColor(alert.type)} `}>
                                    {getIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className={`font - bold text - lg ${!alert.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'} `}>
                                            {alert.title}
                                        </h3>
                                        <span className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                                            <Clock className="w-3 h-3" />
                                            {alert.time}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                                        {alert.message}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className={`px - 2 py - 0.5 rounded text - xs font - medium uppercase ${alert.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                alert.severity === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            } `}>
                                            {alert.severity} priority
                                        </span>
                                        {!alert.read && (
                                            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                New
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Price Alert</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Symbol *
                                </label>
                                <input
                                    type="text"
                                    value={newAlert.symbol}
                                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })}
                                    placeholder="e.g., NIFTY 50, RELIANCE"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Alert Type
                                </label>
                                <select
                                    value={newAlert.alertType}
                                    onChange={(e) => setNewAlert({ ...newAlert, alertType: e.target.value as 'price' | 'volume' })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="price">Price Alert</option>
                                    <option value="volume">Volume Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Condition
                                </label>
                                <select
                                    value={newAlert.condition}
                                    onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'above' | 'below' })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="above">Goes Above</option>
                                    <option value="below">Goes Below</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newAlert.price}
                                    onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                                    placeholder="e.g., 19800.00"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAlert}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Create Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567903" className="mt-6" />
            {/* AdSense Display Ad */}
            <AdSlot slot="alerts-center-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
