import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { month: 'Jan', value: 2400000 },
    { month: 'Feb', value: 2450000 },
    { month: 'Mar', value: 2550000 },
    { month: 'Apr', value: 2500000 },
    { month: 'May', value: 2600000 },
    { month: 'Jun', value: 2750000 },
];

export default function PortfolioChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b' }}
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
