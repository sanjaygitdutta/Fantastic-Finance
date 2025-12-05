import { TrendingUp, TrendingDown, Clock, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePaperTrading } from '../context/PaperTradingContext';
import { useState } from 'react';

export default function ActivePositions() {
    const { portfolio, executeTrade } = usePaperTrading();
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = useState(false);

    const positions = portfolio.holdings;

    const totalPnL = portfolio.totalPnL;
    const totalInvested = portfolio.totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    const handleCloseAll = async () => {
        if (!window.confirm('Are you sure you want to close all open positions?')) return;

        setIsClosing(true);
        try {
            // Close each position
            for (const position of positions) {
                executeTrade(position.symbol, 'SELL', position.quantity, position.currentPrice);
            }
        } finally {
            setIsClosing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${totalPnL >= 0
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-pink-600'
                        }`}>
                        {totalPnL >= 0 ? (
                            <TrendingUp className="w-5 h-5 text-white" />
                        ) : (
                            <TrendingDown className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Positions</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {positions.length} open • {totalPnL >= 0 ? '+' : ''}₹{Math.abs(totalPnL).toLocaleString()}
                            <span className={totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {' '}({totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(1)}%)
                            </span>
                        </p>
                    </div>
                </div>
                <Link
                    to="/paper-portfolio"
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    View Portfolio
                </Link>
            </div>

            {/* Positions List */}
            <div className="space-y-3">
                {positions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>No active positions</p>
                        <Link to="/paper-portfolio" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                            Start Trading
                        </Link>
                    </div>
                ) : (
                    positions.map((position) => {
                        const isProfit = position.pnl >= 0;
                        // Mock expiry data for now as it's not in holding interface yet
                        const daysToExpiry = Math.floor(Math.random() * 5) + 1;
                        const isExpiringSoon = daysToExpiry <= 2;

                        return (
                            <div
                                key={position.symbol}
                                className="group relative overflow-hidden rounded-xl p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left: Symbol & Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">
                                                {position.symbol}
                                            </h4>
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                EQUITY
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <span>Avg: ₹{position.avgPrice.toFixed(2)}</span>
                                            <span>Qty: {position.quantity}</span>
                                        </div>
                                    </div>

                                    {/* Center: Price Info */}
                                    <div className="flex flex-col items-end gap-1 px-4">
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">LTP</div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                ₹{position.currentPrice.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: P&L */}
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {isProfit ? '+' : ''}₹{Math.abs(position.pnl).toLocaleString()}
                                        </div>
                                        <div className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {isProfit ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Hover gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${isProfit
                                    ? 'from-green-500/0 to-green-500/5'
                                    : 'from-red-500/0 to-red-500/5'
                                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => navigate('/paper-portfolio')}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                    <DollarSign className="w-4 h-4" />
                    Manage Positions
                </button>
                <button
                    onClick={handleCloseAll}
                    disabled={positions.length === 0 || isClosing}
                    className="py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isClosing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    Close All
                </button>
            </div>

            {/* Broker CTA - Start Trading Live */}
            {positions.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-lg mb-1">Trade Live with Top Brokers</h4>
                            <p className="text-green-100 text-sm">
                                Move from paper to real trading. Open account in minutes.
                            </p>
                        </div>
                        <Link
                            to="/brokers"
                            className="px-5 py-2 bg-white text-green-600 font-bold rounded-lg hover:shadow-lg transition whitespace-nowrap"
                        >
                            Open Account
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
