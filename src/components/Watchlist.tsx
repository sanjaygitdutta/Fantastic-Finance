import { Star, TrendingUp, TrendingDown, Plus, Search, Filter, X, Trash2 } from 'lucide-react';
import AdSlot from './AdSlot';
import { useState } from 'react';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState<Stock[]>([
        { symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 21453.95, change: 125.40, changePercent: 0.59 },
        { symbol: 'BANKNIFTY', name: 'Bank Nifty Index', price: 45678.30, change: -234.50, changePercent: -0.51 },
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2456.75, change: 45.20, changePercent: 1.87 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3542.10, change: -12.35, changePercent: -0.35 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1654.80, change: 23.45, changePercent: 1.44 },
        { symbol: 'INFY', name: 'Infosys Ltd', price: 1432.60, change: 8.90, changePercent: 0.62 },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSymbol, setNewSymbol] = useState({
        symbol: '',
        name: '',
        price: '',
    });

    const handleAddSymbol = () => {
        if (!newSymbol.symbol || !newSymbol.name || !newSymbol.price) {
            alert('Please fill all fields');
            return;
        }

        const price = parseFloat(newSymbol.price);
        if (isNaN(price)) {
            alert('Please enter a valid price');
            return;
        }

        // Check if symbol already exists
        if (watchlist.some(stock => stock.symbol.toUpperCase() === newSymbol.symbol.toUpperCase())) {
            alert('Symbol already in watchlist');
            return;
        }

        const newStock: Stock = {
            symbol: newSymbol.symbol.toUpperCase(),
            name: newSymbol.name,
            price: price,
            change: 0,
            changePercent: 0,
        };

        setWatchlist([...watchlist, newStock]);
        setNewSymbol({ symbol: '', name: '', price: '' });
        setShowAddModal(false);
    };

    const handleRemoveSymbol = (symbol: string) => {
        if (confirm(`Remove ${symbol} from watchlist ? `)) {
            setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
        }
    };

    const filteredWatchlist = watchlist.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-white fill-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Watchlist</h1>
                                <p className="text-slate-500 dark:text-slate-400">Track your favorite stocks and indices</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Add Symbol
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search symbols..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Watchlist Table */}
                {filteredWatchlist.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Symbol</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Name</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Price</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Change</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Change %</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredWatchlist.map((stock) => (
                                    <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-semibold text-slate-900 dark:text-white">{stock.symbol}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{stock.name}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">₹{stock.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`flex items - center justify - end gap - 1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} `}>
                                                {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                <span className="font-semibold">{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font - semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'} `}>
                                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleRemoveSymbol(stock.symbol)}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm inline-flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <Star className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {searchQuery ? 'No symbols found' : 'Your watchlist is empty'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Start adding stocks and indices to track'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Add Your First Symbol
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Symbol Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Symbol to Watchlist</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Symbol *
                                </label>
                                <input
                                    type="text"
                                    value={newSymbol.symbol}
                                    onChange={(e) => setNewSymbol({ ...newSymbol, symbol: e.target.value })}
                                    placeholder="e.g., TATAMOTORS"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={newSymbol.name}
                                    onChange={(e) => setNewSymbol({ ...newSymbol, name: e.target.value })}
                                    placeholder="e.g., Tata Motors Ltd"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Current Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newSymbol.price}
                                    onChange={(e) => setNewSymbol({ ...newSymbol, price: e.target.value })}
                                    placeholder="e.g., 850.50"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSymbol}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Add Symbol
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AdSense Display Ad */}
            <AdSlot slot="watchlist-summary" format="horizontal" className="mt-6" />
            {/* AdSense Display Ad */}
            <AdSlot slot="watchlist-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
