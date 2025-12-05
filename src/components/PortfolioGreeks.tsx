import { TrendingUp, TrendingDown, Activity, Clock, Zap } from 'lucide-react';

interface PortfolioGreeksProps {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
}

export default function PortfolioGreeks({ delta, gamma, theta, vega }: PortfolioGreeksProps) {
    const getGreekColor = (value: number, greek: string) => {
        if (greek === 'delta') {
            if (value > 0) return 'text-green-600';
            if (value < 0) return 'text-red-600';
            return 'text-slate-600';
        }
        if (greek === 'theta') {
            // Negative theta is normal for long positions
            return value < 0 ? 'text-orange-600' : 'text-green-600';
        }
        return 'text-blue-600';
    };

    const greeks = [
        {
            name: 'Delta',
            value: delta,
            icon: TrendingUp,
            description: 'Directional exposure',
            tooltip: 'Net change in portfolio value for ₹1 move in underlying',
            format: (v: number) => v.toFixed(2)
        },
        {
            name: 'Gamma',
            value: gamma,
            icon: Activity,
            description: 'Delta sensitivity',
            tooltip: 'Rate of change of delta',
            format: (v: number) => v.toFixed(3)
        },
        {
            name: 'Theta',
            value: theta,
            icon: Clock,
            description: 'Time decay',
            tooltip: 'Portfolio value change per day from time decay',
            format: (v: number) => (v > 0 ? '+' : '') + v.toFixed(2)
        },
        {
            name: 'Vega',
            value: vega,
            icon: Zap,
            description: 'IV sensitivity',
            tooltip: 'Portfolio value change for 1% change in IV',
            format: (v: number) => v.toFixed(2)
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Portfolio Greeks
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {greeks.map((greek) => (
                    <div
                        key={greek.name}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                        title={greek.tooltip}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <greek.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {greek.name}
                            </span>
                        </div>
                        <div className={`text-xl font-bold ${getGreekColor(greek.value, greek.name.toLowerCase())}`}>
                            {greek.format(greek.value)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {greek.description}
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary insight */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Insight:</strong> {
                        Math.abs(delta) > 20
                            ? `Strong ${delta > 0 ? 'bullish' : 'bearish'} bias. Portfolio will move significantly with market.`
                            : Math.abs(delta) < 5
                                ? 'Neutral positioning. Portfolio is well-hedged.'
                                : `Moderate ${delta > 0 ? 'bullish' : 'bearish'} tilt.`
                    }
                </p>
            </div>
        </div>
    );
}
