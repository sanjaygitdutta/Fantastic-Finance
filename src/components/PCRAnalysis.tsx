import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const PCR_DATA = [
    { time: '09:15', pcr: 0.85, nifty: 19500 },
    { time: '10:00', pcr: 0.92, nifty: 19550 },
    { time: '10:45', pcr: 1.10, nifty: 19620 },
    { time: '11:30', pcr: 1.05, nifty: 19600 },
    { time: '12:15', pcr: 0.98, nifty: 19580 },
    { time: '13:00', pcr: 0.95, nifty: 19560 },
    { time: '13:45', pcr: 0.88, nifty: 19520 },
    { time: '14:30', pcr: 0.75, nifty: 19480 },
    { time: '15:15', pcr: 0.70, nifty: 19450 },
];

export default function PCRAnalysis() {
    const currentPCR = PCR_DATA[PCR_DATA.length - 1].pcr;
    const pcrSignal = currentPCR > 1.2 ? 'Bullish' : currentPCR < 0.8 ? 'Bearish' : 'Neutral';
    const signalColor = currentPCR > 1.2 ? 'text-green-600' : currentPCR < 0.8 ? 'text-red-600' : 'text-yellow-600';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PCR Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Current PCR</p>
                            <h2 className={`text-3xl font-bold ${signalColor}`}>{currentPCR.toFixed(2)}</h2>
                        </div>
                        <div className={`p-2 rounded-lg ${currentPCR > 1 ? 'bg-green-50' : 'bg-red-50'}`}>
                            {currentPCR > 1 ? <TrendingUp className="w-6 h-6 text-green-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className={`font-bold ${signalColor}`}>{pcrSignal}</span>
                        <span className="text-slate-400">Market Sentiment</span>
                    </div>
                </div>

                {/* Interpretation Guide */}
                <div className="md:col-span-2 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">PCR Interpretation Guide</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-bold text-green-700 block mb-1">Bullish (&gt; 1.2)</span>
                                <p className="text-blue-800/80">Put writing is higher. Support is building up.</p>
                            </div>
                            <div>
                                <span className="font-bold text-red-700 block mb-1">Bearish (&lt; 0.8)</span>
                                <p className="text-blue-800/80">Call writing is higher. Resistance is strong.</p>
                            </div>
                            <div>
                                <span className="font-bold text-yellow-700 block mb-1">Neutral (0.8 - 1.2)</span>
                                <p className="text-blue-800/80">Market is indecisive or range-bound.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">PCR vs Nifty Trend</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PCR_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" />
                            <YAxis yAxisId="left" domain={[0.5, 1.5]} />
                            <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="pcr" stroke="#2563eb" strokeWidth={2} name="Put Call Ratio" dot={{ r: 4 }} />
                            <Line yAxisId="right" type="monotone" dataKey="nifty" stroke="#94a3b8" strokeWidth={2} name="Nifty 50" dot={false} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
