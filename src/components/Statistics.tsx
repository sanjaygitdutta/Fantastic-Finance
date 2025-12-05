import { TrendingUp, Users, Target, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Statistics() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const stats = [
        {
            icon: Users,
            value: '10,000+',
            label: 'Active Traders',
            color: 'blue'
        },
        {
            icon: TrendingUp,
            value: '₹500Cr+',
            label: 'Paper Trades Value',
            color: 'green'
        },
        {
            icon: Target,
            value: '15+',
            label: 'Trading Strategies',
            color: 'purple'
        },
        {
            icon: Zap,
            value: '99.9%',
            label: 'Platform Uptime',
            color: 'orange'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600'
        };
        return colors[color as keyof typeof colors];
    };

    return (
        <section ref={sectionRef} className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Trusted by Thousands of Traders
                    </h2>
                    <p className="text-xl text-slate-300">
                        Join a growing community of successful options traders
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClass = getColorClasses(stat.color);

                        return (
                            <div
                                key={index}
                                className="text-center group"
                                style={{
                                    animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                                }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-slate-300 text-lg font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </section>
    );
}
