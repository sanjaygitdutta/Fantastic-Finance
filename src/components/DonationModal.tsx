import { useState } from 'react';
import { X, Heart, Copy, Check, Star, Crown, Gem } from 'lucide-react';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
    const [selectedTier, setSelectedTier] = useState<string>('coffee');
    const [copiedUPI, setCopiedUPI] = useState(false);

    // Your UPI ID (can be configured in admin dashboard later)
    const UPI_ID = "9531775665@ybl"; // Replace with your actual UPI ID

    const tiers = [
        {
            id: 'coffee',
            name: 'Buy Me a Coffee',
            amount: '₹50',
            icon: Heart,
            color: 'blue',
            badge: null,
            benefits: ['Thank you message', 'Good karma ✨']
        },
        {
            id: 'supporter',
            name: 'Supporter',
            amount: '₹100',
            icon: Star,
            color: 'purple',
            badge: '🌟 Supporter Badge',
            benefits: ['Supporter badge in Community', 'Priority feature requests']
        },
        {
            id: 'patron',
            name: 'Patron',
            amount: '₹500',
            icon: Crown,
            color: 'yellow',
            badge: '👑 Patron Badge',
            benefits: ['Gold badge in Community', 'Priority support', 'Early beta access']
        },
        {
            id: 'generous',
            name: 'Generous Patron',
            amount: '₹2,000',
            icon: Gem,
            color: 'purple',
            badge: '💜 Generous Badge',
            benefits: ['Purple Gem badge', 'VIP support', 'Feature influence', 'Monthly shoutout']
        },
        {
            id: 'vip',
            name: 'VIP Supporter',
            amount: '₹5,000',
            icon: Gem,
            color: 'pink',
            badge: '💎 VIP Badge',
            benefits: ['Platinum badge', 'Direct support line', 'Name in credits', 'Ad-free experience']
        }
    ];

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopiedUPI(true);
        setTimeout(() => setCopiedUPI(false), 2000);
    };

    const selectedTierData = tiers.find(t => t.id === selectedTier);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-white fill-white" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Support Fantastic Financial</h2>
                                <p className="text-blue-100 text-sm">Help us keep this platform free for everyone!</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Impact Stats */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">247</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Donors</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">15,000+</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Users Served</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Free Forever</p>
                            </div>
                        </div>
                    </div>

                    {/* Tier Selection */}
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Choose Your Support Level</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {tiers.map((tier) => {
                            const Icon = tier.icon;
                            const isSelected = selectedTier === tier.id;
                            return (
                                <button
                                    key={tier.id}
                                    onClick={() => setSelectedTier(tier.id)}
                                    className={`p-4 rounded-xl border-2 transition text-left ${isSelected
                                        ? `border-${tier.color}-500 bg-${tier.color}-50 dark:bg-${tier.color}-900/20`
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon className={`w-6 h-6 text-${tier.color}-600`} />
                                        <span className="font-bold text-lg">{tier.amount}</span>
                                    </div>
                                    <p className="font-semibold text-sm mb-1">{tier.name}</p>
                                    {tier.badge && (
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{tier.badge}</p>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Tier Benefits */}
                    {selectedTierData && (
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold mb-2 text-sm text-slate-900 dark:text-white">
                                {selectedTierData.name} Benefits:
                            </h4>
                            <ul className="space-y-1">
                                {selectedTierData.benefits.map((benefit, idx) => (
                                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* UPI Payment Instructions */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4">
                        <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">
                            Pay via UPI (Google Pay, PhonePe, Paytm)
                        </h4>

                        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">UPI ID:</p>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {UPI_ID}
                                </code>
                                <button
                                    onClick={handleCopyUPI}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                                >
                                    {copiedUPI ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copiedUPI ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <p className="flex items-start gap-2">
                                <span className="font-bold text-blue-600">1.</span>
                                Open your UPI app (Google Pay, PhonePe, Paytm, etc.)
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="font-bold text-blue-600">2.</span>
                                Send <strong>{selectedTierData?.amount}</strong> to: <strong className="text-blue-600">{UPI_ID}</strong>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="font-bold text-blue-600">3.</span>
                                Add a note with your email (optional) to get benefits
                            </p>
                        </div>
                    </div>

                    {/* Why Donate */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h4 className="font-semibold mb-2 text-sm text-slate-900 dark:text-white">
                            Why Your Support Matters
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Your donation helps us maintain servers, upgrade to expensive real-time data, add new features, and keep Fantastic Financial
                            completely free for all traders. Every contribution, no matter the size, makes a difference! 🙏
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-2xl text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        100% of donations go towards platform development and maintenance
                    </p>
                </div>
            </div>
        </div>
    );
}
