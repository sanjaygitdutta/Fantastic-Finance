import { UserPlus, Search, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: Search,
            number: '1',
            title: 'Analyze with AI',
            description: 'Identify high-probability setups using our AI signals and real-time market scanners.',
            color: 'blue'
        },
        {
            icon: UserPlus,
            number: '2',
            title: 'Build Strategy',
            description: 'Construct and test multi-leg strategies with our visual builder and paper trading.',
            color: 'purple'
        },
        {
            icon: TrendingUp,
            number: '3',
            title: 'Execute & Monitor',
            description: 'Deploy your trades with confidence and track performance with advanced analytics.',
            color: 'green'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                gradient: 'from-blue-500 to-blue-600',
                line: 'bg-blue-200'
            },
            purple: {
                gradient: 'from-purple-500 to-purple-600',
                line: 'bg-purple-200'
            },
            green: {
                gradient: 'from-green-500 to-green-600',
                line: 'bg-green-200'
            }
        };
        return colors[color as keyof typeof colors];
    };

    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Get Started in{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            3 Simple Steps
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Begin your options trading journey today with our intuitive platform
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Lines for Desktop */}
                    <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1">
                        <div className="absolute left-1/6 right-1/6 h-full bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const colorClasses = getColorClasses(step.color);

                            return (
                                <div
                                    key={index}
                                    className="relative text-center group"
                                >
                                    {/* Step Number Circle */}
                                    <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                                        <span className="text-3xl font-bold text-white">{step.number}</span>
                                    </div>

                                    {/* Icon Circle */}
                                    <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center mx-auto mb-4 opacity-20 group-hover:opacity-30 transition-opacity`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
