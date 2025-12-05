import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { X, Bell, TrendingUp, TrendingDown, Info } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'trade';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
}

interface NotificationContextType {
    addNotification: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, title: string, message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, message, timestamp: id }]);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Simulate random market news alerts
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                const alerts = [
                    { type: 'info', title: 'Market Update', message: 'NIFTY 50 crosses 19,600 mark!' },
                    { type: 'warning', title: 'High Volatility', message: 'Bank Nifty showing unusual volume spikes.' },
                    { type: 'trade', title: 'Volume Alert', message: 'RELIANCE volume up by 200% in last 15 mins.' },
                    { type: 'info', title: 'News Flash', message: 'Q3 Earnings season begins next week.' }
                ];
                const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
                addNotification(randomAlert.type as NotificationType, randomAlert.title, randomAlert.message);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className="pointer-events-auto bg-white rounded-lg shadow-lg border border-slate-100 p-4 w-80 transform transition-all duration-300 ease-in-out animate-slide-in flex items-start gap-3"
                    >
                        <div className={`p-2 rounded-full flex-shrink-0 ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                                        notification.type === 'trade' ? 'bg-blue-100 text-blue-600' :
                                            'bg-slate-100 text-slate-600'
                            }`}>
                            {notification.type === 'success' ? <TrendingUp className="w-5 h-5" /> :
                                notification.type === 'warning' ? <Bell className="w-5 h-5" /> :
                                    notification.type === 'error' ? <TrendingDown className="w-5 h-5" /> :
                                        notification.type === 'trade' ? <TrendingUp className="w-5 h-5" /> :
                                            <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-slate-900">{notification.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-slate-400 hover:text-slate-600 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
