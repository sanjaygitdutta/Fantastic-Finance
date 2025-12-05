import { ExternalLink, Zap, Award } from 'lucide-react';

interface BrokerCardProps {
    name: string;
    logo: string;
    rating: number;
    commission: string;
    minDeposit: string;
    features: string[];
    affiliateUrl: string;
    color: string;
}

export default function BrokerCard({
    name,
    logo,
    rating,
    commission,
    minDeposit,
    features,
    affiliateUrl,
    color
}: BrokerCardProps) {

    const handleClick = () => {
        // Track affiliate click
        const clickData = {
            broker: name,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        localStorage.setItem(`affiliate_click_${Date.now()}`, JSON.stringify(clickData));

        // Open affiliate link
        window.open(affiliateUrl, '_blank');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className={`bg-gradient-to-r ${color} p-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">{logo}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{name}</h3>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Award
                                        key={i}
                                        className={`w-3 h-3 ${i < rating ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'
                                            }`}
                                    />
                                ))}
                                <span className="text-white/90 text-xs ml-1">({rating}/5)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Brokerage</p>
                        <p className="font-bold text-green-600 dark:text-green-400">{commission}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Min. Deposit</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{minDeposit}</p>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                            <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleClick}
                    className={`w-full bg-gradient-to-r ${color} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group`}
                >
                    Open Free Account
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Disclosure */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                    💡 We may earn a commission • Helps keep this platform free
                </p>
            </div>
        </div>
    );
}
