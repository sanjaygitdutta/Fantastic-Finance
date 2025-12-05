import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data Generator
const generateChartData = () => {
    const data = [];
    let price = 150 + Math.random() * 50;
    for (let i = 0; i < 30; i++) {
        price = price + (Math.random() * 10 - 5);
        data.push({
            date: `Day ${i + 1}`,
            price: price,
        });
    }
    return data;
};

const MOCK_DETAILS: Record<string, any> = {
    'RELIANCE': { name: 'Reliance Industries', price: 2980.50, change: 2.5, sector: 'Energy', marketCap: '20.1T', pe: 28.5, about: "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles." },
    'TATASTEEL': { name: 'Tata Steel', price: 156.80, change: 1.8, sector: 'Metals', marketCap: '1.9T', pe: 12.4, about: "Tata Steel Limited is an Indian multinational steel-making company, based in Jamshedpur, Jharkhand and headquartered in Mumbai, Maharashtra. It is a part of the Tata Group." },
    'INFY': { name: 'Infosys', price: 1650.20, change: -1.2, sector: 'Technology', marketCap: '6.8T', pe: 24.1, about: "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services." },
    'HDFCBANK': { name: 'HDFC Bank', price: 1450.00, change: -0.8, sector: 'Financials', marketCap: '11.5T', pe: 18.9, about: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India's largest private sector bank by assets and world's 10th largest bank by market capitalization." },
};

export default function StockDetails() {
    const { symbol } = useParams<{ symbol: string }>();
    const stock = MOCK_DETAILS[symbol?.toUpperCase() || ''] || { name: symbol, price: 0, change: 0, sector: 'Unknown', marketCap: '-', pe: '-', about: 'Data not available.' };
    const chartData = generateChartData();

    const isPositive = stock.change >= 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{stock.name} <span className="text-slate-400 text-lg font-normal">({symbol})</span></h1>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-slate-900">₹{stock.price.toLocaleString()}</span>
                        <span className={`flex items-center px-2 py-1 rounded text-sm font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {stock.change > 0 ? '+' : ''}{stock.change}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Price Performance</h3>
                        <div className="flex gap-2">
                            {['1D', '1W', '1M', '1Y', '5Y'].map(period => (
                                <button key={period} className={`px-3 py-1 text-xs font-medium rounded-md ${period === '1M' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" hide />
                                <YAxis domain={['auto', 'auto']} hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                    formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fundamentals & About */}
                <div className="space-y-6">
                    {/* Fundamentals Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" /> Fundamentals
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Market Cap</p>
                                <p className="font-bold text-slate-900">{stock.marketCap}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">P/E Ratio</p>
                                <p className="font-bold text-slate-900">{stock.pe}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Sector</p>
                                <p className="font-bold text-slate-900">{stock.sector}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Div Yield</p>
                                <p className="font-bold text-slate-900">1.2%</p>
                            </div>
                        </div>
                    </div>

                    {/* About Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">About {stock.name}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {stock.about}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-200">
                            BUY
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-200">
                            SELL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
