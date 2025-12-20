import { useState } from 'react';
import { Search, BookOpen, TrendingUp, DollarSign, BarChart2, Globe, GraduationCap, PlayCircle, ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSlot from './AdSlot';

export default function Academy() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: 'Trading', name: 'Trading', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'Stock Picks', name: 'Investing', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { id: 'Analysis', name: 'Analysis', icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'Crypto', name: 'Crypto', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    const featuredArticles = [
        {
            id: 1,
            title: 'How to Use RSI and MACD Together for Smarter Trades',
            category: 'Analysis',
            readTime: '10 min',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&auto=format&fit=crop&q=60',
            level: 'Intermediate'
        },
        {
            id: 2,
            title: 'Top 5 US Stocks To Buy In December 2025',
            category: 'Stock Picks',
            readTime: '8 min',
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60',
            level: 'Beginner'
        },
        {
            id: 3,
            title: 'What is Bitcoin Halving? A Complete Guide',
            category: 'Crypto',
            readTime: '12 min',
            image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop&q=60',
            level: 'Beginner'
        }
    ];

    const courses = [
        {
            id: 1,
            title: 'Technical Analysis Masterclass',
            instructor: 'Sarah Jenkins',
            lessons: 24,
            duration: '6h 30m',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
            category: 'Trading'
        },
        {
            id: 2,
            title: 'Value Investing Principles',
            instructor: 'Warren B.',
            lessons: 18,
            duration: '4h 15m',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&auto=format&fit=crop&q=60',
            category: 'Investing'
        },
        {
            id: 3,
            title: 'Crypto Trading Strategies',
            instructor: 'Alex Chain',
            lessons: 32,
            duration: '8h 45m',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60',
            category: 'Crypto'
        }
    ];

    const handleSubscribe = () => {
        alert("Thanks for subscribing! You'll receive our next newsletter shortly.");
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(prev => prev === categoryId ? null : categoryId);
    };

    const filteredArticles = featuredArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? (course.category === 'Investing' && selectedCategory === 'Stock Picks' ? true : course.category === selectedCategory) : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
            {/* Hero Section */}
            <div className="bg-blue-600 dark:bg-blue-800 text-white py-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Master the Markets</h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Comprehensive guides, courses, and resources to help you become a better investor.
                        </p>

                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`${cat.bg} p-6 rounded-xl hover:scale-105 transition cursor-pointer border ${selectedCategory === cat.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'} hover:border-blue-200 dark:hover:border-blue-800`}
                        >
                            <cat.icon className={`w-8 h-8 ${cat.color} mb-3`} />
                            <h3 className="font-bold text-lg">{cat.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore {cat.name} guides</p>
                        </div>
                    ))}
                </div>

                {/* Featured Articles */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                            Popular Articles
                        </h2>
                        <Link to="/learning" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredArticles.map(article => (
                                <div key={article.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                            {article.category}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">{article.level}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                                        </div>
                                        <Link to={`/article/${article.id}`}>
                                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition">{article.title}</h3>
                                        </Link>
                                        <Link to={`/article/${article.id}`} className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">Read Article</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No articles found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Video Courses */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <PlayCircle className="w-6 h-6 text-purple-600" />
                            Premium Courses
                        </h2>
                        <Link to="/learning" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            Browse all courses <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredCourses.map(course => (
                                <div key={course.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                                    <Link to={`/course/${course.id}`} className="block">
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <PlayCircle className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="p-5">
                                        <Link to={`/course/${course.id}`}>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition">{course.title}</h3>
                                        </Link>
                                        <p className="text-sm text-slate-500 mb-3">by {course.instructor}</p>

                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3 mb-3">
                                            <div className="flex items-center gap-1">
                                                <PlayCircle className="w-4 h-4" />
                                                {course.lessons} lessons
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {course.duration}
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500 font-medium">
                                                <Star className="w-4 h-4 fill-current" />
                                                {course.rating}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/course/${course.id}`}
                                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition"
                                        >
                                            Enroll Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No courses found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Newsletter CTA */}
                <div className="mt-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h2 className="text-3xl font-bold mb-4">Join 2 Million+ Learners</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                            Get the latest market insights, educational guides, and course updates delivered straight to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* AdSense Multiplex Ad */}
                <AdSlot slot="academy-bottom-multiplex" format="autorelaxed" className="mt-12" />
            </div>
        </div>
    );
}
