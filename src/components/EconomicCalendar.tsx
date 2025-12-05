import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface EconomicEvent {
    id: number;
    date: string;
    time: string;
    event: string;
    country: string;
    importance: 'high' | 'medium' | 'low';
    forecast?: string;
    previous?: string;
}

export default function EconomicCalendar() {
    const [events] = useState<EconomicEvent[]>([
        {
            id: 1,
            date: '2025-12-05',
            time: '09:30 AM',
            event: 'RBI Monetary Policy Decision',
            country: 'India',
            importance: 'high',
            forecast: '6.50%',
            previous: '6.50%'
        },
        {
            id: 2,
            date: '2025-12-05',
            time: '11:00 AM',
            event: 'GDP Growth Rate',
            country: 'India',
            importance: 'high',
            forecast: '6.8%',
            previous: '7.2%'
        },
        {
            id: 3,
            date: '2025-12-06',
            time: '10:30 AM',
            event: 'Inflation Rate',
            country: 'India',
            importance: 'high',
            forecast: '5.2%',
            previous: '4.87%'
        },
        {
            id: 4,
            date: '2025-12-06',
            time: '02:00 PM',
            event: 'Manufacturing PMI',
            country: 'India',
            importance: 'medium',
            forecast: '56.5',
            previous: '57.3'
        },
        {
            id: 5,
            date: '2025-12-07',
            time: '08:30 PM',
            event: 'US Non-Farm Payrolls',
            country: 'USA',
            importance: 'high',
            forecast: '185K',
            previous: '199K'
        },
    ]);

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getCountryFlag = (country: string) => {
        switch (country) {
            case 'India': return '🇮🇳';
            case 'USA': return '🇺🇸';
            case 'EU': return '🇪🇺';
            default: return '🌍';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Economic Calendar</h1>
                            <p className="text-slate-500 dark:text-slate-400">Important economic events and indicators</p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">High Impact</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Medium Impact</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Low Impact</span>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{getCountryFlag(event.country)}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getImportanceColor(event.importance)}`}>
                                            {event.importance.toUpperCase()}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{event.time}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{event.event}</h3>
                                    <div className="flex gap-6">
                                        {event.forecast && (
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Forecast</p>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.forecast}</p>
                                            </div>
                                        )}
                                        {event.previous && (
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Previous</p>
                                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{event.previous}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About Economic Calendar</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                The economic calendar shows scheduled announcements of economic indicators, central bank decisions, and other important events
                                that can impact financial markets. High-impact events typically cause significant market volatility.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
