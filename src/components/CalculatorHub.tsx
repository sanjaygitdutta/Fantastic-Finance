import { Calculator, TrendingUp, BarChart3, PieChart, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DisplayAd } from './AdSense';

interface CalculatorTool {
    id: number;
    title: string;
    description: string;
    route: string;
    icon: any;
    color: string;
    bgColor: string;
}

export default function CalculatorHub() {
    const tools: CalculatorTool[] = [
        {
            id: 1,
            title: 'Black-Scholes Calculator',
            description: 'Calculate theoretical option prices using the Black-Scholes model',
            route: '/black-scholes',
            icon: Calculator,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 2,
            title: 'Performance Metrics',
            description: 'Analyze portfolio performance with advanced metrics and statistics',
            route: '/analytics?tab=metrics',
            icon: TrendingUp,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            id: 3,
            title: 'PCR Analysis',
            description: 'Put-Call Ratio analysis for market sentiment indicators',
            route: '/analytics?tab=pcr',
            icon: BarChart3,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            id: 4,
            title: 'IV Analysis',
            description: 'Implied Volatility analysis and volatility surface visualization',
            route: '/iv-analysis',
            icon: Activity,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            id: 5,
            title: 'Margin Calculator',
            description: 'Calculate margin requirements for options and futures positions',
            route: '/margin-calculator',
            icon: DollarSign,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            id: 6,
            title: 'Options Calculator',
            description: 'Greeks, breakeven, and profit/loss calculator for options strategies',
            route: '/strategy',
            icon: PieChart,
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trading Calculators</h1>
                            <p className="text-slate-500 dark:text-slate-400">Professional tools for options & derivatives analysis</p>
                        </div>
                    </div>
                </div>

                {/* Calculator Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.id}
                                to={tool.route}
                                className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition"
                            >
                                <div className={`w-14 h-14 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                    <Icon className={`w-7 h-7 ${tool.color}`} />
                                </div>

                                <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:${tool.color} transition`}>
                                    {tool.title}
                                </h3>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    {tool.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Open Calculator
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About Trading Calculators</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Access professional-grade calculators and analysis tools used by traders worldwide.
                                Calculate option prices, analyze implied volatility, estimate margin requirements,
                                and evaluate complex options strategies with precision. All tools are designed to help
                                you make informed trading decisions with accurate mathematical models.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-2">💡 Quick Tip</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Use the Black-Scholes calculator to determine fair option prices before placing trades
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-2">📊 Pro Feature</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            IV Analysis shows volatility skew and helps identify mispriced options
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-2">⚡ Power User</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Combine multiple calculators to analyze complex multi-leg option strategies
                        </p>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567907" className="mt-6" />
        </div>
    );
}
