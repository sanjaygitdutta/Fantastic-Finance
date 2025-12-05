import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, Zap, BarChart2, DollarSign } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface CommodityData {
    name: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    unit: string;
    category: string;
    high52Week: number;
    low52Week: number;
}

export default function Commodity() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const commodities: CommodityData[] = [
        { name: 'Gold', symbol: 'GOLD', price: 62450, change: 125, changePercent: 0.20, unit: '₹/10g', category: 'Precious Metals', high52Week: 65200, low52Week: 56800 },
        { name: 'Silver', symbol: 'SILVER', price: 74250, change: -450, changePercent: -0.60, unit: '₹/kg', category: 'Precious Metals', high52Week: 82500, low52Week: 68000 },
        { name: 'Crude Oil', symbol: 'CRUDEOIL', price: 6850, change: 85, changePercent: 1.26, unit: '₹/bbl', category: 'Energy', high52Week: 7600, low52Week: 5900 },
        { name: 'Natural Gas', symbol: 'NATURALGAS', price: 185.40, change: -2.30, changePercent: -1.22, unit: '₹/mmBtu', category: 'Energy', high52Week: 250.50, low52Week: 155.20 },
        { name: 'Copper', symbol: 'COPPER', price: 728.50, change: 5.80, changePercent: 0.80, unit: '₹/kg', category: 'Base Metals', high52Week: 825.00, low52Week: 655.00 },
        { name: 'Aluminium', symbol: 'ALUMINIUM', price: 218.75, change: -1.25, changePercent: -0.57, unit: '₹/kg', category: 'Base Metals', high52Week: 245.00, low52Week: 195.00 },
        { name: 'Zinc', symbol: 'ZINC', price: 234.60, change: 3.40, changePercent: 1.47, unit: '₹/kg', category: 'Base Metals', high52Week: 285.50, low52Week: 210.00 },
        { name: 'Nickel', symbol: 'NICKEL', price: 1685.20, change: 12.50, changePercent: 0.75, unit: '₹/kg', category: 'Base Metals', high52Week: 2100.00, low52Week: 1450.00 },
    ];

    const categories = ['All', 'Precious Metals', 'Energy', 'Base Metals', 'Agriculture'];

    const filteredCommodities = commodities.filter(commodity => {
        const matchesSearch = commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || commodity.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Commodity Market</h1>
                        <p className="text-slate-500 dark:text-slate-400">Metals, energy, and agricultural commodities</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search commodities..."
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
                                        ? 'bg-orange-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Commodity Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommodities.map((commodity) => (
                    <div key={commodity.symbol} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{commodity.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{commodity.symbol}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {commodity.category}
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                {commodity.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{commodity.unit}</div>
                        </div>

                        <div className={`flex items-center gap-2 mb-4 ${commodity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {commodity.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            <span className="text-lg font-semibold">
                                {commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}
                            </span>
                            <span className="text-sm">
                                ({commodity.change >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
                            </span>
                        </div>

                        <div className="flex gap-4 text-xs">
                            <div>
                                <div className="text-slate-500 dark:text-slate-400 mb-1">52W High</div>
                                <div className="font-semibold text-slate-900 dark:text-white">{commodity.high52Week.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 dark:text-slate-400 mb-1">52W Low</div>
                                <div className="font-semibold text-slate-900 dark:text-white">{commodity.low52Week.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <BarChart2 className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">About Commodities</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-400">
                            Commodities are raw materials or primary agricultural products that can be bought and sold. They're divided into
                            categories like precious metals (gold, silver), energy (crude oil, natural gas), base metals (copper, aluminum),
                            and agricultural products (wheat, cotton).
                        </p>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567913" className="mt-6" />
        </div>
    );
}
