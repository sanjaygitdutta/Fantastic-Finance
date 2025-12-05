import { useState } from 'react';

interface StockData {
    symbol: string;
    change: number;
    weight: number; // Market cap weight for sizing
}

const MOCK_HEATMAP_DATA: StockData[] = [
    { symbol: 'RELIANCE', change: 1.5, weight: 10 },
    { symbol: 'HDFCBANK', change: -0.8, weight: 9 },
    { symbol: 'ICICIBANK', change: 0.5, weight: 7 },
    { symbol: 'INFY', change: -1.2, weight: 6 },
    { symbol: 'TCS', change: 0.2, weight: 5 },
    { symbol: 'ITC', change: 2.1, weight: 4 },
    { symbol: 'L&T', change: 1.8, weight: 4 },
    { symbol: 'AXISBANK', change: -0.5, weight: 3 },
    { symbol: 'KOTAKBANK', change: 0.1, weight: 3 },
    { symbol: 'SBIN', change: 1.2, weight: 3 },
    { symbol: 'BHARTIARTL', change: -0.3, weight: 3 },
    { symbol: 'BAJFINANCE', change: -2.5, weight: 2 },
    { symbol: 'ASIANPAINT', change: 0.8, weight: 2 },
    { symbol: 'MARUTI', change: 1.1, weight: 2 },
    { symbol: 'TITAN', change: -0.9, weight: 2 },
    { symbol: 'HCLTECH', change: 0.4, weight: 2 },
    { symbol: 'SUNPHARMA', change: 1.5, weight: 1.5 },
    { symbol: 'TATASTEEL', change: -1.8, weight: 1.5 },
    { symbol: 'NTPC', change: 0.6, weight: 1.5 },
    { symbol: 'POWERGRID', change: 0.9, weight: 1.5 },
];

export default function MarketHeatmap() {
    const getColor = (change: number) => {
        if (change >= 2) return 'bg-green-600';
        if (change > 0) return 'bg-green-500';
        if (change <= -2) return 'bg-red-600';
        if (change < 0) return 'bg-red-500';
        return 'bg-slate-500';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">NIFTY 50 Heatmap</h2>
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded"></div> &gt; 2%</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> 0 to 2%</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> 0 to -2%</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div> &lt; -2%</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 h-[500px] content-start">
                {MOCK_HEATMAP_DATA.map((stock) => (
                    <div
                        key={stock.symbol}
                        className={`${getColor(stock.change)} text-white p-2 rounded hover:opacity-90 transition cursor-pointer flex flex-col justify-center items-center`}
                        style={{
                            flexGrow: stock.weight,
                            flexBasis: `${stock.weight * 8}px`, // Rough sizing based on weight
                            minHeight: '80px'
                        }}
                        title={`${stock.symbol}: ${stock.change}%`}
                    >
                        <span className="font-bold text-xs md:text-sm truncate w-full text-center">{stock.symbol}</span>
                        <span className="text-xs font-medium">{stock.change > 0 ? '+' : ''}{stock.change}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
