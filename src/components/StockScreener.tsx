import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Download, Save, Zap, Target } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    pe: number;
    sector: string;
    rsi: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
}

interface ScreenerFilters {
    priceMin: number;
    priceMax: number;
    marketCapMin: number;
    peMin: number;
    peMax: number;
    volumeMin: number;
    changePercentMin: number;
    changePercentMax: number;
    rsiMin: number;
    rsiMax: number;
    sector: string;
}

// Mock NSE stocks data
const mockStocks: Stock[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2980, change: 45, changePercent: 1.53, volume: 4500000, marketCap: 2015000, pe: 28.5, sector: 'Energy', rsi: 65, fiftyTwoWeekHigh: 3100, fiftyTwoWeekLow: 2200 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4125, change: -20, changePercent: -0.48, volume: 2100000, marketCap: 1504000, pe: 32.1, sector: 'IT', rsi: 45, fiftyTwoWeekHigh: 4300, fiftyTwoWeekLow: 3500 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1650, change: 15, changePercent: 0.92, volume: 8900000, marketCap: 920000, pe: 18.7, sector: 'Banking', rsi: 58, fiftyTwoWeekHigh: 1750, fiftyTwoWeekLow: 1400 },
    { symbol: 'INFY', name: 'Infosys', price: 1820, change: 25, changePercent: 1.39, volume: 5200000, marketCap: 756000, pe: 28.9, sector: 'IT', rsi: 62, fiftyTwoWeekHigh: 1900, fiftyTwoWeekLow: 1450 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1050, change: 8, changePercent: 0.77, volume: 7800000, marketCap: 735000, pe: 17.2, sector: 'Banking', rsi: 55, fiftyTwoWeekHigh: 1100, fiftyTwoWeekLow: 850 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2680, change: -12, changePercent: -0.45, volume: 1500000, marketCap: 630000, pe: 65.3, sector: 'FMCG', rsi: 42, fiftyTwoWeekHigh: 2900, fiftyTwoWeekLow: 2400 },
    { symbol: 'ITC', name: 'ITC Limited', price: 475, change: 3, changePercent: 0.64, volume: 12000000, marketCap: 592000, pe: 28.1, sector: 'FMCG', rsi: 52, fiftyTwoWeekHigh: 500, fiftyTwoWeekLow: 400 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 820, change: 12, changePercent: 1.49, volume: 9500000, marketCap: 732000, pe: 12.5, sector: 'Banking', rsi: 68, fiftyTwoWeekHigh: 850, fiftyTwoWeekLow: 600 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1580, change: -8, changePercent: -0.50, volume: 4200000, marketCap: 945000, pe: 45.2, sector: 'Telecom', rsi: 48, fiftyTwoWeekHigh: 1650, fiftyTwoWeekLow: 1200 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 3420, change: 20, changePercent: 0.59, volume: 980000, marketCap: 328000, pe: 72.5, sector: 'Consumer', rsi: 56, fiftyTwoWeekHigh: 3600, fiftyTwoWeekLow: 2900 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12800, change: 150, changePercent: 1.19, volume: 650000, marketCap: 386000, pe: 35.8, sector: 'Auto', rsi: 71, fiftyTwoWeekHigh: 13000, fiftyTwoWeekLow: 9500 },
    { symbol: 'TATASTEEL', name: 'Tata Steel', price: 165, change: -2, changePercent: -1.20, volume: 15000000, marketCap: 203000, pe: 8.2, sector: 'Metals', rsi: 38, fiftyTwoWeekHigh: 180, fiftyTwoWeekLow: 120 },
    { symbol: 'WIPRO', name: 'Wipro', price: 680, change: 5, changePercent: 0.74, volume: 3200000, marketCap: 372000, pe: 24.6, sector: 'IT', rsi: 50, fiftyTwoWeekHigh: 750, fiftyTwoWeekLow: 550 },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy', price: 1950, change: 80, changePercent: 4.28, volume: 5800000, marketCap: 318000, pe: 285.4, sector: 'Energy', rsi: 78, fiftyTwoWeekHigh: 2100, fiftyTwoWeekLow: 800 },
    { symbol: 'TITAN', name: 'Titan Company', price: 3680, change: 25, changePercent: 0.68, volume: 1200000, marketCap: 327000, pe: 88.5, sector: 'Consumer', rsi: 60, fiftyTwoWeekHigh: 3900, fiftyTwoWeekLow: 2900 },
];

const presets = [
    {
        name: 'Value Stocks',
        description: 'Low P/E, High Market Cap',
        filters: { peMax: 20, marketCapMin: 500000, priceMin: 0, priceMax: 100000, volumeMin: 0, changePercentMin: -100, changePercentMax: 100, rsiMin: 0, rsiMax: 100, sector: 'All', peMin: 0 }
    },
    {
        name: 'Momentum Gainers',
        description: 'High RSI, Positive Change',
        filters: { rsiMin: 60, changePercentMin: 0.5, priceMin: 0, priceMax: 100000, marketCapMin: 0, peMin: 0, peMax: 1000, volumeMin: 0, changePercentMax: 100, rsiMax: 100, sector: 'All' }
    },
    {
        name: 'Oversold Stocks',
        description: 'Low RSI, Potential Reversal',
        filters: { rsiMin: 0, rsiMax: 40, priceMin: 0, priceMax: 100000, marketCapMin: 0, peMin: 0, peMax: 1000, volumeMin: 0, changePercentMin: -100, changePercentMax: 100, sector: 'All' }
    },
    {
        name: 'High Volume Breakout',
        description: 'High Volume + Positive Change',
        filters: { volumeMin: 5000000, changePercentMin: 1, priceMin: 0, priceMax: 100000, marketCapMin: 0, peMin: 0, peMax: 1000, changePercentMax: 100, rsiMin: 0, rsiMax: 100, sector: 'All' }
    }
];

export default function StockScreener() {
    const [filters, setFilters] = useState<ScreenerFilters>({
        priceMin: 0,
        priceMax: 100000,
        marketCapMin: 0,
        peMin: 0,
        peMax: 1000,
        volumeMin: 0,
        changePercentMin: -100,
        changePercentMax: 100,
        rsiMin: 0,
        rsiMax: 100,
        sector: 'All'
    });

    const [searchTerm, setSearchTerm] = useState('');

    const applyPreset = (preset: typeof presets[0]) => {
        setFilters(preset.filters);
    };

    const resetFilters = () => {
        setFilters({
            priceMin: 0,
            priceMax: 100000,
            marketCapMin: 0,
            peMin: 0,
            peMax: 1000,
            volumeMin: 0,
            changePercentMin: -100,
            changePercentMax: 100,
            rsiMin: 0,
            rsiMax: 100,
            sector: 'All'
        });
    };

    const filteredStocks = mockStocks.filter(stock => {
        if (searchTerm && !stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !stock.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (stock.price < filters.priceMin || stock.price > filters.priceMax) return false;
        if (stock.marketCap < filters.marketCapMin) return false;
        if (stock.pe < filters.peMin || stock.pe > filters.peMax) return false;
        if (stock.volume < filters.volumeMin) return false;
        if (stock.changePercent < filters.changePercentMin || stock.changePercent > filters.changePercentMax) return false;
        if (stock.rsi < filters.rsiMin || stock.rsi > filters.rsiMax) return false;
        if (filters.sector !== 'All' && stock.sector !== filters.sector) return false;
        return true;
    });

    const exportResults = () => {
        const csv = [
            ['Symbol', 'Name', 'Price', 'Change%', 'Volume', 'Market Cap', 'P/E', 'RSI', 'Sector'].join(','),
            ...filteredStocks.map(s => [s.symbol, s.name, s.price, s.changePercent, s.volume, s.marketCap, s.pe, s.rsi, s.sector].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screener-results.csv';
        a.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Filter className="w-8 h-8" />
                    Stock Screener
                </h1>
                <p className="text-indigo-100">Discover trading opportunities with advanced filters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Presets */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Quick Presets
                        </h3>
                        <div className="space-y-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset)}
                                    className="w-full text-left p-3 border-2 border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    <p className="font-semibold text-sm text-slate-800">{preset.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Filters</h3>
                            <button onClick={resetFilters} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                Reset All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Price Range */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Price Range (₹)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={filters.priceMin}
                                        onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.priceMax}
                                        onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Market Cap */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Market Cap (₹ Cr)</label>
                                <input
                                    type="number"
                                    value={filters.marketCapMin}
                                    onChange={(e) => setFilters({ ...filters, marketCapMin: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    placeholder="Minimum"
                                />
                            </div>

                            {/* P/E Ratio */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">P/E Ratio</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={filters.peMin}
                                        onChange={(e) => setFilters({ ...filters, peMin: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.peMax}
                                        onChange={(e) => setFilters({ ...filters, peMax: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Volume */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Min Volume</label>
                                <input
                                    type="number"
                                    value={filters.volumeMin}
                                    onChange={(e) => setFilters({ ...filters, volumeMin: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    placeholder="Minimum"
                                />
                            </div>

                            {/* Change % */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Change %</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={filters.changePercentMin}
                                        onChange={(e) => setFilters({ ...filters, changePercentMin: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.changePercentMax}
                                        onChange={(e) => setFilters({ ...filters, changePercentMax: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* RSI */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">RSI (14)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={filters.rsiMin}
                                        onChange={(e) => setFilters({ ...filters, rsiMin: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.rsiMax}
                                        onChange={(e) => setFilters({ ...filters, rsiMax: Number(e.target.value) })}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* Sector */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-2">Sector</label>
                                <select
                                    value={filters.sector}
                                    onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                >
                                    <option>All</option>
                                    <option>Banking</option>
                                    <option>IT</option>
                                    <option>Energy</option>
                                    <option>FMCG</option>
                                    <option>Auto</option>
                                    <option>Telecom</option>
                                    <option>Metals</option>
                                    <option>Consumer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search & Actions */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by symbol or name..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={exportResults}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-3">
                            Found <span className="font-bold text-indigo-600">{filteredStocks.length}</span> stocks matching your criteria
                        </p>
                    </div>

                    {/* Results Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-3 font-semibold text-slate-700">Symbol</th>
                                        <th className="text-left p-3 font-semibold text-slate-700">Name</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">Price</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">Change %</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">Volume</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">Mkt Cap</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">P/E</th>
                                        <th className="text-right p-3 font-semibold text-slate-700">RSI</th>
                                        <th className="text-left p-3 font-semibold text-slate-700">Sector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStocks.map((stock) => (
                                        <tr key={stock.symbol} className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                                            <td className="p-3 font-bold text-indigo-600">{stock.symbol}</td>
                                            <td className="p-3 text-slate-700">{stock.name}</td>
                                            <td className="p-3 text-right font-medium text-slate-900">₹{stock.price.toLocaleString()}</td>
                                            <td className={`p-3 text-right font-bold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                <div className="flex items-center justify-end gap-1">
                                                    {stock.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="p-3 text-right text-slate-600">{(stock.volume / 1000000).toFixed(2)}M</td>
                                            <td className="p-3 text-right text-slate-600">₹{(stock.marketCap / 1000).toFixed(0)}K Cr</td>
                                            <td className="p-3 text-right text-slate-600">{stock.pe.toFixed(1)}</td>
                                            <td className="p-3 text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock.rsi > 70 ? 'bg-red-100 text-red-700' :
                                                    stock.rsi < 30 ? 'bg-green-100 text-green-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {stock.rsi}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-600">{stock.sector}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredStocks.length === 0 && (
                            <div className="text-center py-12">
                                <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400">No stocks match your filter criteria</p>
                                <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567900" className="mt-6" />
        </div>
    );
}
