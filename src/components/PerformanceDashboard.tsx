import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, Award, Activity, BarChart3 } from 'lucide-react';

export default function PerformanceDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

    // Mock data - in real app, fetch from API
    const performanceData = {
        today: {
            pnl: 2450.50,
            pnlPercent: 1.8,
            trades: 5,
            winRate: 80,
            bestTrade: 1200,
            worstTrade: -350,
            avgReturn: 490
        },
        week: {
            pnl: 12350.75,
            pnlPercent: 9.2,
            trades: 23,
            winRate: 65,
            bestTrade: 3500,
            worstTrade: -850,
            avgReturn: 537
        },
        month: {
            pnl: 45678.25,
            pnlPercent: 34.1,
            trades: 87,
            winRate: 62,
            bestTrade: 8900,
            worstTrade: -1200,
            avgReturn: 525
        }
    };

    const data = performanceData[selectedPeriod];
    const isPositive = data.pnl >= 0;

    const stats = [
        {
            label: 'Total P&L',
            value: `₹${Math.abs(data.pnl).toLocaleString()}`,
            change: `${data.pnlPercent}%`,
            icon: isPositive ? TrendingUp : TrendingDown,
            color: isPositive ? 'green' : 'red',
            gradient: isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'
        },
        {
            label: 'Win Rate',
            value: `${data.winRate}%`,
            subtext: `${Math.round(data.trades * (data.winRate / 100))}/${data.trades} trades`,
            icon: Target,
            color: data.winRate >= 60 ? 'blue' : 'orange',
            gradient: data.winRate >= 60 ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-amber-600'
        },
        {
            label: 'Avg Return',
            value: `₹${data.avgReturn}`,
            subtext: 'per trade',
            icon: Activity,
            color: 'purple',
            gradient: 'from-purple-500 to-indigo-600'
        },
        {
            label: 'Best Trade',
            value: `₹${data.bestTrade.toLocaleString()}`,
            subtext: `Worst: ₹${data.worstTrade.toLocaleString()}`,
            icon: Award,
            color: 'yellow',
            gradient: 'from-yellow-500 to-orange-600'
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your trading insights</p>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                    {(['today', 'week', 'month'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedPeriod === period
                                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {period === 'today' ? 'Today' : period === 'week' ? 'Week' : 'Month'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Icon circle */}
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.gradient} mb-3 shadow-md`}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>

                            {/* Label */}
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                {stat.label}
                            </div>

                            {/* Value */}
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                {stat.value}
                            </div>

                            {/* Additional info */}
                            {stat.change && (
                                <div className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {isPositive ? '+' : ''}{stat.change}
                                </div>
                            )}
                            {stat.subtext && (
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {stat.subtext}
                                </div>
                            )}

                            {/* Hover gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        </div>
                    );
                })}
            </div>

            {/* Mini Sparkline Chart Placeholder */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {selectedPeriod === 'today' ? "Today's" : selectedPeriod === 'week' ? "This Week's" : "This Month's"} Trend
                    </span>
                    <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {isPositive ? '↗' : '↘'} {data.pnlPercent}%
                    </span>
                </div>

                {/* Simple visual representation */}
                <div className="h-16 flex items-end justify-between gap-1">
                    {Array.from({ length: selectedPeriod === 'today' ? 8 : selectedPeriod === 'week' ? 7 : 12 }).map((_, i) => {
                        const height = Math.random() * 100;
                        const isUp = Math.random() > 0.4;
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-t transition-all duration-300 hover:opacity-80 ${isUp ? 'bg-gradient-to-t from-green-400 to-green-600' : 'bg-gradient-to-t from-red-400 to-red-600'
                                    }`}
                                style={{ height: `${height}%` }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
