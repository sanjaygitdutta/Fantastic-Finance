import { PieChart, Shield, TrendingUp, AlertTriangle, Network } from 'lucide-react';

export default function PortfolioInsights() {
    // Mock portfolio data - in real app, calculate from actual positions
    const portfolioData = {
        totalValue: 1245678,
        diversificationScore: 72, // Out of 100
        riskLevel: 'medium', // low, medium, high
        sectorAllocation: [
            { sector: 'Technology', percentage: 35, color: 'bg-blue-500' },
            { sector: 'Finance', percentage: 25, color: 'bg-green-500' },
            { sector: 'Energy', percentage: 20, color: 'bg-orange-500' },
            { sector: 'Healthcare', percentage: 12, color: 'bg-purple-500' },
            { sector: 'Other', percentage: 8, color: 'bg-gray-400' }
        ],
        greeks: {
            delta: 0.42,
            gamma: 0.015,
            theta: -125.50,
            vega: 45.30
        },
        hedgeRecommendations: [
            'Consider buying NIFTY puts to hedge delta exposure',
            'Add negative delta positions to balance portfolio'
        ]
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', ring: 'ring-green-500' };
            case 'medium': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600', ring: 'ring-orange-500' };
            case 'high': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600', ring: 'ring-red-500' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-500' };
        }
    };

    const riskColors = getRiskColor(portfolioData.riskLevel);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Insights</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Risk & diversification analysis</p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Diversification Score */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Network className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Diversification</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                        {portfolioData.diversificationScore}
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${portfolioData.diversificationScore}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                        {portfolioData.diversificationScore >= 70 ? 'Well diversified' : 'Consider diversifying'}
                    </span>
                </div>

                {/* Risk Level */}
                <div className={`p-4 rounded-xl ${riskColors.bg} border ${riskColors.ring} ring-1`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className={`w-4 h-4 ${riskColors.text}`} />
                        <span className={`text-xs font-medium ${riskColors.text}`}>Risk Level</span>
                    </div>
                    <div className={`text-3xl font-bold ${riskColors.text} mb-1 uppercase`}>
                        {portfolioData.riskLevel}
                    </div>
                    <span className={`text-xs ${riskColors.text}`}>
                        {portfolioData.riskLevel === 'medium' ? 'Balanced exposure' : 'Review positions'}
                    </span>
                </div>
            </div>

            {/* Sector Allocation */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Sector Allocation</h4>
                <div className="space-y-3">
                    {portfolioData.sectorAllocation.map((sector, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sector.sector}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{sector.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`${sector.color} h-2 rounded-full transition-all duration-500 group-hover:opacity-80`}
                                    style={{ width: `${sector.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Portfolio Greeks */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Portfolio Greeks
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Delta</div>
                        <div className={`text-xl font-bold ${portfolioData.greeks.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {portfolioData.greeks.delta > 0 ? '+' : ''}{portfolioData.greeks.delta.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Gamma</div>
                        <div className="text-xl font-bold text-blue-600">{portfolioData.greeks.gamma.toFixed(3)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Theta (Daily)</div>
                        <div className="text-xl font-bold text-orange-600">₹{portfolioData.greeks.theta.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Vega</div>
                        <div className="text-xl font-bold text-purple-600">{portfolioData.greeks.vega.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Hedge Recommendations */}
            {portfolioData.hedgeRecommendations.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Hedge Suggestions</h4>
                            <ul className="space-y-1">
                                {portfolioData.hedgeRecommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
