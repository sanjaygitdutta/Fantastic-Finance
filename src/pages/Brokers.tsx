import { Helmet } from 'react-helmet-async';
import BrokerCard from '../components/BrokerCard';
import { TrendingUp, Shield, Users } from 'lucide-react';

export default function Brokers() {
    const brokers = [
        {
            name: 'Upstox',
            logo: '📈',
            rating: 4.5,
            commission: '₹20/order',
            minDeposit: '₹0',
            features: [
                'Free account opening',
                'Advanced charting tools',
                'Paper trading available',
                'Low brokerage fees'
            ],
            affiliateUrl: 'https://upstox.onelink.me/0H1s/4RCEPU',
            color: 'from-orange-500 to-orange-600'
        },
        }
    ];

return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <Helmet>
            <title>Best Stock Brokers in India 2024 - Compare & Open Account | Fantastic Financial</title>
            <meta name="description" content="Compare top stock brokers in India. Open free demat account with Upstox, Zerodha, Angel One, Groww. Low brokerage, instant account opening." />
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Trusted by 15,000+ Traders</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                    Best Stock Brokers in India
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Compare top brokers and open your free demat account today.
                    Start trading in stocks, F&O, commodities & more.
                </p>
            </div>

            {/* Why Open Account */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold mb-2 text-slate-900 dark:text-white">100% Secure</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        SEBI registered brokers with robust security measures
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Low Brokerage</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        ₹20 per order flat - save thousands on trading fees
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Trusted Platform</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Join millions of traders using these platforms daily
                    </p>
                </div>
            </div>

            {/* Broker Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                {brokers.map((broker) => (
                    <BrokerCard key={broker.name} {...broker} />
                ))}
            </div>

            {/* Disclosure Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Affiliate Disclosure
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                    We may earn a commission when you open an account through our affiliate links.
                    This helps us keep Fantastic Financial completely free for all users. Our broker
                    recommendations are based on genuine research and user feedback. We only partner
                    with SEBI-registered brokers with proven track records.
                </p>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                        <h3 className="font-bold mb-2 text-slate-900 dark:text-white">
                            Is it free to open a demat account?
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Yes! All brokers listed here offer free account opening with zero account opening charges.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                        <h3 className="font-bold mb-2 text-slate-900 dark:text-white">
                            How long does account opening take?
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Most brokers offer instant account opening. You can start trading within 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}
