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

    // Mock calendar events
    const events: CalendarEvent[] = [
        {
            id: '1',
            date: '2024-12-05',
            title: 'NIFTY Weekly Expiry',
            type: 'expiry',
            importance: 'high',
            symbol: 'NIFTY',
            details: 'Thursday weekly options expiry'
        },
        {
            id: '2',
            date: '2024-12-05',
            title: 'BANKNIFTY Weekly Expiry',
            type: 'expiry',
            importance: 'high',
            symbol: 'BANKNIFTY',
            details: 'Thursday weekly options expiry'
        },
        {
            id: '3',
            date: '2024-12-06',
            title: 'RBI Monetary Policy Decision',
            type: 'economic',
            importance: 'high',
            details: 'Interest rate decision expected'
        },
        {
            id: '4',
            date: '2024-12-07',
            title: 'RELIANCE Q3 Earnings',
            type: 'earnings',
            importance: 'high',
            symbol: 'RELIANCE',
            details: 'Quarterly results announcement'
        },
        {
            id: '5',
            date: '2024-12-08',
            title: 'US Non-Farm Payrolls',
            type: 'economic',
            importance: 'medium',
            details: 'Employment data release'
        },
        {
            id: '6',
            date: '2024-12-10',
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
            case 'expiry': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-300 dark:border-red-700' };
            case 'earnings': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700' };
            case 'economic': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700' };
            case 'ipo': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-300 dark:border-green-700' };
            case 'dividend': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-700' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
        }
    };

    const getImportanceBadge = (importance: string) => {
        switch (importance) {
            case 'high': return { bg: 'bg-red-500', text: 'HIGH' };
            case 'medium': return { bg: 'bg-orange-500', text: 'MED' };
            case 'low': return { bg: 'bg-gray-400', text: 'LOW' };
            default: return { bg: 'bg-gray-400', text: 'N/A' };
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trading Calendar</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming important dates</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${selectedFilter === filter.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                    >
                        {filter.label} {filter.count > 0 && (
                            <span className={`ml-1 ${selectedFilter === filter.id ? 'opacity-80' : 'opacity-60'}`}>
                                ({filter.count})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                    <div key={date}>
                        {/* Date Header */}
                        <div className="sticky top-0 bg-white dark:bg-slate-800 pb-2 mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {formatDate(date)}
                            </h4>
                        </div>

                        {/* Events for this date */}
                        <div className="space-y-2 ml-6">
                            {dayEvents.map((event) => {
                                const Icon = getEventIcon(event.type);
                                const color = getEventColor(event.type);
                                const importance = getImportanceBadge(event.importance);

                                return (
                                    <div
                                        key={event.id}
                                        className={`group relative p-3 rounded-lg ${color.bg} border ${color.border} hover:shadow-md transition`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className={`w-4 h-4 ${color.text} flex-shrink-0 mt-0.5`} />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div>
                                                        <h5 className={`font-semibold text-sm ${color.text}`}>
                                                            {event.title}
                                                        </h5>
                                                        {event.symbol && (
                                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                                {event.symbol}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`px-2 py-0.5 ${importance.bg} text-white text-[10px] font-bold rounded uppercase`}>
                                                        {importance.text}
                                                    </span>
                                                </div>
                                                {event.details && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
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

            {/* Bottom Summary */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-red-600">
                            {events.filter(e => e.type === 'expiry').length}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Expiries</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {events.filter(e => e.type === 'earnings').length}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Earnings</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600">
                            {events.filter(e => e.type === 'economic').length}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Economic</div>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567904" className="mt-6" />
        </div>
    );
}
