import { useEffect, useState } from 'react';
import { useLivePrices } from '../context/LivePriceContext';

export default function LiveMarketTicker() {
    const { prices, usingLiveApi } = useLivePrices();
    const [hovered, setHovered] = useState(false);

    // List of symbols to display in ticker
    const tickerSymbols = [
        'NIFTY 50', 'BANKNIFTY', 'SENSEX', 'NASDAQ', 'DOW JONES', 'S&P 500', 'DAX', 'FTSE',
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'SBIN', 'TATAMOTORS',
        'GOLD', 'SILVER', 'CRUDEOIL', 'BTC', 'ETH', 'SOL'
    ];

    // CSS Animation for infinite scroll
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ticker-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-ticker {
                animation: ticker-scroll 60s linear infinite; /* Slower for readability */
            }
            .pause-animation {
                animation-play-state: paused;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const TickerItem = ({ symbol }: { symbol: string }) => {
        const data = prices[symbol];
        if (!data) return null;

        const isPositive = data.change >= 0;
        const colorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

        return (
            <div className="flex items-center gap-2 px-6 border-r border-slate-200 dark:border-slate-700 min-w-max">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">{symbol}</span>
                <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${colorClass}`}>
                    {data.price.toFixed(2)}
                </span>
                <span className={`text-xs flex items-center tabular-nums whitespace-nowrap font-medium ${colorClass}`}>
                    ({isPositive ? '+' : ''}{data.change.toFixed(2)}
                    <span className="mx-1"></span>
                    {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
                </span>
            </div>
        );
    };

    return (
        <div
            className="relative w-full overflow-hidden bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 h-12 flex items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={`flex items-center ${hovered ? 'pause-animation' : 'animate-ticker'}`}>
                {/* First Set */}
                {tickerSymbols.map(symbol => (
                    <TickerItem key={`1-${symbol}`} symbol={symbol} />
                ))}
                {/* Duplicate Set for Infinite Scroll Effect */}
                {tickerSymbols.map(symbol => (
                    <TickerItem key={`2-${symbol}`} symbol={symbol} />
                ))}
            </div>

            {/* Live Indicator Overlay */}
            <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white via-transparent to-transparent dark:from-slate-900 w-12 z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white via-transparent to-transparent dark:from-slate-900 w-12 z-10 pointer-events-none"></div>

            {!usingLiveApi && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-300 font-medium">SIMULATED</span>
                </div>
            )}
        </div>
    );
}
