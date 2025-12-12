import { Calendar, AlertCircle, TrendingUp, DollarSign, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { DisplayAd } from './AdSense';

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    type: 'expiry' | 'earnings' | 'economic' | 'ipo' | 'dividend';
    importance: 'high' | 'medium' | 'low';
    symbol?: string;
    details?: string;
}

export default function TradingCalendar() {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'expiry' | 'earnings' | 'economic'>('all');

    // Generate events dynamically based on current date
    const today = new Date();

    // Helper to get date string for X days from now
    const getDate = (days: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    };

    const events: CalendarEvent[] = [
        {
            id: '1',
            date: getDate(0), // Today
            title: 'NIFTY Weekly Expiry',
            type: 'expiry',
            importance: 'high',
            symbol: 'NIFTY',
            details: 'Thursday weekly options expiry'
        },
        {
            id: '2',
            date: getDate(0),
            title: 'BANKNIFTY Weekly Expiry',
            type: 'expiry',
            importance: 'high',
            symbol: 'BANKNIFTY',
            details: 'Thursday weekly options expiry'
        },
        {
            id: '3',
            date: getDate(1), // Tomorrow
            title: 'RBI Monetary Policy Decision',
            type: 'economic',
            importance: 'high',
            details: 'Interest rate decision expected'
        },
        {
            id: '4',
            date: getDate(2),
            title: 'RELIANCE Q3 Earnings',
            type: 'earnings',
            importance: 'high',
            symbol: 'RELIANCE',
            details: 'Quarterly results announcement'
        },
        {
            id: '5',
            date: getDate(3),
            title: 'US Non-Farm Payrolls',
            type: 'economic',
            importance: 'medium',
            details: 'Employment data release'
        },
        {
            id: '6',
            date: getDate(5),
            title: 'TCS Dividend Ex-Date',
            type: 'dividend',
            importance: 'medium',
            symbol: 'TCS',
            details: '₹25 per share'
        }
    ];

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'expiry': return Calendar;
            case 'earnings': return TrendingUp;
            case 'economic': return Briefcase;
            case 'ipo': return DollarSign;
            case 'dividend': return DollarSign;
            default: return AlertCircle;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'expiry': return { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
            case 'earnings': return { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
            case 'economic': return { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' };
            case 'ipo': return { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
            case 'dividend': return { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
        }
    };

    const getImportanceBadge = (importance: string) => {
        switch (importance) {
            case 'high': return { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'HIGH' };
            case 'medium': return { bg: 'bg-gradient-to-r from-orange-500 to-orange-600', text: 'MED' };
            case 'low': return { bg: 'bg-slate-400', text: 'LOW' };
            default: return { bg: 'bg-slate-400', text: 'N/A' };
        }
    };

    const filteredEvents = selectedFilter === 'all'
        ? events
        : events.filter(e => e.type === selectedFilter);

    // Group events by date
    const groupedEvents = filteredEvents.reduce((acc, event) => {
        if (!acc[event.date]) {
            acc[event.date] = [];
        }
        acc[event.date].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const filters = [
        { id: 'all', label: 'All Events', count: events.length },
        { id: 'expiry', label: 'Expiries', count: events.filter(e => e.type === 'expiry').length },
        { id: 'earnings', label: 'Earnings', count: events.filter(e => e.type === 'earnings').length },
        { id: 'economic', label: 'Economic', count: events.filter(e => e.type === 'economic').length }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-xl dark:bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trading Calendar</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Upcoming market events</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                    LIVE UPDATES
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedFilter === filter.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                            : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:scale-105'
                            }`}
                    >
                        {filter.label} {filter.count > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${selectedFilter === filter.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'
                                }`}>
                                {filter.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                    <div key={date} className="relative">
                        {/* Date Header */}
                        <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm pb-3 mb-2 z-10 border-b border-slate-100 dark:border-slate-700">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                {formatDate(date)}
                            </h4>
                        </div>

                        {/* Events for this date */}
                        <div className="grid gap-3 ml-4 border-l-2 border-slate-100 dark:border-slate-700 pl-4 py-2">
                            {dayEvents.map((event) => {
                                const Icon = getEventIcon(event.type);
                                const color = getEventColor(event.type);
                                const importance = getImportanceBadge(event.importance);

                                return (
                                    <div
                                        key={event.id}
                                        className={`group relative p-4 rounded-xl ${color.bg} border ${color.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/10 ${color.text}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div>
                                                        <h5 className={`font-bold text-sm text-slate-900 dark:text-white truncate pr-2`}>
                                                            {event.title}
                                                        </h5>
                                                        {event.symbol && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                    {event.symbol}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`px-2 py-1 ${importance.bg} text-white text-[10px] font-bold rounded-md shadow-sm tracking-wider`}>
                                                        {importance.text}
                                                    </span>
                                                </div>
                                                {event.details && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                                        {event.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* AdSense Display Ad */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <DisplayAd adSlot="1234567904" />
            </div>
        </div>
    );
}
