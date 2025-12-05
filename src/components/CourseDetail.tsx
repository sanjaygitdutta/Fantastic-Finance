import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Clock, Star, Check, Download, Award, Users, TrendingUp, ArrowLeft } from 'lucide-react';

export default function CourseDetail() {
    const { id } = useParams();

    // Mock course data - in production, fetch from API based on id
    const courses = {
        '1': {
            title: 'Technical Analysis Masterclass',
            instructor: 'Sarah Jenkins',
            instructorBio: 'Former Goldman Sachs trader with 15+ years of experience',
            lessons: 24,
            duration: '6h 30m',
            rating: 4.8,
            students: 12543,
            image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
            description: 'Master the art of technical analysis with this comprehensive course. Learn to read charts, identify patterns, and make data-driven trading decisions.',
            learningPoints: [
                'Chart pattern recognition and interpretation',
                'Advanced indicator strategies (RSI, MACD, Bollinger Bands)',
                'Support and resistance identification',
                'Volume analysis and market sentiment',
                'Risk management techniques',
                'Real-world trading examples'
            ],
            curriculum: [
                { title: 'Introduction to Technical Analysis', lessons: 3, duration: '45min' },
                { title: 'Chart Patterns & Trends', lessons: 5, duration: '1h 15min' },
                { title: 'Technical Indicators', lessons: 6, duration: '1h 30min' },
                { title: 'Advanced Strategies', lessons: 5, duration: '1h 20min' },
                { title: 'Risk Management', lessons: 3, duration: '50min' },
                { title: 'Real Trading Examples', lessons: 2, duration: '50min' }
            ]
        },
        '2': {
            title: 'Value Investing Principles',
            instructor: 'Warren B.',
            instructorBio: 'Veteran value investor and author',
            lessons: 18,
            duration: '4h 15m',
            rating: 4.9,
            students: 18234,
            image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=60',
            description: 'Learn the timeless principles of value investing from the masters. Discover how to find undervalued stocks and build long-term wealth.',
            learningPoints: [
                'Fundamental analysis fundamentals',
                'Financial statement analysis',
                'Intrinsic value calculation',
                'Margin of safety concept',
                'Portfolio construction strategies',
                'Long-term wealth building'
            ],
            curriculum: [
                { title: 'Value Investing Philosophy', lessons: 2, duration: '30min' },
                { title: 'Financial Statement Analysis', lessons: 5, duration: '1h 20min' },
                { title: 'Valuation Methods', lessons: 4, duration: '1h' },
                { title: 'Stock Selection', lessons: 4, duration: '55min' },
                { title: 'Portfolio Management', lessons: 3, duration: '30min' }
            ]
        },
        '3': {
            title: 'Crypto Trading Strategies',
            instructor: 'Alex Chain',
            instructorBio: 'Crypto trader and blockchain technology expert',
            lessons: 32,
            duration: '8h 45m',
            rating: 4.7,
            students: 9876,
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60',
            description: 'Navigate the volatile world of cryptocurrency trading. Learn proven strategies, risk management, and market analysis specific to digital assets.',
            learningPoints: [
                'Blockchain fundamentals',
                'Cryptocurrency market analysis',
                'Trading strategies for crypto',
                'DeFi and NFT opportunities',
                'Security and wallet management',
                'Tax implications and regulations'
            ],
            curriculum: [
                { title: 'Crypto Fundamentals', lessons: 4, duration: '1h' },
                { title: 'Market Analysis', lessons: 6, duration: '1h 45min' },
                { title: 'Trading Strategies', lessons: 8, duration: '2h 15min' },
                { title: 'DeFi & Staking', lessons: 5, duration: '1h 30min' },
                { title: 'Security Best Practices', lessons: 4, duration: '1h' },
                { title: 'Portfolio & Tax', lessons: 5, duration: '1h 15min' }
            ]
        }
    };

    const course = courses[id as keyof typeof courses];

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Course Not Found</h1>
                    <Link to="/academy" className="text-blue-600 hover:underline">
                        Back to Academy
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header with Course Info */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <Link to="/academy" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Academy
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-xl text-blue-100 mb-6">{course.description}</p>

                            <div className="flex flex-wrap gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-current text-yellow-400" />
                                    <span className="font-bold">{course.rating}</span>
                                    <span className="text-blue-100">({course.students.toLocaleString()} students)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5" />
                                    <span>{course.lessons} lessons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>{course.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random&size=48`}
                                    alt={course.instructor}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{course.instructor}</p>
                                    <p className="text-sm text-blue-100">{course.instructorBio}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-xl overflow-hidden shadow-2xl">
                            <img src={course.image} alt={course.title} className="w-full h-80 object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <PlayCircle className="w-20 h-20 text-white opacity-80 hover:opacity-100 transition cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What You'll Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {course.learningPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700 dark:text-slate-300">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Course Curriculum</h2>
                            <div className="space-y-3">
                                {course.curriculum.map((section, idx) => (
                                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-500 transition">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                                    {idx + 1}. {section.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {section.lessons} lessons • {section.duration}
                                                </p>
                                            </div>
                                            <PlayCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm sticky top-4">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">$99.99</div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">One-time payment • Lifetime access</p>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold mb-3 transition">
                                Enroll Now
                            </button>
                            <button className="w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                Add to Wishlist
                            </button>

                            <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">This course includes:</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <PlayCircle className="w-4 h-4 text-blue-600" />
                                    {course.duration} on-demand video
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Download className="w-4 h-4 text-blue-600" />
                                    Downloadable resources
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    Certificate of completion
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Community access
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    Lifetime access
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
