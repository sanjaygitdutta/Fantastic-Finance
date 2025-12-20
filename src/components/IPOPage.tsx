import { TrendingUp, Calendar, DollarSign, FileText, Clock, Users, X, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';
import AdSlot from './AdSlot';

interface IPO {
    id: number;
    company: string;
    openDate: string;
    closeDate: string;
    listingDate: string;
    priceRange: string;
    lotSize: number;
    category: 'mainboard' | 'sme';
    status: 'upcoming' | 'open' | 'closed' | 'listed';
    subscription: string;
    // Additional details
    issueSize?: string;
    freshIssue?: string;
    offerForSale?: string;
    lotPrice?: string;
    gmp?: string;
    minAmount?: string;
    about?: string;
}

export default function IPOPage() {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'open' | 'closed'>('all');
    const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const ipos: IPO[] = [
        {
            id: 1,
            company: 'Tech Innovations Ltd',
            openDate: '2025-12-10',
            closeDate: '2025-12-12',
            listingDate: '2025-12-15',
            priceRange: '₹450-₹500',
            lotSize: 30,
            category: 'mainboard',
            status: 'upcoming',
            subscription: 'N/A',
            issueSize: '₹2,500 Cr',
            freshIssue: '₹1,800 Cr',
            offerForSale: '₹700 Cr',
            lotPrice: '₹13,500-₹15,000',
            gmp: '₹85',
            minAmount: '₹13,500',
            about: 'Tech Innovations Ltd is a leading technology solutions provider specializing in AI and cloud computing services for enterprises.'
        },
        {
            id: 2,
            company: 'Green Energy Corp',
            openDate: '2025-12-05',
            closeDate: '2025-12-07',
            listingDate: '2025-12-10',
            priceRange: '₹280-₹320',
            lotSize: 45,
            category: 'mainboard',
            status: 'open',
            subscription: '2.5x',
            issueSize: '₹1,200 Cr',
            freshIssue: '₹900 Cr',
            offerForSale: '₹300 Cr',
            lotPrice: '₹12,600-₹14,400',
            gmp: '₹45',
            minAmount: '₹12,600',
            about: 'Green Energy Corp focuses on renewable energy solutions including solar and wind power generation across India.'
        },
        {
            id: 3,
            company: 'Pharma Solutions India',
            openDate: '2025-11-28',
            closeDate: '2025-11-30',
            listingDate: '2025-12-03',
            priceRange: '₹650-₹720',
            lotSize: 20,
            category: 'mainboard',
            status: 'closed',
            subscription: '15.8x',
            issueSize: '₹3,800 Cr',
            freshIssue: '₹2,500 Cr',
            offerForSale: '₹1,300 Cr',
            lotPrice: '₹13,000-₹14,400',
            gmp: '₹125',
            minAmount: '₹13,000',
            about: 'Pharma Solutions India is a research-driven pharmaceutical company with a strong portfolio of generic and specialty medicines.'
        },
        {
            id: 4,
            company: 'Digital Payments Hub',
            openDate: '2025-12-15',
            closeDate: '2025-12-17',
            listingDate: '2025-12-20',
            priceRange: '₹180-₹200',
            lotSize: 60,
            category: 'sme',
            status: 'upcoming',
            subscription: 'N/A',
            issueSize: '₹180 Cr',
            freshIssue: '₹150 Cr',
            offerForSale: '₹30 Cr',
            lotPrice: '₹10,800-₹12,000',
            gmp: '₹35',
            minAmount: '₹10,800',
            about: 'Digital Payments Hub provides innovative payment gateway solutions for small and medium businesses across India.'
        }
    ];

    const filteredIPOs = filter === 'all' ? ipos : ipos.filter(ipo => ipo.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'open': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'closed': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'listed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleViewDetails = (ipo: IPO) => {
        setSelectedIPO(ipo);
        setShowDetailsModal(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">IPO Calendar</h1>
                            <p className="text-slate-500 dark:text-slate-400">Track upcoming and ongoing IPOs</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['all', 'upcoming', 'open', 'closed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${filter === f
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* IPO Top Ad */}
                <AdSlot slot="ipo-top-banner" format="horizontal" className="mb-8" />

                {/* IPO Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredIPOs.map((ipo) => (
                        <div
                            key={ipo.id}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {ipo.company}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusColor(ipo.status)}`}>
                                            {ipo.status}
                                        </span>
                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 uppercase">
                                            {ipo.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price Range</div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{ipo.priceRange}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Open: <span className="font-semibold text-slate-900 dark:text-white">{ipo.openDate}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Close: <span className="font-semibold text-slate-900 dark:text-white">{ipo.closeDate}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Listing: <span className="font-semibold text-slate-900 dark:text-white">{ipo.listingDate}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Lot Size: <span className="font-semibold text-slate-900 dark:text-white">{ipo.lotSize} shares</span>
                                    </span>
                                </div>
                                {ipo.subscription !== 'N/A' && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Subscription: <span className="font-semibold text-green-600 dark:text-green-400">{ipo.subscription}</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                                <button
                                    onClick={() => handleViewDetails(ipo)}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    View Details
                                </button>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                                    Set Alert
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About IPO Calendar</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Track all upcoming, current, and closed Initial Public Offerings (IPOs) in the Indian market.
                                Get details on price ranges, subscription status, and listing dates to make informed investment decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* IPO Details Modal */}
            {showDetailsModal && selectedIPO && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start z-10">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedIPO.company}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(selectedIPO.status)}`}>
                                        {selectedIPO.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 uppercase">
                                        {selectedIPO.category}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* About */}
                            {selectedIPO.about && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        About Company
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedIPO.about}</p>
                                </div>
                            )}

                            {/* Key Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Issue Size</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedIPO.issueSize}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price Range</div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedIPO.priceRange}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Minimum Amount</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedIPO.minAmount}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lot Size</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedIPO.lotSize} shares</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                    <div className="text-xs text-green-700 dark:text-green-400 mb-1">Grey Market Premium</div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{selectedIPO.gmp}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Subscription</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedIPO.subscription}</div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Timeline</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Issue Opens</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIPO.openDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Issue Closes</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIPO.closeDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <span className="text-sm text-blue-700 dark:text-blue-400">Listing Date</span>
                                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">{selectedIPO.listingDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Issue Breakdown */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Issue Breakdown</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fresh Issue</div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIPO.freshIssue}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Offer for Sale</div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIPO.offerForSale}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            >
                                Close
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AdSense In-Feed Ad */}
            <AdSlot slot="ipo-bottom" format="horizontal" className="mt-6" />
        </div>
    );
}
