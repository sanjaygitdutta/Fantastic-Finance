import { useState } from 'react';
import { PieChart, Search, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import AdSlot from './AdSlot';

interface ETFData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    aum: string;
    expenseRatio: string;
    category: string;
}

export default function ETF() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const etfs: ETFData[] = [
        { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES', price: 245.30, change: 3.20, changePercent: 1.32, volume: 1250000, aum: '₹8,500 Cr', expenseRatio: '0.05%', category: 'Equity' },
        { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', price: 62.40, change: -0.50, changePercent: -0.80, volume: 850000, aum: '₹12,200 Cr', expenseRatio: '1.00%', category: 'Gold' },
        { symbol: 'JUNIORBEES', name: 'Nippon India ETF Junior BeES', price: 582.15, change: 8.75, changePercent: 1.52, volume: 420000, aum: '₹1,800 Cr', expenseRatio: '0.55%', category: 'Equity' },
        { symbol: 'LIQUIDBEES', name: 'Nippon India ETF Liquid BeES', price: 1000.25, change: 0.05, changePercent: 0.00, volume: 95000, aum: '₹15,500 Cr', expenseRatio: '0.10%', category: 'Debt' },
        { symbol: 'BANKBEES', name: 'Nippon India ETF Bank BeES', price: 478.90, change: -5.30, changePercent: -1.09, volume: 680000, aum: '₹3,200 Cr', expenseRatio: '0.60%', category: 'Equity' },
        { symbol: 'SETFNIF50', name: 'SBI ETF Nifty 50', price: 248.75, change: 3.45, changePercent: 1.41, volume: 920000, aum: '₹4,500 Cr', expenseRatio: '0.07%', category: 'Equity' },
    ];

    const categories = ['All', 'Equity', 'Debt', 'Gold', 'International'];

    const filteredETFs = etfs.filter(etf => {
        const matchesSearch = etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            etf.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || etf.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ETF Market</h1>
                        <p className="text-slate-500 dark:text-slate-400">Exchange Traded Funds - Track indices & assets</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ETFs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filterCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ETF Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Symbol</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Price</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Change</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Volume</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">AUM</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Expense Ratio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredETFs.map((etf) => (
                                <tr key={etf.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{etf.symbol}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{etf.name}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">₹{etf.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`flex items-center justify-end gap-1 ${etf.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {etf.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span className="font-semibold">{etf.change >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{(etf.volume / 1000).toFixed(0)}K</td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{etf.aum}</td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{etf.expenseRatio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About ETFs</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            Exchange-Traded Funds (ETFs) are investment funds traded on stock exchanges. They hold assets such as stocks,
                            commodities, or bonds and generally operate with an arbitrage mechanism to keep trading close to net asset value.
                        </p>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <AdSlot slot="etf-bottom" format="horizontal" className="mt-8 opacity-80" />
        </div>
    );
}
