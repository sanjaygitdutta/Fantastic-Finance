import { usePaperTrading } from '../context/PaperTradingContext';
import { useLivePrices } from '../context/LivePriceContext';
import { TrendingUp, DollarSign, BarChart3, Trophy, RefreshCw, History, Wallet, TrendingDown, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Zap, Target } from 'lucide-react';
import AdSlot from './AdSlot';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PaperPortfolio() {
    const { portfolio, resetPortfolio, getPerformanceMetrics, executeTrade } = usePaperTrading();
    const { prices } = useLivePrices();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showTradeModal, setShowTradeModal] = useState(false);

    // Trade Form State
    const [tradeSymbol, setTradeSymbol] = useState('');
    const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
    const [tradeQuantity, setTradeQuantity] = useState(1);
    const [tradePrice, setTradePrice] = useState(0);
    const [tradeError, setTradeError] = useState('');

    const metrics = getPerformanceMetrics();

    const handleExecuteTrade = () => {
        setTradeError('');
        if (!tradeSymbol || tradeQuantity <= 0 || tradePrice <= 0) {
            setTradeError('Please fill all fields correctly');
            return;
        }

        const success = executeTrade(tradeSymbol.toUpperCase(), tradeType, Number(tradeQuantity), Number(tradePrice));

        if (success) {
            setShowTradeModal(false);
            setTradeSymbol('');
            setTradeQuantity(1);
            setTradePrice(0);
        } else {
            setTradeError(tradeType === 'BUY' ? 'Insufficient funds' : 'Insufficient holdings');
        }
    };

    // Calculate current portfolio value
    const holdingsValue = portfolio.holdings.reduce((sum, holding) => {
        const currentPrice = prices[holding.symbol]?.price || holding.currentPrice;
        return sum + (currentPrice * holding.quantity);
    }, 0);

    const totalPortfolioValue = portfolio.cashBalance + holdingsValue;
    const totalPnL = totalPortfolioValue - 1000000; // Initial cash
    const totalPnLPercent = (totalPnL / 1000000) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-3xl text-white shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-300" />
                            Paper Trading Portfolio
                        </h1>
                        <p className="text-green-100 mb-6">Practice trading with virtual money - No risk, Real learning!</p>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                                <p className="text-sm text-green-100 mb-1">Virtual Cash</p>
                                <p className="text-3xl font-bold">₹{portfolio.cashBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowTradeModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-bold shadow-lg hover:bg-green-50 transition transform hover:scale-105"
                        >
                            <DollarSign className="w-5 h-5" /> New Trade
                        </button>
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition font-medium"
                        >
                            <RefreshCw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Trade Modal */}
            {showTradeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Execute Paper Trade</h3>

                        <div className="space-y-4">
                            {/* Type Selection */}
                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setTradeType('BUY')}
                                    className={`flex-1 py-2 rounded-md font-bold transition ${tradeType === 'BUY'
                                        ? 'bg-green-500 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    BUY
                                </button>
                                <button
                                    onClick={() => setTradeType('SELL')}
                                    className={`flex-1 py-2 rounded-md font-bold transition ${tradeType === 'SELL'
                                        ? 'bg-red-500 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    SELL
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Symbol</label>
                                <input
                                    type="text"
                                    value={tradeSymbol}
                                    onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
                                    placeholder="e.g. RELIANCE"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={tradeQuantity}
                                        onChange={(e) => setTradeQuantity(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={tradePrice}
                                        onChange={(e) => setTradePrice(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {tradeError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                    {tradeError}
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setShowTradeModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteTrade}
                                    className={`flex-1 px-4 py-3 text-white rounded-xl font-bold shadow-lg transition ${tradeType === 'BUY'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {tradeType}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md">
                        <h3 className="font-bold text-xl text-slate-800 mb-2">Reset Portfolio?</h3>
                        <p className="text-slate-600 mb-6">This will delete all your paper trades and reset cash to ₹10,00,000. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    resetPortfolio();
                                    setShowResetConfirm(false);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Total Value</p>
                        <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">₹{totalPortfolioValue.toLocaleString()}</p>
                    <p className={`text-sm mt-2 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString()} ({totalPnLPercent.toFixed(2)}%)
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Total Return</p>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className={`text-3xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Since start</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Win Rate</p>
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{metrics.winRate.toFixed(1)}%</p>
                    <p className="text-sm text-slate-500 mt-2">{portfolio.trades.filter(t => t.type === 'SELL').length} completed</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-500">Total Trades</p>
                        <History className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{metrics.tradesCount}</p>
                    <p className="text-sm text-slate-500 mt-2">Avg: ₹{metrics.avgProfit.toFixed(0)}</p>
                </div>
            </div>

            {/* Holdings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="font-bold text-xl text-slate-800 mb-4">Current Holdings</h2>
                {portfolio.holdings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No holdings yet. Start trading from the Trading Terminal!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left p-3 font-semibold text-slate-700">Symbol</th>
                                    <th className="text-right p-3 font-semibold text-slate-700">Qty</th>
                                    <th className="text-right p-3 font-semibold text-slate-700">Avg Price</th>
                                    <th className="text-right p-3 font-semibold text-slate-700">Current Price</th>
                                    <th className="text-right p-3 font-semibold text-slate-700">P&L</th>
                                    <th className="text-right p-3 font-semibold text-slate-700">P&L %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.holdings.map((holding) => {
                                    const currentPrice = prices[holding.symbol]?.price || holding.currentPrice;
                                    const pnl = (currentPrice - holding.avgPrice) * holding.quantity;
                                    const pnlPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

                                    return (
                                        <tr key={holding.symbol} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            <td className="p-3 font-medium text-slate-900">{holding.symbol}</td>
                                            <td className="p-3 text-right text-slate-700">{holding.quantity}</td>
                                            <td className="p-3 text-right text-slate-700">₹{holding.avgPrice.toLocaleString()}</td>
                                            <td className="p-3 text-right font-medium text-slate-900">₹{currentPrice.toLocaleString()}</td>
                                            <td className={`p-3 text-right font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()}
                                            </td>
                                            <td className={`p-3 text-right font-bold ${pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Broker CTA - Ready to Trade for Real */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2">Ready to Trade for Real?</h3>
                        <p className="text-blue-100 mb-4">
                            You've mastered paper trading! Open a free demat account and start trading with real money.
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm text-blue-100">
                            <span className="flex items-center gap-1">
                                ✓ Zero account opening fees
                            </span>
                            <span className="flex items-center gap-1">
                                ✓ ₹20/order flat brokerage
                            </span>
                            <span className="flex items-center gap-1">
                                ✓ Instant approval
                            </span>
                        </div>
                    </div>
                    <div className="ml-6">
                        <Link
                            to="/brokers"
                            className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            View Brokers →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trade History */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="font-bold text-xl text-slate-800 mb-4">Trade History</h2>
                {portfolio.trades.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No trades yet. Execute your first trade!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {[...portfolio.trades].reverse().slice(0, 20).map((trade) => (
                            <div
                                key={trade.id}
                                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${trade.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {trade.type}
                                    </span>
                                    <div>
                                        <p className="font-medium text-slate-900">{trade.symbol}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(trade.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-slate-900">{trade.quantity} @ ₹{trade.price.toLocaleString()}</p>
                                    {trade.pnl !== undefined && (
                                        <p className={`text-sm font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* AdSense Display Ad */}
            <AdSlot slot="paper-portfolio-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
