import { Sparkles, TrendingUp, Shield, Zap, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Strategy {
    id: string;
    name: string;
    type: 'bullish' | 'bearish' | 'neutral';
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: string;
    marketCondition: string;
    instruments: string[];
    icon: any;
    gradient: string;
}

export default function StrategyRecommendations() {
    // Mock AI-powered recommendations based on market conditions
    const recommendations: Strategy[] = [
        {
            id: '1',
            name: 'Bull Call Spread',
            type: 'bullish',
            description: 'NIFTY showing strength above 24,500 with rising RSI',
            riskLevel: 'low',
            expectedReturn: '8-12%',
            marketCondition: 'Bullish breakout',
            instruments: ['NIFTY 24500 CE', 'NIFTY 24700 CE'],
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            id: '2',
            name: 'Iron Condor',
            type: 'neutral',
            description: 'BANKNIFTY consolidating near 53,000 zone',
            riskLevel: 'medium',
            expectedReturn: '5-8%',
            marketCondition: 'Range-bound volatility',
            instruments: ['BANKNIFTY 52500 PE', 'BANKNIFTY 53500 CE'],
            icon: Shield,
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            id: '3',
            name: 'Long Straddle',
            type: 'neutral',
            description: 'Expect volatility ahead of RBI Policy announcement',
            riskLevel: 'high',
            expectedReturn: '15-25%',
            marketCondition: 'High Volatility Event',
            instruments: ['RELIANCE 2800 CE', 'RELIANCE 2800 PE'],
            icon: Zap,
            gradient: 'from-purple-500 to-pink-600'
        }
    ];

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
            case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bullish': return 'text-green-600';
            case 'bearish': return 'text-red-600';
            case 'neutral': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Strategy Recommendations</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Based on current market conditions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Info className="w-4 h-4" />
                    <span>Updated 5 min ago</span>
                </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-4">
                {recommendations.map((strategy) => {
                    const Icon = strategy.icon;
                    return (
                        <div
                            key={strategy.id}
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700/50 dark:to-slate-700/30 border-2 border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`p-3 bg-gradient-to-br ${strategy.gradient} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                                                    {strategy.name}
                                                </h4>
                                                <span className={`text-xs font-semibold uppercase ${getTypeColor(strategy.type)}`}>
                                                    {strategy.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {strategy.description}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(strategy.riskLevel)}`}>
                                            {strategy.riskLevel.toUpperCase()} RISK
                                        </span>
                                    </div>

                                    {/* Market Condition */}
                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Condition:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{strategy.marketCondition}</span>
                                    </div>

                                    {/* Metrics */}
                                    <div className="flex items-center gap-6 mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Expected Return:</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">{strategy.expectedReturn}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Instruments:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{strategy.instruments.length}</span>
                                        </div>
                                    </div>

                                    {/* Instruments List */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {strategy.instruments.map((instrument, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 rounded"
                                            >
                                                {instrument}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Link
                                            to="/strategy-builder"
                                            state={{
                                                strategyName: strategy.name,
                                                legs: strategy.instruments.map((inst, i) => {
                                                    // Simple parser for demo instruments like 'NIFTY 24500 CE'
                                                    const parts = inst.split(' ');
                                                    const strike = parseInt(parts[1]);
                                                    const type = parts[2] as 'CE' | 'PE' ? (parts[2] === 'CE' ? 'CALL' : 'PUT') : 'CALL';
                                                    // Infer action based on strategy type for demo simplicity
                                                    // Real logic would need robust parsing or explicit data in strategy object
                                                    let action: 'BUY' | 'SELL' = 'BUY';
                                                    if (strategy.name === 'Iron Condor') {
                                                        action = (i === 1 || i === 2) ? 'SELL' : 'BUY';
                                                    } else if (strategy.name === 'Bull Call Spread') {
                                                        action = i === 1 ? 'SELL' : 'BUY';
                                                    }

                                                    return {
                                                        id: `auto-${i}`,
                                                        type: type,
                                                        action: action,
                                                        strike: strike || 24500,
                                                        premium: 100, // Mock premium
                                                        quantity: 50,
                                                        expiry: '2024-12-28'
                                                    };
                                                })
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Deploy Strategy
                                        </Link>
                                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Hover gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${strategy.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        </div>
                    );
                })}
            </div>

            {/* View All Link */}
            <Link
                to="/strategy-builder"
                className="mt-4 flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline"
            >
                View All Strategies <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
