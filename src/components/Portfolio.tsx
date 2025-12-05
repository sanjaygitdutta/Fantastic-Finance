import { Briefcase, TrendingUp, TrendingDown, BarChart3, DollarSign, RefreshCw, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePaperTrading } from '../context/PaperTradingContext';
import { Link, useNavigate } from 'react-router-dom';
import PortfolioInsights from './PortfolioInsights';
import ActivePositions from './ActivePositions';
import { DisplayAd } from './AdSense';

export default function Portfolio() {
    const { portfolio } = usePaperTrading();
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '3m' | '1y' | 'all'>('1m');

    const totalValue = portfolio.cashBalance + portfolio.totalInvested;
    const totalPnL = portfolio.totalPnL;
    const totalPnLPercent = portfolio.totalInvested > 0 ? (totalPnL / portfolio.totalInvested) * 100 : 0;
    const isProfit = totalPnL >= 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Portfolio</h1>
                                <p className="text-slate-500 dark:text-slate-400">Track and manage your investments</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/paper-portfolio')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                            New Trade
                        </button>
                    </div>
                </div>

                {/* Portfolio Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Portfolio Value */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-blue-100 text-sm font-medium">Total Portfolio Value</span>
                            <DollarSign className="w-5 h-5 text-blue-100" />
                        </div>
                        <div className="mb-2">
                            <div className="text-3xl font-bold">₹{totalValue.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-100 text-sm">
                            <RefreshCw className="w-4 h-4" />
                            <span>Updated just now</span>
                        </div>
                    </div>

                    {/* Total P&L */}
                    <div className={`rounded-xl p-6 shadow-lg ${isProfit
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-pink-600'
                        } text-white`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-sm font-medium ${isProfit ? 'text-green-100' : 'text-red-100'}`}>
                                Total P&L
                            </span>
                            {isProfit ? (
                                <TrendingUp className={`w-5 h-5 ${isProfit ? 'text-green-100' : 'text-red-100'}`} />
                            ) : (
                                <TrendingDown className={`w-5 h-5 ${isProfit ? 'text-green-100' : 'text-red-100'}`} />
                            )}
                        </div>
                        <div className="mb-2">
                            <div className="text-3xl font-bold">
                                {isProfit ? '+' : ''}₹{Math.abs(totalPnL).toLocaleString()}
                            </div>
                            <div className="text-xl font-semibold">
                                {isProfit ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                            </div>
                        </div>
                        <div className={`text-sm ${isProfit ? 'text-green-100' : 'text-red-100'}`}>
                            {portfolio.holdings.length} active positions
                        </div>
                    </div>

                    {/* Available Balance */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-purple-100 text-sm font-medium">Available Balance</span>
                            <BarChart3 className="w-5 h-5 text-purple-100" />
                        </div>
                        <div className="mb-2">
                            <div className="text-3xl font-bold">₹{portfolio.cashBalance.toLocaleString()}</div>
                        </div>
                        <div className="text-purple-100 text-sm">
                            Invested: ₹{portfolio.totalInvested.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Timeframe Selector */}
                <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Period:</span>
                        {(['1d', '1w', '1m', '3m', '1y', 'all'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeframe(period)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${timeframe === period
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {period.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Active Positions & Portfolio Insights */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Active Positions */}
                        <ActivePositions />

                        {/* Portfolio Performance Chart Placeholder */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                Portfolio Performance
                            </h3>
                            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                                    <p>Performance chart coming soon</p>
                                    <p className="text-sm mt-1">Track your portfolio growth over time</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Portfolio Insights */}
                    <div className="space-y-6">
                        <PortfolioInsights />

                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Trades</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {portfolio.trades.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Win Rate</span>
                                    <span className="font-semibold text-green-600">67.5%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Avg Trade Size</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">₹12,450</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Best Performer</span>
                                    <span className="font-semibold text-blue-600">
                                        {portfolio.holdings.length > 0
                                            ? portfolio.holdings.reduce((best, h) => h.pnlPercent > best.pnlPercent ? h : best).symbol
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link
                                    to="/paper-portfolio"
                                    className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                                >
                                    Start New Trade
                                </Link>
                                <Link
                                    to="/watchlist"
                                    className="block w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-center font-medium border border-slate-300 dark:border-slate-600"
                                >
                                    View Watchlist
                                </Link>
                                <Link
                                    to="/analytics"
                                    className="block w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition text-center font-medium border border-slate-300 dark:border-slate-600"
                                >
                                    Analytics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567902" className="mt-6" />
        </div>
    );
}
