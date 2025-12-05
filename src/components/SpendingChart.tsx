import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Housing', value: 35000, color: '#2563eb' },
    { name: 'Food', value: 15000, color: '#7c3aed' },
    { name: 'Transport', value: 8000, color: '#db2777' },
    { name: 'Utilities', value: 5000, color: '#ea580c' },
    { name: 'Entertainment', value: 4000, color: '#16a34a' },
];

export default function SpendingChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
