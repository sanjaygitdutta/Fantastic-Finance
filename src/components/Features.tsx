import { BarChart3, Calculator, Zap, GraduationCap, Users, Activity } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: Calculator,
            title: 'Black-Scholes Analytics',
            description: 'Determine the theoretical value of options using the industry-standard Black-Scholes model. Access real-time IV and Greeks calculation with professional precision.',
            badge: 'Institutional Grade',
            color: 'blue'
        },
        {
            icon: Activity,
            title: 'Greeks & IV Surface',
            description: 'Go beyond simple charts. Visualize Delta, Gamma, and Theta decay. Analyze the IV surface to find mispriced options and edge in the market.',
            badge: 'Pro Analysis',
            color: 'purple'
        },
        {
            icon: Zap,
            title: 'Margin & Risk Forecast',
            description: 'Know your capital requirements exactly. Use our advanced margin calculator to forecast requirements for multi-leg option strategies before you trade.',
            badge: 'Risk Control',
            color: 'pink'
        },
        {
            icon: BarChart3,
            title: 'Visual Strategy Builder',
            description: 'Design and visualize multi-leg strategies like Iron Condors and Butterfly Spreads with real-time P/L payoff charts and probability of profit.',
            badge: '15+ Templates',
            color: 'green'
        },
        {
            icon: GraduationCap,
            title: 'Option Greek Academy',
            description: 'Master the "language of options". From volatility smiles to time decay management, learn how professionals manage institutional portfolios.',
            badge: 'Advanced Learning',
            color: 'orange'
        },
        {
            icon: Users,
            title: 'Elite Alpha Community',
            description: 'Connect with a network of high-net-worth traders. Share logic-based trade setups, backtest results, and collaborative market research.',
            badge: 'Expert Network',
            color: 'indigo'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                icon: 'from-blue-500 to-blue-600',
                badge: 'text-blue-600 bg-blue-50',
                border: 'hover:border-blue-300'
            },
            purple: {
                icon: 'from-purple-500 to-purple-600',
                badge: 'text-purple-600 bg-purple-50',
                border: 'hover:border-purple-300'
            },
            pink: {
                icon: 'from-pink-500 to-pink-600',
                badge: 'text-pink-600 bg-pink-50',
                border: 'hover:border-pink-300'
            },
            green: {
                icon: 'from-green-500 to-green-600',
                badge: 'text-green-600 bg-green-50',
                border: 'hover:border-green-300'
            },
            orange: {
                icon: 'from-orange-500 to-orange-600',
                badge: 'text-orange-600 bg-orange-50',
                border: 'hover:border-orange-300'
            },
            indigo: {
                icon: 'from-indigo-500 to-indigo-600',
                badge: 'text-indigo-600 bg-indigo-50',
                border: 'hover:border-indigo-300'
            }
        };
        return colors[color as keyof typeof colors];
    };

    return (
        <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Everything You Need to Trade
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Options</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Professional-grade tools and analytics designed for serious traders. From strategy building to risk management, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const colorClasses = getColorClasses(feature.color);

                        return (
                            <div
                                key={index}
                                className={`group p-8 rounded-2xl border border-slate-200 ${colorClasses.border} hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-2`}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses.icon} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-600 leading-relaxed mb-4">
                                    {feature.description}
                                </p>

                                <div className={`inline-flex items-center text-sm font-semibold ${colorClasses.badge} px-3 py-1.5 rounded-full`}>
                                    {feature.badge}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
