import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, BarChart3, Shield, DollarSign } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface BondData {
    name: string;
    issuer: string;
    couponRate: number;
    maturityDate: string;
    price: number;
    yield: number;
    rating: string;
    faceValue: number;
    type: string;
}

export default function Bond() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('All');

    const bonds: BondData[] = [
        { name: '7.17% GS 2028', issuer: 'Government of India', couponRate: 7.17, maturityDate: '08-Jan-2028', price: 102.45, yield: 6.85, rating: 'AAA', faceValue: 1000, type: 'Government' },
        { name: '6.79% GS 2034', issuer: 'Government of India', couponRate: 6.79, maturityDate: '15-May-2034', price: 98.20, yield: 7.02, rating: 'AAA', faceValue: 1000, type: 'Government' },
        { name: 'HDFC Ltd Bond 2026', issuer: 'HDFC Bank', couponRate: 8.25, maturityDate: '20-Dec-2026', price: 103.80, yield: 7.45, rating: 'AAA', faceValue: 1000, type: 'Corporate' },
        { name: 'Reliance Industries 2029', issuer: 'Reliance Industries', couponRate: 7.95, maturityDate: '10-Mar-2029', price: 101.25, yield: 7.65, rating: 'AAA', faceValue: 1000, type: 'Corporate' },
        { name: 'SBI Bond 2027', issuer: 'State Bank of India', couponRate: 7.50, maturityDate: '25-Jun-2027', price: 100.50, yield: 7.38, rating: 'AAA', faceValue: 1000, type: 'Corporate' },
        { name: 'Tata Steel Bond 2026', issuer: 'Tata Steel', couponRate: 8.45, maturityDate: '15-Sep-2026', price: 99.85, yield: 8.50, rating: 'AA+', faceValue: 1000, type: 'Corporate' },
    ];

    const types = ['All', 'Government', 'Corporate', 'Municipal'];

    const filteredBonds = bonds.filter(bond => {
        const matchesSearch = bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bond.issuer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || bond.type === filterType;
        return matchesSearch && matchesType;
    });

    const getRatingColor = (rating: string) => {
        if (rating === 'AAA') return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
        if (rating.startsWith('AA')) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bond Market</h1>
                        <p className="text-slate-500 dark:text-slate-400">Fixed income securities & debt instruments</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search bonds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {types.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filterType === type
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bond Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Bond Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Issuer</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Coupon Rate</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Maturity</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Price</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Yield</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredBonds.map((bond, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{bond.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{bond.issuer}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">{bond.couponRate.toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{bond.maturityDate}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">₹{bond.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">{bond.yield.toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(bond.rating)}`}>
                                            {bond.rating}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">About Bonds</h4>
                        <p className="text-sm text-green-800 dark:text-green-400">
                            Bonds are fixed-income securities representing loans made by investors to borrowers (typically corporate or governmental).
                            They provide regular interest payments (coupons) and return the principal at maturity.
                        </p>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567911" className="mt-6" />
        </div>
    );
}
