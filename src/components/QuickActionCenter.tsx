import { Link } from 'react-router-dom';
import { useState } from 'react';
import QuickTradeModal from './QuickTradeModal';
import {
    Zap,
    TrendingUp,
    Search,
    Layers,
    Bell,
    GraduationCap,
    ArrowRight,
    Sparkles,
    Settings,
    X,
    Check,
    Activity,
    Filter,
    Users,
    Newspaper,
    BarChart2
} from 'lucide-react';

export default function QuickActionCenter() {
    const [showCustomize, setShowCustomize] = useState(false);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [visibleActions, setVisibleActions] = useState<string[]>([
        'quick-trade', 'paper-trade', 'scan-market', 'build-strategy', 'view-alerts', 'academy'
    ]);

    const allActions = [
        {
            id: 'quick-trade',
            title: 'Quick Trade',
            description: 'Last used setup',
            icon: Zap,
            gradient: 'from-blue-500 to-cyan-500',
            onClick: () => setShowTradeModal(true),
            badge: 'Fast'
        },
        {
            id: 'paper-trade',
            title: 'Paper Trade',
            description: 'Practice safely',
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-500',
            link: '/paper-portfolio',
            badge: 'Safe'
        },
        {
            id: 'scan-market',
            title: 'Scan Market',
            description: 'Find opportunities',
            icon: Search,
            gradient: 'from-purple-500 to-pink-500',
            link: '/analytics',
            badge: 'AI'
        },
        {
            id: 'build-strategy',
            title: 'Build Strategy',
            description: 'Visual builder',
            icon: Layers,
            gradient: 'from-orange-500 to-red-500',
            link: '/strategy'
        },
        {
            id: 'view-alerts',
            title: 'View Alerts',
            description: '3 new alerts',
            icon: Bell,
            gradient: 'from-yellow-500 to-amber-500',
            link: '/alerts',
            badge: '3'
        },
        {
            id: 'academy',
            title: 'Academy',
            description: 'Continue learning',
            icon: GraduationCap,
            gradient: 'from-indigo-500 to-purple-500',
            link: '/academy',
            badge: 'New'
        },
        {
            id: 'option-chain',
            title: 'Option Chain',
            description: 'View Greeks & OI',
            icon: Activity,
            gradient: 'from-teal-500 to-emerald-500',
            link: '/option-chain'
        },
        {
            id: 'options-scanner',
            title: 'Options Scanner',
            description: 'Unusual activity',
            icon: Filter,
            gradient: 'from-pink-500 to-rose-500',
            link: '/scanner'
        },
        {
            id: 'social-trading',
            title: 'Social Trading',
            description: 'Follow experts',
            icon: Users,
            gradient: 'from-violet-500 to-purple-500',
            link: '/social'
        },
        {
            id: 'news-room',
            title: 'News Room',
            description: 'Market updates',
            icon: Newspaper,
            gradient: 'from-slate-500 to-gray-500',
            link: '/news'
        },
        {
            id: 'technical-analysis',
            title: 'Technical Analysis',
            description: 'Advanced charts',
            icon: BarChart2,
            gradient: 'from-cyan-500 to-blue-500',
            link: '/technical'
        },
        {
            id: 'strategy-wizard',
            title: 'Strategy Wizard',
            description: 'AI strategy suggestions',
            icon: Sparkles,
            gradient: 'from-purple-500 to-pink-500',
            link: '/strategy-wizard',
            badge: 'New'
        },
        {
            id: 'strategy-screener',
            title: 'Strategy Screener',
            description: 'Find high-prob setups',
            icon: Filter,
            gradient: 'from-violet-500 to-fuchsia-500',
            link: '/strategy-screener',
            badge: 'New'
        }
    ];

    const toggleAction = (id: string) => {
        setVisibleActions(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
                : [...prev, id]
        );
    };

    const activeActions = allActions.filter(action => visibleActions.includes(action.id));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">One-click shortcuts</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCustomize(true)}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                    Customize <Settings className="w-3 h-3" />
                </button>
            </div>

            {/* Scrollable action grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
                {activeActions.map((action) => {
                    const Icon = action.icon;
                    const content = (
                        <div
                            className="group relative flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600 h-full"
                        >
                            {/* Badge */}
                            {action.badge && (
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
                                        {action.badge}
                                    </span>
                                </div>
                            )}

                            {/* Icon with gradient background */}
                            <div className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Text */}
                            <div className="text-center">
                                <div className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">
                                    {action.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {action.description}
                                </div>
                            </div>

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-300"></div>
                        </div>
                    );

                    // @ts-ignore
                    return action.link ? (
                        // @ts-ignore
                        <Link key={action.id} to={action.link} className="block h-full">
                            {content}
                        </Link>
                    ) : (
                        <div key={action.id} onClick={action.onClick} className="block h-full">
                            {content}
                        </div>
                    );
                })}

                {activeActions.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                        <p>No quick actions visible</p>
                        <button
                            onClick={() => setShowCustomize(true)}
                            className="text-blue-600 text-sm font-medium hover:underline mt-2"
                        >
                            Add actions
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Trade Modal */}
            <QuickTradeModal
                isOpen={showTradeModal}
                onClose={() => setShowTradeModal(false)}
            />

            {/* Customization Modal */}
            {showCustomize && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Customize Actions</h3>
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {allActions.map(action => {
                                const isVisible = visibleActions.includes(action.id);
                                const Icon = action.icon;
                                return (
                                    <div
                                        key={action.id}
                                        onClick={() => toggleAction(action.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${isVisible
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{action.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${isVisible
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                            {isVisible && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
