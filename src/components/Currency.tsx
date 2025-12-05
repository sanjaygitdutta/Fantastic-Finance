import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, Globe, DollarSign, RefreshCw } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface CurrencyData {
    pair: string;
    baseCurrency: string;
    quoteCurrency: string;
    rate: number;
    change: number;
    changePercent: number;
    high24h: number;
    low24h: number;
}

export default function Currency() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBase, setSelectedBase] = useState<string>('All');

    const currencies: CurrencyData[] = [
        { pair: 'USD/INR', baseCurrency: 'USD', quoteCurrency: 'INR', rate: 83.25, change: 0.15, changePercent: 0.18, high24h: 83.45, low24h: 82.95 },
        { pair: 'EUR/INR', baseCurrency: 'EUR', quoteCurrency: 'INR', rate: 90.45, change: -0.35, changePercent: -0.39, high24h: 90.92, low24h: 90.10 },
        { pair: 'GBP/INR', baseCurrency: 'GBP', quoteCurrency: 'INR', rate: 105.75, change: 0.55, changePercent: 0.52, high24h: 106.15, low24h: 105.05 },
        { pair: 'JPY/INR', baseCurrency: 'JPY', quoteCurrency: 'INR', rate: 0.56, change: 0.01, changePercent: 1.82, high24h: 0.57, low24h: 0.55 },
        { pair: 'AUD/INR', baseCurrency: 'AUD', quoteCurrency: 'INR', rate: 54.25, change: 0.25, changePercent: 0.46, high24h: 54.55, low24h: 53.95 },
        { pair: 'CAD/INR', baseCurrency: 'CAD', quoteCurrency: 'INR', rate: 61.80, change: -0.20, changePercent: -0.32, high24h: 62.15, low24h: 61.50 },
        { pair: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', rate: 1.0865, change: -0.0025, changePercent: -0.23, high24h: 1.0895, low24h: 1.0845 },
        { pair: 'GBP/USD', baseCurrency: 'GBP', quoteCurrency: 'USD', rate: 1.2705, change: 0.0045, changePercent: 0.36, high24h: 1.2735, low24h: 1.2655 },
    ];

    const baseCurrencies = ['All', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

    const filteredCurrencies = currencies.filter(currency => {
        const matchesSearch = currency.pair.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBase = selectedBase === 'All' || currency.baseCurrency === selectedBase;
        return matchesSearch && matchesBase;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Currency Market</h1>
                        <p className="text-slate-500 dark:text-slate-400">Foreign exchange rates & forex trading</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search currency pairs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {baseCurrencies.map(base => (
                            <button
                                key={base}
                                onClick={() => setSelectedBase(base)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${selectedBase === base
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {base}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Currency Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Pair</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rate</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Change</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">24h High</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">24h Low</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredCurrencies.map((currency) => (
                                <tr key={currency.pair} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900 dark:text-white">{currency.pair}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {currency.baseCurrency}/{currency.quoteCurrency}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white font-mono">
                                        {currency.rate.toFixed(currency.quoteCurrency === 'INR' ? 2 : 4)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`flex items-center justify-end gap-1 ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {currency.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span className="font-semibold">{currency.change >= 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono">
                                        {currency.high24h.toFixed(currency.quoteCurrency === 'INR' ? 2 : 4)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 font-mono">
                                        {currency.low24h.toFixed(currency.quoteCurrency === 'INR' ? 2 : 4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">About Forex Market</h4>
                        <p className="text-sm text-cyan-800 dark:text-cyan-400">
                            The foreign exchange market (Forex) is a global decentralized market for trading currencies. It's the largest
                            and most liquid financial market in the world, with a daily trading volume exceeding $6 trillion.
                        </p>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567912" className="mt-6" />
        </div>
    );
}
