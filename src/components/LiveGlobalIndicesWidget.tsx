import { useLivePrices } from '../context/LivePriceContext';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

export default function LiveGlobalIndicesWidget() {
    const { prices } = useLivePrices();

    const indices = [
        { key: 'NASDAQ', name: 'NASDAQ' },
        { key: 'DOW JONES', name: 'Dow Jones' },
        { key: 'S&P 500', name: 'S&P 500' },
        { key: 'DAX', name: 'DAX' },
        { key: 'FTSE', name: 'FTSE 100' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indices.map(index => {
                const data = prices[index.key];
                // If no data, maybe show a skeleton or nothing?
                // But we likely have initial mock data, so it will show something.
                if (!data) return null;

                const isPositive = data.change >= 0;

                return (
                    <div key={index.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:shadow-md hover:border-blue-200 group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-slate-700">{index.name}</h4>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> GLOBAL
                                </span>
                            </div>
                            <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="text-2xl font-bold text-slate-800 tracking-tight tabular-nums">
                                {data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`flex items-center gap-2 text-sm font-medium mt-1 tabular-nums ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{isPositive ? '+' : ''}{data.change.toFixed(2)}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {Math.abs(data.changePercent).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
