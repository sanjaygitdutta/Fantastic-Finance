import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function IPOWatch() {
    const ipos = [
        {
            name: 'Ola Electric Mobility',
            status: 'Open',
            priceBand: '72 - 76',
            lotSize: 195,
            subscription: '4.5x',
            closeDate: 'Aug 6'
        },
        {
            name: 'FirstCry (Brainbees)',
            status: 'Upcoming',
            priceBand: '440 - 465',
            lotSize: 32,
            subscription: '-',
            closeDate: 'Aug 8'
        },
        {
            name: 'Unicommerce eSolutions',
            status: 'Closed',
            priceBand: '102 - 108',
            lotSize: 138,
            subscription: '168x',
            closeDate: 'Aug 5'
        }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" /> IPO Watch
                </h3>
                <button className="text-blue-600 text-xs font-medium hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                {ipos.map((ipo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-slate-800">{ipo.name}</h4>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ipo.status === 'Open' ? 'bg-green-100 text-green-700' :
                                        ipo.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {ipo.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Price: ₹{ipo.priceBand} • Lot: {ipo.lotSize}
                            </p>
                        </div>
                        <div className="text-right">
                            {ipo.subscription !== '-' && (
                                <div className="text-xs font-bold text-slate-700 mb-0.5">Sub: {ipo.subscription}</div>
                            )}
                            <div className="text-[10px] text-slate-400">Closes {ipo.closeDate}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-slate-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1">
                Apply for IPO <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    );
}
