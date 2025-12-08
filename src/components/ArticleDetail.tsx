import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Bookmark } from 'lucide-react';

export default function ArticleDetail() {
    const { id } = useParams();

    // Mock article data - in production this would come from an API
    const articles = {
        '1': {
            title: 'How to Use RSI and MACD Together for Smarter Trades',
            category: 'Analysis',
            date: 'December 15, 2024',
            readTime: '10 min',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=1200&auto=format&fit=crop&q=80',
            author: 'Vivek Sharma',
            authorRole: 'Senior Technical Analyst',
            content: `
                <p class="mb-4">Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD) are distinct technical indicators that provide signals based on different measures.</p>
                <p class="mb-4">RSI is a momentum oscillator that measures the speed and change of price movements, while MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">Why Combine Them?</h3>
                <p class="mb-4">Used together, they can provide a more complete picture of market conditions. RSI helps identify overbought or oversold conditions, while MACD confirms the strength and direction of the trend.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">The Strategy</h3>
                <p class="mb-4">A popular strategy involves looking for MACD crossovers that align with RSI signals. For example, a bullish signal occurs when:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>MACD line crosses above the signal line</li>
                    <li>RSI is rising from oversold territory (below 30) but not yet overbought</li>
                    <li>Price is displaying a reversal pattern</li>
                </ul>
                
                <p class="mb-4">This combination filters out many false signals that might occur if using just one indicator in isolation.</p>
            `
        },
        '2': {
            title: 'Top 5 US Stocks To Buy In December 2025',
            category: 'Stock Picks',
            date: 'December 12, 2024',
            readTime: '8 min',
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
            author: 'Sarah Jenkins',
            authorRole: 'Market Strategist',
            content: `
                <p class="mb-4">As we approach the end of 2025, the US market continues to show resilience despite global economic headwinds. Here are our top 5 picks for the coming month.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">1. TechTitan Inc. (TTN)</h3>
                <p class="mb-4">Leading the AI revolution, TechTitan has consistently outperformed earnings expectations. With their new quantum chip release scheduled for Q1 2026, we see significant upside.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">2. GreenEnergy Corp (GEC)</h3>
                <p class="mb-4">With new government subsidies for renewable energy infrastructure, GEC is perfectly positioned to capture market share in the solar and wind sectors.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">3. HealthPlus (HPL)</h3>
                <p class="mb-4">Their breakthrough diabetes treatment has just received FDA approval. This is expected to drive revenue growth of over 40% in the next fiscal year.</p>
            `
        },
        '3': {
            title: 'What is Bitcoin Halving? A Complete Guide',
            category: 'Crypto',
            date: 'November 28, 2024',
            readTime: '12 min',
            image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&auto=format&fit=crop&q=80',
            author: 'Alex Chain',
            authorRole: 'Crypto Analyst',
            content: `
                <p class="mb-4">Bitcoin halving is a pivotal event in the cryptocurrency world that occurs approximately every four years. It cuts the reward for mining new blocks in half, effectively reducing the rate at which new bitcoins are generated.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">How it Works</h3>
                <p class="mb-4">Satoshi Nakamoto programmed this feature into Bitcoin's code to control inflation. Unlike fiat currencies which can be printed endlessly, Bitcoin has a fixed supply cap of 21 million.</p>
                
                <h3 class="text-2xl font-bold mb-4 mt-8">Historical Impact</h3>
                <p class="mb-4">Historically, halving events have been associated with significant price increases in the months following the event, as the reduced supply meets growing or stable demand.</p>
            `
        }
    };

    const article = articles[id as keyof typeof articles];

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                    <Link to="/academy" className="text-blue-600 hover:underline">
                        Back to Academy
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Image */}
            <div className="h-[400px] relative w-full">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            to="/academy"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Academy
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {article.category}
                            </span>
                            <span className="text-slate-300 flex items-center gap-1 text-sm">
                                <Clock className="w-4 h-4" /> {article.readTime} read
                            </span>
                            <span className="text-slate-300 flex items-center gap-1 text-sm">
                                <Calendar className="w-4 h-4" /> {article.date}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                                    alt={article.author}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-white font-medium">{article.author}</p>
                                <p className="text-slate-400 text-sm">{article.authorRole}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
                    <div className="flex justify-between items-start lg:items-center flex-col lg:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
                                <Bookmark className="w-5 h-5" />
                                <span className="font-medium">Save</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
                                <Share2 className="w-5 h-5" />
                                <span className="font-medium">Share</span>
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition">
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition">
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition">
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        className="prose prose-lg max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
