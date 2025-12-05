import { useState } from 'react';

const MOCK_OPTION_CHAIN = [22150, 22200, 22250, 22300, 22350, 22400, 22450, 22500, 22550].map(strike => {
    return {
        strike,
        call: {
            oi: Math.floor(Math.random() * 100000),
            chgOi: Math.floor(Math.random() * 20000) - 5000,
            vol: Math.floor(Math.random() * 500000),
            iv: 12 + Math.random() * 5,
            ltp: Math.max(0, (22350 - strike) + Math.random() * 50),
            chg: Math.random() * 20 - 10,
        },
        put: {
            oi: Math.floor(Math.random() * 100000),
            chgOi: Math.floor(Math.random() * 20000) - 5000,
            vol: Math.floor(Math.random() * 500000),
            iv: 12 + Math.random() * 5,
            ltp: Math.max(0, (strike - 22350) + Math.random() * 50),
            chg: Math.random() * 20 - 10,
        }
    };
});

export default function OptionChain() {
    const [spotPrice, setSpotPrice] = useState(22356.40);
    const [atmStrike, setAtmStrike] = useState(22350);
    const [strikeRange, setStrikeRange] = useState(500);
    const [customStrike, setCustomStrike] = useState('');

    const maxOI = Math.max(...MOCK_OPTION_CHAIN.flatMap(d => [d.call.oi, d.put.oi]));

    // Filter strikes based on range or custom input
    const getFilteredStrikes = () => {
        if (customStrike) {
            const targetStrike = Number(customStrike);
            // Show strikes around custom input
            return MOCK_OPTION_CHAIN.filter(row =>
                Math.abs(row.strike - targetStrike) <= strikeRange * 50
            );
        }
        // Show strikes around ATM
        return MOCK_OPTION_CHAIN.filter(row =>
            Math.abs(row.strike - atmStrike) <= strikeRange * 50
        );
    };

    const filteredStrikes = getFilteredStrikes();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <h2 className="font-bold text-slate-800 dark:text-white">NIFTY Option Chain (28 Mar Exp)</h2>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Spot: <span className="font-bold text-slate-900 dark:text-white">{spotPrice.toLocaleString()}</span> <span className="text-green-600">(+0.45%)</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Manual Spot Price */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Spot Price (Manual)
                        </label>
                        <input
                            type="number"
                            value={spotPrice || ''}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 || e.target.value === '') {
                                    setSpotPrice(val);
                                }
                            }}
                            placeholder="e.g., 22350"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.5"
                            min="0.01"
                        />
                    </div>

                    {/* ATM Strike */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            ATM Strike
                        </label>
                        <input
                            type="number"
                            value={atmStrike || ''}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 || e.target.value === '') {
                                    setAtmStrike(val);
                                    setCustomStrike(''); // Clear custom strike
                                }
                            }}
                            placeholder="e.g., 22350"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="50"
                            min="1"
                        />
                    </div>

                    {/* Strike Range */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            ATM ± Range
                        </label>
                        <select
                            value={strikeRange}
                            onChange={(e) => setStrikeRange(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="100">± ₹100</option>
                            <option value="200">± ₹200</option>
                            <option value="300">± ₹300</option>
                            <option value="400">± ₹400</option>
                            <option value="500">± ₹500</option>
                        </select>
                    </div>

                    {/* Custom Strike Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Custom Strike (Optional)
                        </label>
                        <input
                            type="number"
                            value={customStrike}
                            onChange={(e) => setCustomStrike(e.target.value)}
                            placeholder="e.g., 22400"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="50"
                        />
                    </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    💡 Adjust spot price, ATM strike, or enter custom strike to filter option chain
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                        <tr>
                            <th colSpan={5} className="py-2 border-b border-r border-slate-200 dark:border-slate-600 text-green-700 dark:text-green-400">CALLS</th>
                            <th className="py-2 border-b border-slate-200 dark:border-slate-600 bg-slate-200 dark:bg-slate-600">STRIKE</th>
                            <th colSpan={5} className="py-2 border-b border-l border-slate-200 dark:border-slate-600 text-red-700 dark:text-red-400">PUTS</th>
                        </tr>
                        <tr className="text-[10px] uppercase tracking-wider">
                            <th className="py-2 px-1 border-r border-slate-200 dark:border-slate-600">OI</th>
                            <th className="py-2 px-1 border-r border-slate-200 dark:border-slate-600">Chg OI</th>
                            <th className="py-2 px-1 border-r border-slate-200 dark:border-slate-600">Vol</th>
                            <th className="py-2 px-1 border-r border-slate-200 dark:border-slate-600">IV</th>
                            <th className="py-2 px-1 border-r border-slate-200 dark:border-slate-600">LTP</th>

                            <th className="py-2 px-2 bg-slate-200 dark:bg-slate-600">Price</th>

                            <th className="py-2 px-1 border-l border-slate-200 dark:border-slate-600">LTP</th>
                            <th className="py-2 px-1 border-l border-slate-200 dark:border-slate-600">IV</th>
                            <th className="py-2 px-1 border-l border-slate-200 dark:border-slate-600">Vol</th>
                            <th className="py-2 px-1 border-l border-slate-200 dark:border-slate-600">Chg OI</th>
                            <th className="py-2 px-1">OI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredStrikes.map((row) => {
                            const targetStrike = customStrike ? Number(customStrike) : atmStrike;
                            const isAtm = row.strike === targetStrike;
                            const callBg = row.strike < targetStrike ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-slate-800';
                            const putBg = row.strike > targetStrike ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-slate-800';

                            return (
                                <tr key={row.strike} className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${isAtm ? 'bg-blue-50 dark:bg-blue-900/30 font-medium' : ''}`}>
                                    {/* CALLS */}
                                    <td className={`py-1.5 px-1 border-r border-slate-100 dark:border-slate-700 relative ${callBg}`}>
                                        <div className="absolute inset-y-1 left-0 bg-green-100 dark:bg-green-900/30 opacity-50" style={{ width: `${(row.call.oi / maxOI) * 100}%` }}></div>
                                        <span className="relative z-10">{row.call.oi.toLocaleString()}</span>
                                    </td>
                                    <td className={`py-1.5 px-1 border-r border-slate-100 dark:border-slate-700 ${callBg} ${row.call.chgOi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {row.call.chgOi.toLocaleString()}
                                    </td>
                                    <td className={`py-1.5 px-1 border-r border-slate-100 dark:border-slate-700 ${callBg}`}>{row.call.vol.toLocaleString()}</td>
                                    <td className={`py-1.5 px-1 border-r border-slate-100 dark:border-slate-700 ${callBg}`}>{row.call.iv.toFixed(1)}</td>
                                    <td className={`py-1.5 px-1 border-r border-slate-100 dark:border-slate-700 ${callBg} font-medium`}>
                                        {row.call.ltp.toFixed(2)}
                                    </td>

                                    {/* STRIKE */}
                                    <td className="py-1.5 px-2 bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 border-x border-slate-200 dark:border-slate-600">
                                        {row.strike}
                                    </td>

                                    {/* PUTS */}
                                    <td className={`py-1.5 px-1 border-l border-slate-100 dark:border-slate-700 ${putBg} font-medium`}>
                                        {row.put.ltp.toFixed(2)}
                                    </td>
                                    <td className={`py-1.5 px-1 border-l border-slate-100 dark:border-slate-700 ${putBg}`}>{row.put.iv.toFixed(1)}</td>
                                    <td className={`py-1.5 px-1 border-l border-slate-100 dark:border-slate-700 ${putBg}`}>{row.put.vol.toLocaleString()}</td>
                                    <td className={`py-1.5 px-1 border-l border-slate-100 dark:border-slate-700 ${putBg} ${row.put.chgOi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {row.put.chgOi.toLocaleString()}
                                    </td>
                                    <td className={`py-1.5 px-1 relative ${putBg}`}>
                                        <div className="absolute inset-y-1 right-0 bg-red-100 dark:bg-red-900/30 opacity-50" style={{ width: `${(row.put.oi / maxOI) * 100}%` }}></div>
                                        <span className="relative z-10">{row.put.oi.toLocaleString()}</span>
                                    </td>
                                </tr>
                            );
                        })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
