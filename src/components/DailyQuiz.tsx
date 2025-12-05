import { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "What does 'OTM' stand for in options trading?",
        options: ["Out of The Money", "Over The Market", "Option Trading Method", "On The Money"],
        correctAnswer: 0,
        explanation: "OTM (Out of The Money) means the option has no intrinsic value. For calls, strike > spot price. For puts, strike < spot price.",
        category: "Options Basics"
    },
    {
        id: 2,
        question: "What is the maximum profit potential for a Bull Call Spread?",
        options: ["Unlimited", "Premium paid", "Difference between strikes minus net premium", "Strike price"],
        correctAnswer: 2,
        explanation: "Bull Call Spread max profit = (Higher Strike - Lower Strike) - Net Premium Paid",
        category: "Options Strategies"
    },
    {
        id: 3,
        question: "Which Greek measures the rate of change of option price with respect to underlying price?",
        options: ["Gamma", "Theta", "Delta", "Vega"],
        correctAnswer: 2,
        explanation: "Delta measures how much an option's price changes for a ₹1 change in the underlying asset price.",
        category: "Greeks"
    },
    {
        id: 4,
        question: "What does a Put-Call Ratio (PCR) above 1.0 typically indicate?",
        options: ["Bearish sentiment", "Bullish sentiment", "Neutral sentiment", "High volatility"],
        correctAnswer: 1,
        explanation: "PCR > 1 means more puts than calls, often indicating bullish sentiment as traders buy puts for hedging or expect a bottom.",
        category: "Market Analysis"
    },
    {
        id: 5,
        question: "What is 'Theta' in options trading?",
        options: ["Time decay", "Volatility measure", "Price sensitivity", "Interest rate impact"],
        correctAnswer: 0,
        explanation: "Theta measures time decay - how much an option's price decreases as expiration approaches, assuming all else equal.",
        category: "Greeks"
    },
    {
        id: 6,
        question: "In a Long Straddle, when do you profit most?",
        options: ["When price stays flat", "When price moves significantly in either direction", "When volatility decreases", "At expiration only"],
        correctAnswer: 1,
        explanation: "Long Straddle profits from large price movements in either direction. You buy both ATM call and put.",
        category: "Options Strategies"
    },
    {
        id: 7,
        question: "What does 'Max Pain' theory suggest?",
        options: ["Maximum loss for option writers", "Price where most options expire worthless", "Highest IV strike", "Most traded strike"],
        correctAnswer: 1,
        explanation: "Max Pain is the strike price where the most option contracts (calls + puts) expire worthless, causing maximum pain to option buyers.",
        category: "Market Analysis"
    }
];

export default function DailyQuiz() {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [dailyQuestion, setDailyQuestion] = useState<QuizQuestion | null>(null);
    const [answeredToday, setAnsweredToday] = useState(false);

    useEffect(() => {
        // Load saved points
        const savedPoints = localStorage.getItem('quizPoints');
        if (savedPoints) {
            setTotalPoints(parseInt(savedPoints));
        }

        // Get today's question based on date
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const questionIndex = dayOfYear % QUIZ_QUESTIONS.length;
        setDailyQuestion(QUIZ_QUESTIONS[questionIndex]);

        // Check if already answered today
        const lastAnswered = localStorage.getItem('lastQuizDate');
        const todayStr = today.toDateString();
        if (lastAnswered === todayStr) {
            setAnsweredToday(true);
            const savedAnswer = localStorage.getItem('todayQuizAnswer');
            if (savedAnswer) {
                setSelectedAnswer(parseInt(savedAnswer));
                setHasAnswered(true);
            }
        }
    }, []);

    const handleSubmit = () => {
        if (selectedAnswer === null || !dailyQuestion) return;

        setHasAnswered(true);
        const today = new Date().toDateString();

        // Save answer for today
        localStorage.setItem('lastQuizDate', today);
        localStorage.setItem('todayQuizAnswer', selectedAnswer.toString());
        setAnsweredToday(true);

        // Award points if correct
        if (selectedAnswer === dailyQuestion.correctAnswer) {
            const newPoints = totalPoints + 1;
            setTotalPoints(newPoints);
            localStorage.setItem('quizPoints', newPoints.toString());
        }
    };

    if (!dailyQuestion) return null;

    const isCorrect = selectedAnswer === dailyQuestion.correctAnswer;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Brain className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Quick Quiz of the Day</h1>
                                <p className="text-purple-100 mt-1">Test your trading knowledge daily!</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <Trophy className="w-5 h-5 text-yellow-300" />
                                <span className="text-sm text-purple-100">Total Points</span>
                            </div>
                            <div className="text-4xl font-bold text-yellow-300">{totalPoints}</div>
                        </div>
                    </div>
                </div>

                {/* Quiz Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    {/* Category Badge */}
                    <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold mb-6">
                        {dailyQuestion.category}
                    </div>

                    {/* Question */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        {dailyQuestion.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {dailyQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrectOption = index === dailyQuestion.correctAnswer;
                            const shouldShowCorrect = hasAnswered && isCorrectOption;
                            const shouldShowWrong = hasAnswered && isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !hasAnswered && setSelectedAnswer(index)}
                                    disabled={hasAnswered}
                                    className={`w-full p-4 rounded-xl text-left transition border-2 ${shouldShowCorrect
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-300'
                                        : shouldShowWrong
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-300'
                                            : isSelected
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-900 dark:text-indigo-300'
                                                : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                                        } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-current' : 'border-slate-300 dark:border-slate-600'
                                                }`}>
                                                {isSelected && <div className="w-3 h-3 rounded-full bg-current"></div>}
                                            </div>
                                            <span className="font-medium">{option}</span>
                                        </div>
                                        {shouldShowCorrect && <CheckCircle className="w-5 h-5" />}
                                        {shouldShowWrong && <XCircle className="w-5 h-5" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Submit Button */}
                    {!hasAnswered && (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Submit Answer
                        </button>
                    )}

                    {/* Result */}
                    {hasAnswered && (
                        <div className={`p-6 rounded-xl border-2 ${isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                            }`}>
                            <div className="flex items-center gap-3 mb-3">
                                {isCorrect ? (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                                            Correct! +1 Point
                                        </h3>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-300">
                                            Not quite right!
                                        </h3>
                                    </>
                                )}
                            </div>
                            <p className={`${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                {dailyQuestion.explanation}
                            </p>
                        </div>
                    )}

                    {/* Already Answered Message */}
                    {answeredToday && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-300">
                                <strong>📅 Daily Quiz:</strong> You've already answered today's question! Come back tomorrow for a new challenge.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">How it works:</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            <span>A new question appears every day automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            <span>Answer correctly to earn +1 point</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            <span>Your points are saved and displayed in your profile</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            <span>You can only answer once per day - choose wisely!</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567908" className="mt-6" />
        </div>
    );
}
