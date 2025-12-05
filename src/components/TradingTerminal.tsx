import { useState } from 'react';
import { ArrowUp, ArrowDown, Clock, CheckCircle } from 'lucide-react';
import UpstoxAuthButton from './UpstoxAuthButton';

// Mock Order Book Data
const BIDS = [
    { price: 2980.50, qty: 150, total: 4.47 },
    { price: 2980.45, qty: 500, total: 14.9 },
    { price: 2980.40, qty: 1200, total: 35.7 },
    { price: 2980.35, qty: 800, total: 23.8 },
    { price: 2980.30, qty: 2500, total: 74.5 },
];

const ASKS = [
    { price: 2980.55, qty: 200, total: 5.96 },
    { price: 2980.60, qty: 600, total: 17.8 },
    { price: 2980.65, qty: 1500, total: 44.7 },
    { price: 2980.70, qty: 900, total: 26.8 },
    { price: 2980.75, qty: 3000, total: 89.4 },
];

export default function TradingTerminal() {
    const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
    const [qty, setQty] = useState('1');
    const [price, setPrice] = useState('2980.50');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderPlaced(true);
        setTimeout(() => setOrderPlaced(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Panel: Market Depth / Order Book */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Market Depth</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 px-2">
                        <span>Bid</span>
                        <span>Orders</span>
                        <span>Qty</span>
                    </div>
                    <div className="space-y-1 mb-4">
                        {BIDS.map((bid, i) => (
                            <div key={i} className="flex justify-between text-sm px-2 py-1 hover:bg-green-50 rounded cursor-pointer relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-green-100 opacity-30" style={{ width: `${(bid.qty / 3000) * 100}%` }}></div>
                                <span className="text-green-600 font-medium z-10">{bid.price.toFixed(2)}</span>
                                <span className="text-slate-600 z-10">2</span>
                                <span className="text-slate-800 z-10">{bid.qty}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-b border-slate-100 py-2 text-center my-2 bg-slate-50">
                        <span className="text-lg font-bold text-slate-800">2980.50</span>
                        <span className="text-xs text-green-600 ml-2">+2.5%</span>
                    </div>

                    <div className="space-y-1">
                        {ASKS.map((ask, i) => (
                            <div key={i} className="flex justify-between text-sm px-2 py-1 hover:bg-red-50 rounded cursor-pointer relative overflow-hidden">
                                <div className="absolute right-0 top-0 bottom-0 bg-red-100 opacity-30" style={{ width: `${(ask.qty / 3000) * 100}%` }}></div>
                                <span className="text-red-600 font-medium z-10">{ask.price.toFixed(2)}</span>
                                <span className="text-slate-600 z-10">3</span>
                                <span className="text-slate-800 z-10">{ask.qty}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Panel: Chart (Placeholder for now) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold text-lg">RELIANCE</h2>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">NSE</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">EQ</span>
                        </div>
                        <UpstoxAuthButton />
                    </div>
                    <div className="flex gap-2">
                        {['1m', '5m', '15m', '1h', '1D'].map(tf => (
                            <button key={tf} className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded">
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 flex items-center justify-center relative">
                    <div className="text-slate-400 flex flex-col items-center">
                        <Clock className="w-12 h-12 mb-2 opacity-20" />
                        <p>Interactive Chart Loading...</p>
                    </div>
                    {/* In a real app, TradingView widget would go here */}
                </div>
            </div>

            {/* Right Panel: Order Entry */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setOrderType('BUY')}
                        className={`flex-1 py-4 font-bold text-sm transition ${orderType === 'BUY' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        BUY
                    </button>
                    <button
                        onClick={() => setOrderType('SELL')}
                        className={`flex-1 py-4 font-bold text-sm transition ${orderType === 'SELL' ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        SELL
                    </button>
                </div>

                <form onSubmit={handleOrder} className="p-6 space-y-6 flex-1">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
                            <div className="flex gap-2">
                                <button type="button" className="flex-1 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">Intraday</button>
                                <button type="button" className="flex-1 py-2 bg-white text-slate-600 text-xs font-bold rounded border border-slate-200">Longterm</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                            <div className="flex gap-2">
                                <button type="button" className="flex-1 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200">Limit</button>
                                <button type="button" className="flex-1 py-2 bg-white text-slate-600 text-xs font-bold rounded border border-slate-200">Market</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Margin Required</span>
                            <span className="font-bold text-slate-900">₹ {(parseFloat(qty) * parseFloat(price) * 0.2).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-6">
                            <span className="text-slate-500">Available Cash</span>
                            <span className="font-bold text-slate-900">₹ 85,430.50</span>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${orderType === 'BUY' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                        >
                            {orderType} RELIANCE
                        </button>
                    </div>
                </form>

                {orderPlaced && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle className="w-5 h-5" />
                        <div>
                            <p className="font-bold">Order Placed</p>
                            <p className="text-xs text-green-100">Your order has been sent to the exchange.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
