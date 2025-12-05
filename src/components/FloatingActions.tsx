import { useState } from 'react';
import { Share2, X, Mail, MessageCircle, Copy, Check, Send } from 'lucide-react';


export default function FloatingActions() {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const currentUrl = window.location.href;
    const appName = "Fantastic Financial";
    const shareMessage = `Check out ${appName} - Your complete trading platform!`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedMessage = encodeURIComponent(shareMessage);

        const shareUrls: { [key: string]: string } = {
            whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            email: `mailto:?subject=${encodeURIComponent(appName)}&body=${encodedMessage}%20${encodedUrl}`
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };



    return (
        <>
            {/* Floating Action Buttons Container */}
            <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3">

                {/* Share Menu */}
                {showShareMenu && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 mb-2 animate-in slide-in-from-bottom-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Share App</h3>
                            <button
                                onClick={() => setShowShareMenu(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="flex items-center gap-2 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition text-sm"
                            >
                                <MessageCircle className="w-4 h-4 text-green-600" />
                                <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={() => handleShare('telegram')}
                                className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-sm"
                            >
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Telegram</span>
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="flex items-center gap-2 p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition text-sm"
                            >
                                <Share2 className="w-4 h-4 text-sky-600" />
                                <span>Twitter</span>
                            </button>
                            <button
                                onClick={() => handleShare('facebook')}
                                className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-sm"
                            >
                                <Share2 className="w-4 h-4 text-blue-600" />
                                <span>Facebook</span>
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-sm"
                            >
                                <Share2 className="w-4 h-4 text-blue-700" />
                                <span>LinkedIn</span>
                            </button>
                            <button
                                onClick={() => handleShare('email')}
                                className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition text-sm"
                            >
                                <Mail className="w-4 h-4 text-slate-600" />
                                <span>Email</span>
                            </button>
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="w-full mt-3 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                )}



                {/* Share Button - Smaller Size */}
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
                    title="Share App"
                >
                    <Share2 className="w-5 h-5" />
                    <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        Share App
                    </span>
                </button>
            </div>

            {/* Backdrop */}
            {showShareMenu && (
                <div
                    onClick={() => setShowShareMenu(false)}
                    className="fixed inset-0 bg-black/20 z-30"
                />
            )}
        </>
    );
}
