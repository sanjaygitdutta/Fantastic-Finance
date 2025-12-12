import { useLivePrices } from '../context/LivePriceContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LivePriceGridProps {
    symbols: string[];
    columns?: 2 | 3 | 4;
}

export default function LivePriceGrid({ symbols, columns = 3 }: LivePriceGridProps) {
    const { prices } = useLivePrices();

    // Responsive grid class
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return (
        <div className={`grid ${gridCols} gap-4`}>
            {symbols.map((symbol) => {
                const data = prices[symbol];

                // If data isn't available yet, show a loading/placeholder state
                if (!data) {
                    return (
                        <div key={symbol} className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-pulse">
                            <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    );
                }

                const isPositive = data.change > 0;
                const isNegative = data.change < 0;

                let textColor = 'text-slate-600';
                let bgColor = 'bg-slate-100';
                let Icon = Minus;

                if (isPositive) {
                    textColor = 'text-green-600';
                    bgColor = 'bg-green-50';
                    Icon = TrendingUp;
                } else if (isNegative) {
                    textColor = 'text-red-600';
                    bgColor = 'bg-red-50';
                    Icon = TrendingDown;
                }

                return (
                    <div key={symbol} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-blue-200 group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-lg">{symbol}</h3>
                            <div className={`p-2 rounded-lg ${bgColor} ${textColor}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mt-1">
                            <div className={`text-2xl font-bold tracking-tight tabular-nums text-slate-900`}>
                                {data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`flex items-center gap-2 text-sm font-semibold mt-1 tabular-nums ${textColor}`}>
                                <span>
                                    {isPositive ? '+' : ''}{data.change.toFixed(2)}
                                </span>
                                <span className="opacity-80">
                                    ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
