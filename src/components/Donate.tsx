import { Heart, Coffee, Gift } from 'lucide-react';
import { useState } from 'react';

export default function Donate() {
    const [selectedAmount, setSelectedAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState('');
    const upiId = '9531775665@ybl';

    const handleUPIPayment = () => {
        const amount = customAmount || selectedAmount;
        const upiUrl = `upi://pay?pa=${upiId}&pn=Fantastic Finance&am=${amount}&cu=INR&tn=Donation to Fantastic Finance`;

        // Try to open UPI app
        window.location.href = upiUrl;

        // Fallback: Show alert with UPI ID for manual payment
        setTimeout(() => {
            alert(`If UPI app didn't open, please pay manually to: ${upiId}\nAmount: ₹${amount}`);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-12">
                <div className="max-w-4xl mx-auto text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-4xl font-bold mb-4">Support Our Mission</h1>
                    <p className="text-xl text-pink-100">
                        Help us keep this platform free and accessible for everyone
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Donate?</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        Your generous donations help us maintain and improve this free financial platform. We're committed to providing
                        high-quality tools, real-time data, and educational resources to traders and investors without any subscription fees.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <button
                            onClick={() => setSelectedAmount(100)}
                            className={`text-center p-6 rounded-xl transition ${selectedAmount === 100
                                ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500'
                                : 'bg-blue-50 dark:bg-blue-900/20'
                                }`}
                        >
                            <Coffee className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">☕ Buy us a coffee</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Small contribution</p>
                            <p className="text-2xl font-bold text-blue-600">₹100</p>
                        </button>

                        <button
                            onClick={() => setSelectedAmount(500)}
                            className={`text-center p-6 rounded-xl transition ${selectedAmount === 500
                                ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500'
                                : 'bg-purple-50 dark:bg-purple-900/20'
                                }`}
                        >
                            <Heart className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">💜 Supporter</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Most popular</p>
                            <p className="text-2xl font-bold text-purple-600">₹500</p>
                        </button>

                        <button
                            onClick={() => setSelectedAmount(1000)}
                            className={`text-center p-6 rounded-xl transition ${selectedAmount === 1000
                                ? 'bg-amber-100 dark:bg-amber-900/40 ring-2 ring-amber-500'
                                : 'bg-amber-50 dark:bg-amber-900/20'
                                }`}
                        >
                            <Gift className="w-12 h-12 mx-auto text-amber-600 mb-3" />
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🎁 Generous patron</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Premium support</p>
                            <p className="text-2xl font-bold text-amber-600">₹1000+</p>
                        </button>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Or enter a custom amount:
                        </label>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Payment Method</h2>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            UPI
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">UPI Payment</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{upiId}</p>
                        </div>
                        <button
                            onClick={handleUPIPayment}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Pay Now
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                        Help Us Bring Real-Time Market Data 📊
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                        Real-time market data APIs are expensive! Your donations help us cover API subscription costs,
                        maintain live data feeds from NSE/BSE, and keep the platform running 24/7 with accurate,
                        up-to-the-second market information. Every contribution, no matter how small, brings us closer
                        to providing you with professional-grade real-time data completely free. Thank you for supporting our mission! 🙏
                    </p>
                </div>
            </div>
        </div>
    );
}
