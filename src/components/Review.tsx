import { useState } from 'react';
import { Star, Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { DisplayAd } from './AdSense';

export default function Review() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        review: '',
        category: 'general'
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create review object
        const newReview = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            review: formData.review,
            category: formData.category,
            rating: rating,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        // Get existing reviews from localStorage
        const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');

        // Add new review to the beginning
        existingReviews.unshift(newReview);

        // Save back to localStorage
        localStorage.setItem('userReviews', JSON.stringify(existingReviews));

        console.log('Review saved:', newReview);
        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setFormData({ name: '', email: '', review: '', category: 'general' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Share Your Experience
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Your feedback helps us improve and serve you better
                    </p>
                </div>

                {/* Review Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ThumbsUp className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Thank You!
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your review has been submitted successfully.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                    Rate Your Experience *
                                </label>
                                <div className="flex gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {rating === 5 && '⭐ Excellent!'}
                                        {rating === 4 && '👍 Great!'}
                                        {rating === 3 && '😊 Good'}
                                        {rating === 2 && '🤔 Fair'}
                                        {rating === 1 && '😔 Needs Improvement'}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Review Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="general">General Experience</option>
                                    <option value="features">Features & Tools</option>
                                    <option value="ui">User Interface</option>
                                    <option value="data">Data Accuracy</option>
                                    <option value="performance">Performance</option>
                                    <option value="support">Customer Support</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Review */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                    placeholder="Tell us about your experience with Fantastic Financial..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Minimum 20 characters
                                    </p>
                                    <p className={`text-xs font-medium ${formData.review.length >= 20 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {formData.review.length} / 20
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={rating === 0 || formData.review.length < 20}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                <Send className="w-5 h-5" />
                                {rating === 0 ? 'Please Rate Your Experience' : formData.review.length < 20 ? `Write ${20 - formData.review.length} more characters` : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                Why Your Review Matters
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Your honest feedback helps us understand what we're doing well and where we can improve.
                                We read every review and use your insights to make Fantastic Financial better for everyone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* AdSense Display Ad */}
                <DisplayAd adSlot="1234567914" className="mt-8" />
            </div>
        </div>
    );
}
