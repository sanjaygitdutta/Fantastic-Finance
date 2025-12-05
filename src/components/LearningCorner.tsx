import { GraduationCap, BookOpen, Video, Award, TrendingUp, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearningCorner() {
    // Mock learning data
    const dailyTip = {
        title: 'Understanding Implied Volatility',
        content: 'IV increases when market expects big moves. Use it to time your option entries - buy when IV is low, sell when IV is high.',
        category: 'Options Strategy'
    };

    const currentCourse = {
        title: 'Advanced Options Strategies',
        progress: 65,
        nextLesson: 'Iron Condor Deep Dive',
        totalLessons: 12,
        completedLessons: 8
    };

    const featuredContent = [
        {
            id: '1',
            type: 'video',
            title: 'How to Read Option Chain Like a Pro',
            duration: '12 min',
            views: '15.2K',
            thumbnail: '🎥',
            category: 'Tutorial'
        },
        {
            id: '2',
            type: 'article',
            title: 'Top 5 Mistakes Beginners Make',
            readTime: '5 min',
            thumbnail: '📖',
            category: 'Guide'
        }
    ];

    const quiz = {
        question: 'What happens to option premium as expiry approaches?',
        options: [
            'Increases due to time value',
            'Decreases due to theta decay',
            'Remains constant',
            'Depends on volatility only'
        ],
        correctAnswer: 1,
        hasAnswered: false
    };

    const achievements = {
        coursesCompleted: 3,
        quizzesCompleted: 15,
        certificatesEarned: 2,
        streakDays: 7
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learning Corner</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Continue your trading education</p>
                    </div>
                </div>
                <Link
                    to="/academy"
                    className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* Daily Tip */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100">💡 Daily Trading Tip</h4>
                            <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                                {dailyTip.category}
                            </span>
                        </div>
                        <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-1">
                            {dailyTip.title}
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {dailyTip.content}
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Course Progress */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-slate-900 dark:text-white">Continue Learning</h4>
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{currentCourse.title}</h5>
                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">
                            Lesson {currentCourse.completedLessons}/{currentCourse.totalLessons}
                        </span>
                        <span className="font-semibold text-purple-600">{currentCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${currentCourse.progress}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Next: <span className="font-medium text-slate-900 dark:text-white">{currentCourse.nextLesson}</span>
                    </span>
                    <Link
                        to="/academy"
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                        <Play className="w-3 h-3" />
                        Continue
                    </Link>
                </div>
            </div>

            {/* Featured Content */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    Featured Content
                </h4>
                <div className="space-y-3">
                    {featuredContent.map((content) => (
                        <Link
                            key={content.id}
                            to="/academy"
                            className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-600"
                        >
                            <div className="text-3xl">{content.thumbnail}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded">
                                        {content.category}
                                    </span>
                                    {content.type === 'video' && content.views && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">👁 {content.views}</span>
                                    )}
                                </div>
                                <h5 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition">
                                    {content.title}
                                </h5>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {content.type === 'video' ? `⏱ ${content.duration}` : `📖 ${content.readTime}`}
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Quiz */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Quick Quiz of the Day</h4>
                </div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                    {quiz.question}
                </p>
                <div className="space-y-2 mb-3">
                    {quiz.options.map((option, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-400 border border-slate-200 dark:border-slate-600 transition"
                        >
                            {String.fromCharCode(65 + idx)}. {option}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                    💎 Complete to earn 10 points
                </div>
            </div>

            {/* Learning Stats */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-600">{achievements.coursesCompleted}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Courses</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{achievements.quizzesCompleted}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Quizzes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">{achievements.certificatesEarned}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Certificates</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-600">{achievements.streakDays}🔥</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Day Streak</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
