import { useState, useEffect, memo } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default memo(function GiftNiftySimulation() {
    const [price, setPrice] = useState(22550.00); // Base price close to simulated NIFTY
    const [change, setChange] = useState(0);
    const [percentChange, setPercentChange] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Simulate live data updates
        const interval = setInterval(() => {
            const movement = (Math.random() - 0.45) * 15; // Random movement between -6.75 and +8.25 (slightly bullish bias)

            setPrice(prev => {
                const newPrice = prev + movement;
                const priceChange = newPrice - 22400; // Assuming previous close around 22400
                setChange(priceChange);
                setPercentChange((priceChange / 22400) * 100);
                return newPrice;
            });
            setLastUpdate(new Date());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const isPositive = change >= 0;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden text-white relative">
            {/* Live Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Simulated Live</span>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">GIFT NIFTY</h3>
                        <p className="text-slate-400 text-sm">NSEIX • Derivatives</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mb-6">
                    <div className="text-4xl font-bold tabular-nums tracking-tight">
                        {price.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-2 text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="tabular-nums">
                            {isPositive ? '+' : ''}{change.toFixed(2)}
                            <span className="opacity-60 ml-1">
                                ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
                            </span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Open</p>
                        <p className="font-semibold tabular-nums">22,450.00</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Prev. Close</p>
                        <p className="font-semibold tabular-nums">22,400.00</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">High</p>
                        <p className="font-semibold tabular-nums">{(price + 45).toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Low</p>
                        <p className="font-semibold tabular-nums">{(price - 25).toFixed(2)}</p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <div>
                        Session: <span className="text-green-400 font-medium">Open 21h</span>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
    );
});
