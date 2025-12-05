import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { usePaperTrading } from '../context/PaperTradingContext';
import { useLivePrices } from '../context/LivePriceContext';

interface QuickTradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultSymbol?: string;
}

export default function QuickTradeModal({ isOpen, onClose, defaultSymbol = 'NIFTY 50' }: QuickTradeModalProps) {
    const { executeTrade, portfolio } = usePaperTrading();
    const { prices } = useLivePrices();

    const [symbol, setSymbol] = useState(defaultSymbol);
    const [quantity, setQuantity] = useState(50);
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
    const [limitPrice, setLimitPrice] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Get current price from live context or fallback
    const currentPrice = prices[symbol]?.price || (symbol === 'NIFTY 50' ? 19500 : 44500);

    useEffect(() => {
        if (isOpen) {
            setSymbol(defaultSymbol);
            setQuantity(50);
            setError(null);
            setSuccess(null);
        }
    }, [isOpen, defaultSymbol]);

    const handleTrade = (type: 'BUY' | 'SELL') => {
        setError(null);
        setSuccess(null);

        const price = orderType === 'MARKET' ? currentPrice : limitPrice;
        const totalValue = price * quantity;

        if (type === 'BUY' && totalValue > portfolio.cashBalance) {
            setError(`Insufficient funds. Required: ₹${totalValue.toLocaleString()}`);
            return;
        }

        const result = executeTrade(symbol, type, quantity, price);

        if (result) {
            setSuccess(`${type} order executed for ${quantity} Qty of ${symbol} at ₹${price}`);
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setError('Trade failed. Please check your positions or funds.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Trade</h3>
                        <p className="text-sm text-slate-500">Paper Trading Account</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Symbol & Price */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Symbol</label>
                            <select
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="block w-full bg-transparent font-bold text-lg text-slate-900 dark:text-white focus:outline-none"
                            >
                                <option value="NIFTY 50">NIFTY 50</option>
                                <option value="BANKNIFTY">BANKNIFTY</option>
                                <option value="RELIANCE">RELIANCE</option>
                                <option value="HDFCBANK">HDFCBANK</option>
                                <option value="INFY">INFY</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LTP</label>
                            <div className="text-xl font-bold text-blue-600">₹{currentPrice.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Quantity & Order Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Order Type</label>
                            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                                <button
                                    onClick={() => setOrderType('MARKET')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${orderType === 'MARKET' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500'}`}
                                >
                                    Market
                                </button>
                                <button
                                    onClick={() => setOrderType('LIMIT')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${orderType === 'LIMIT' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500'}`}
                                >
                                    Limit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Margin Info */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Required Margin</span>
                        <span className="font-bold text-slate-900 dark:text-white">₹{(currentPrice * quantity).toLocaleString()}</span>
                    </div>

                    {/* Feedback Messages */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> {success}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button
                            onClick={() => handleTrade('BUY')}
                            className="py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <TrendingUp className="w-5 h-5" /> BUY
                        </button>
                        <button
                            onClick={() => handleTrade('SELL')}
                            className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <TrendingDown className="w-5 h-5" /> SELL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
