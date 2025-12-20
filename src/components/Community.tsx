import React, { useState, useEffect } from 'react';
import {
    Search, Bell, MessageSquare, Heart, Share2, MoreHorizontal,
    Image as ImageIcon, Smile, Send, ThumbsUp, Users,
    TrendingUp, Bookmark, Calendar, Home, Hash, UserPlus, Globe,
    BarChart2, Target, ArrowUpRight, ArrowDownRight, CheckCircle, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import DonationModal from './DonationModal';
import AdSlot from './AdSlot';
import { InFeedAd } from './AdSense';

interface Post {
    id: string;
    author: string;
    handle: string;
    avatar_url?: string;
    time: string;
    content: string;
    image_url?: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    created_at: string;
    type: 'text' | 'trade' | 'poll' | 'poll' | 'photo' | 'tradingview';
    external_url?: string;
    tradeDetails?: {
        symbol: string;
        action: 'BUY' | 'SELL';
        entry: number;
        target: number;
        stopLoss: number;
        pnl?: number;
        status: 'OPEN' | 'CLOSED' | 'TARGET_HIT' | 'SL_HIT';
    };
    pollDetails?: {
        question: string;
        options: { id: string; text: string; votes: number }[];
        totalVotes: number;
        poll_voted?: string;
    };
    badges?: ('pro' | 'analyst' | 'verified' | 'tradingview')[];
}

type FeedType = 'home' | 'popular' | 'following';

export default function Community() {
    const { logEvent } = useAnalytics();
    const { user } = useAuth();
    const [activeFeed, setActiveFeed] = useState<FeedType>('home');
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [postType, setPostType] = useState<'text' | 'trade' | 'poll' | 'photo'>('text');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [followedUsers, setFollowedUsers] = useState<number[]>([]);
    const [tradingViewPosts, setTradingViewPosts] = useState<Post[]>([]);


    // Trade Input State
    const [tradeInput, setTradeInput] = useState({ symbol: '', action: 'BUY', entry: '', target: '', stopLoss: '' });

    // Poll Input State
    const [pollInput, setPollInput] = useState({ question: '', option1: '', option2: '' });

    // Upload image to Supabase Storage
    const uploadImage = async (base64String: string): Promise<string | null> => {
        try {
            // Convert base64 to blob
            const response = await fetch(base64String);
            const blob = await response.blob();
            const fileExt = blob.type.split('/')[1];
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `community-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('community')
                .upload(filePath, blob);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage.from('community').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };


    // Photo Upload Handler
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('community_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedPosts: Post[] = data?.map((post: any) => ({
                id: post.id.toString(),
                author: post.author_name || 'Anonymous',
                handle: `@${post.author_name?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
                avatar_url: post.author_avatar || `https://ui-avatars.com/api/?name=${post.author_name || 'User'}&background=random`,
                time: new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: post.content,
                image_url: post.image_url,
                likes: post.likes || 0,
                comments: 0, // In a real app, count from community_comments
                shares: 0,
                type: post.type || 'text',
                created_at: post.created_at,
                tradeDetails: post.trade_details,
                pollDetails: post.poll_details
            })) || [];

            setPosts(formattedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Fallback to empty if fails
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTradingViewIdeas = async () => {
        try {
            console.log('🔄 Fetching real TradingView ideas from RSS feed...');

            // Use our serverless API endpoint - NO CORS ISSUES!
            // In development: /api/tradingview-feed
            // In production: https://yourdomain.com/api/tradingview-feed
            const apiUrl = '/api/tradingview-feed';

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/xml, text/xml, */*'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const xmlText = await response.text();

            // Check if response is actually XML and not an error page
            if (!xmlText.trim().startsWith('<?xml') && !xmlText.trim().startsWith('<rss')) {
                throw new Error('Response is not XML format');
            }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                console.error('XML Parser Error:', parserError.textContent);
                throw new Error('XML parsing failed');
            }

            const items = xmlDoc.querySelectorAll('item');
            console.log(`📰 Found ${items.length} total items in RSS feed`);

            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

            const ideas: Post[] = [];

            items.forEach((item, index) => {
                try {
                    const pubDateStr = item.querySelector('pubDate')?.textContent;
                    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

                    // ONLY INCLUDE IDEAS FROM THE LAST 24 HOURS (1 DAY)
                    if (pubDate >= oneDayAgo) {
                        const title = item.querySelector('title')?.textContent || 'TradingView Idea';
                        const link = item.querySelector('link')?.textContent || '';
                        const guid = item.querySelector('guid')?.textContent || `${link}-${index}`;
                        const description = item.querySelector('description')?.textContent || '';

                        // Try different ways to get creator
                        let creator = item.querySelector('creator')?.textContent;
                        if (!creator) {
                            const dcCreator = item.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0];
                            creator = dcCreator?.textContent || 'TradingView Analyst';
                        }

                        // Extract image from description if available
                        let imageUrl = undefined;
                        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
                        if (imgMatch && imgMatch[1]) {
                            imageUrl = imgMatch[1];
                        }

                        // Clean up description - remove HTML tags and limit length
                        const cleanDescription = description
                            .replace(/<[^>]*>/g, '')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .trim();

                        // Create readable content
                        const content = `${title}\n\n${cleanDescription.substring(0, 280)}${cleanDescription.length > 280 ? '...' : ''}`;

                        ideas.push({
                            id: `tv-${guid.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50)}`,
                            author: creator,
                            handle: '@tradingview',
                            avatar_url: 'https://static.tradingview.com/static/images/logo-tradingview.svg',
                            time: pubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            content: content,
                            image_url: imageUrl,
                            likes: Math.floor(Math.random() * 80) + 20,
                            comments: Math.floor(Math.random() * 15),
                            shares: Math.floor(Math.random() * 25),
                            isLiked: false,
                            created_at: pubDate.toISOString(),
                            type: 'tradingview',
                            external_url: link,
                            badges: ['tradingview']
                        });

                        console.log(`✅ Added idea: "${title.substring(0, 50)}..." (${pubDate.toLocaleTimeString()})`);
                    }
                } catch (itemError) {
                    console.warn('⚠️ Error processing TradingView item:', itemError);
                }
            });

            if (ideas.length > 0) {
                setTradingViewPosts(ideas);
                console.log(`✅ Successfully fetched ${ideas.length} real TradingView ideas from the last 24 hours`);
            } else {
                console.log('⚠️ No TradingView ideas found from the last 24 hours, using fallback');
                // Create a fallback post if no recent ideas
                setTradingViewPosts([{
                    id: `tv-fallback-${Date.now()}`,
                    author: 'TradingView',
                    handle: '@tradingview',
                    avatar_url: 'https://static.tradingview.com/static/images/logo-tradingview.svg',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    content: '📊 Live Trading Ideas & Analysis\n\nNo new ideas published in the last 24 hours. The market is quiet today! 📊\n\nCheck out the latest analysis and trading setups from professional traders worldwide.\n\n🔥 Explore trending ideas, chart patterns, and community discussions!',
                    likes: 95,
                    comments: 18,
                    shares: 25,
                    isLiked: false,
                    created_at: new Date().toISOString(),
                    type: 'tradingview',
                    external_url: 'https://in.tradingview.com/ideas/',
                    badges: ['tradingview']
                }]);
            }
        } catch (error) {
            console.error('❌ Error fetching TradingView ideas:', error);
            // Fallback with generic post on error
            setTradingViewPosts([{
                id: `tv-error-${Date.now()}`,
                author: 'TradingView',
                handle: '@tradingview',
                avatar_url: 'https://static.tradingview.com/static/images/logo-tradingview.svg',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: '📊 Live Trading Ideas & Analysis\n\nExplore real-time market insights from professional traders worldwide. Access technical analysis, chart patterns, and trade setups.\n\n✨ Click below to view the latest ideas!',
                likes: 95,
                comments: 18,
                shares: 25,
                isLiked: false,
                created_at: new Date().toISOString(),
                type: 'tradingview',
                external_url: 'https://in.tradingview.com/ideas/',
                badges: ['tradingview']
            }]);
        }
    };


    useEffect(() => {
        fetchPosts();
        fetchTradingViewIdeas();

        // Auto-update every 5 minutes
        const fetchInterval = setInterval(() => {
            fetchPosts();
            fetchTradingViewIdeas();
        }, 5 * 60 * 1000);


        // Auto-cleanup stale ideas every 5 minutes
        const cleanupInterval = setInterval(() => {
            setTradingViewPosts(prev => {
                const now = new Date();
                const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours
                return prev.filter(post => new Date(post.created_at) >= oneDayAgo);
            });
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => {
            clearInterval(fetchInterval);
            clearInterval(cleanupInterval);
        };
    }, []);

    const handleCreatePost = async () => {
        if (!user) {
            alert('Please login to create a post');
            return;
        }

        if (!newPostContent.trim() && postType === 'text') {
            alert('Please write something before posting');
            return;
        }

        if (postType === 'trade' && (!tradeInput.symbol || !tradeInput.entry)) {
            alert('Please fill in Symbol and Entry Price for trade post');
            return;
        }

        if (postType === 'poll' && (!pollInput.question || !pollInput.option1 || !pollInput.option2)) {
            alert('Please fill in question and both options for poll');
            return;
        }

        setPosting(true);
        let newPostData: any;

        try {
            let finalImageUrl = null;
            if (postType === 'photo' && photoPreview) {
                // For Demo users, we just use the preview URL as the image URL since we can't upload to storage
                if (localStorage.getItem('demo_user')) {
                    finalImageUrl = photoPreview;
                } else {
                    finalImageUrl = await uploadImage(photoPreview);
                    if (!finalImageUrl) throw new Error('Image upload failed');
                }
            }

            // CHECK FOR DEMO USER
            if (localStorage.getItem('demo_user')) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockPost: Post = {
                    id: Date.now().toString(),
                    author: user.email?.split('@')[0] || 'Demo User',
                    handle: `@${user.email?.split('@')[0] || 'demo'}`,
                    avatar_url: `https://ui-avatars.com/api/?name=${user.email || 'Demo'}&background=random`,
                    time: 'Just now',
                    content: newPostContent || (postType === 'photo' ? 'Shared a photo' : `Posted a ${postType}`),
                    type: postType,
                    image_url: finalImageUrl || undefined,
                    likes: 0,
                    comments: 0,
                    shares: 0,
                    isLiked: false,
                    created_at: new Date().toISOString(),
                    tradeDetails: postType === 'trade' ? {
                        symbol: tradeInput.symbol.toUpperCase(),
                        action: tradeInput.action as 'BUY' | 'SELL',
                        entry: Number(tradeInput.entry),
                        target: Number(tradeInput.target),
                        stopLoss: Number(tradeInput.stopLoss),
                        status: 'OPEN'
                    } : undefined,
                    pollDetails: postType === 'poll' ? {
                        question: pollInput.question,
                        options: [
                            { id: '1', text: pollInput.option1, votes: 0 },
                            { id: '2', text: pollInput.option2, votes: 0 }
                        ],
                        totalVotes: 0
                    } : undefined,
                    badges: ['verified'] // Give demo user a badge for fun
                };

                setPosts([mockPost, ...posts]);
                alert('Post created successfully! (Demo Mode) 🎉');

                setNewPostContent('');
                setTradeInput({ symbol: '', action: 'BUY', entry: '', target: '', stopLoss: '' });
                setPollInput({ question: '', option1: '', option2: '' });
                setPhotoPreview(null);
                setPostType('text');
                setPosting(false);
                return;
            }

            newPostData = {
                user_id: user.id,
                content: newPostContent || (postType === 'photo' ? 'Shared a photo' : `Posted a ${postType}`),
                type: postType,
                image_url: finalImageUrl,
                trade_details: postType === 'trade' ? {
                    symbol: tradeInput.symbol.toUpperCase(),
                    action: tradeInput.action,
                    entry: Number(tradeInput.entry),
                    target: Number(tradeInput.target),
                    stopLoss: Number(tradeInput.stopLoss),
                    status: 'OPEN'
                } : null,
                poll_details: postType === 'poll' ? {
                    question: pollInput.question,
                    options: [
                        { id: '1', text: pollInput.option1, votes: 0 },
                        { id: '2', text: pollInput.option2, votes: 0 }
                    ],
                    totalVotes: 0
                } : null
            };

            const { error } = await supabase
                .from('community_posts')
                .insert(newPostData);

            if (error) throw error;

            // Success feedback
            alert('Post created successfully! 🎉');

            setNewPostContent('');
            setTradeInput({ symbol: '', action: 'BUY', entry: '', target: '', stopLoss: '' });
            setPollInput({ question: '', option1: '', option2: '' });
            setPhotoPreview(null);
            setPostType('text');
            fetchPosts();

        } catch (error: any) {
            console.error('Error creating post:', error);

            // Auto-fix: If error is about foreign key constraint on "user_id", it means Profile doesn't exist.
            // We try to create the profile and retry the post.
            if ((error.code === '23503' || error.message?.includes('violates foreign key constraint')) && newPostData) {
                console.log('Profile missing, attempting to create...');
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    avatar_url: user.user_metadata?.avatar_url
                });

                if (!profileError) {
                    console.log('Profile created. Retrying post...');
                    const { error: retryError } = await supabase.from('community_posts').insert(newPostData);
                    if (!retryError) {
                        alert('Post created successfully! (Profile was auto-fixed) 🎉');
                        setNewPostContent('');
                        setTradeInput({ symbol: '', action: 'BUY', entry: '', target: '', stopLoss: '' });
                        setPollInput({ question: '', option1: '', option2: '' });
                        setPhotoPreview(null);
                        setPostType('text');
                        fetchPosts();
                        return; // Success on retry
                    }
                } else {
                    console.error('Failed to auto-create profile:', profileError);
                }
            }

            alert(`Failed to create post: ${error.message || 'Unknown error'}. Check console for details.`);
        } finally {
            setPosting(false);
        }
    };

    const handleFollowUser = (userId: number) => {
        if (followedUsers.includes(userId)) {
            setFollowedUsers(followedUsers.filter(id => id !== userId));
        } else {
            setFollowedUsers([...followedUsers, userId]);
        }
    };

    const handleLike = async (postId: string) => {
        // Optimistic update
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.likes + 1,
                    isLiked: true
                };
            }
            return post;
        }));

        try {
            // In a real app, we'd check if user already liked it in a separate table.
            // For now, just increment the counter in the posts table.
            const post = posts.find(p => p.id === postId);
            if (post) {
                await supabase.rpc('increment_likes', { row_id: Number(postId) });
                // Note: You'll need to create this RPC function or just use update:
                // await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', postId);
                // Using simple update for now:
                await supabase
                    .from('community_posts')
                    .update({ likes: (post.likes || 0) + 1 })
                    .eq('id', postId);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Comment State
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState<{ [postId: string]: any[] }>({});

    const toggleComments = (postId: string) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
        } else {
            setActiveCommentPostId(postId);
            fetchComments(postId);
        }
    };

    const fetchComments = async (postId: string) => {
        try {
            const { data, error } = await supabase
                .from('community_comments')
                .select(`
          *,
          profiles:user_id (email)
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const formattedComments = data?.map((comment: any) => ({
                id: comment.id,
                author: comment.profiles?.email?.split('@')[0] || 'Anonymous',
                content: comment.content,
                time: new Date(comment.created_at).toLocaleDateString(),
                avatar_url: `https://ui-avatars.com/api/?name=${comment.profiles?.email || 'User'}&background=random`
            })) || [];

            setComments(prev => ({ ...prev, [postId]: formattedComments }));
        } catch (error) {
            console.error('Error fetching comments:', error);
            // Fallback for demo/error
            setComments(prev => ({ ...prev, [postId]: [] }));
        }
    };

    const handlePostComment = async (postId: string) => {
        if (!commentContent.trim() || !user) return;

        try {
            const newComment = {
                post_id: postId,
                user_id: user.id,
                content: commentContent
            };

            const { data, error } = await supabase
                .from('community_comments')
                .insert(newComment)
                .select();

            if (error) throw error;

            // Optimistic Update
            const optimisticComment = {
                id: Date.now().toString(),
                author: user.email?.split('@')[0] || 'You',
                content: commentContent,
                time: 'Just now',
                avatar_url: `https://ui-avatars.com/api/?name=${user.email || 'You'}&background=random`
            };

            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), optimisticComment]
            }));
            setCommentContent('');

            // Refresh real comments
            if (data) fetchComments(postId);

        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        }
    };

    const handleShare = async (post: Post) => {
        const shareData = {
            title: `Check out ${post.author}'s post on Fantastic Financial`,
            text: post.content,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            alert('Link copied to clipboard!');
        }
    };

    const combinedPosts = [...posts, ...tradingViewPosts].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191A] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header */}
            <header className="sticky top-0 bg-white dark:bg-[#242526] shadow-sm z-50 h-14 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                        C
                    </div>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-500 tracking-tight hidden md:block">Club Hall</span>
                </div>

                <div className="flex-1 max-w-xl mx-4 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search Club Hall"
                            className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/" className="w-10 h-10 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-full flex items-center justify-center hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] transition" title="Back to Home">
                        <Home className="w-5 h-5 text-black dark:text-white" />
                    </Link>
                    <button className="w-10 h-10 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-full flex items-center justify-center hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] transition">
                        <Bell className="w-5 h-5 text-black dark:text-white" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto pt-6 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveFeed('home')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${activeFeed === 'home' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-[#3A3B3C]'}`}
                            >
                                <Home className="w-6 h-6" />
                                <span className="text-lg">Home Feed</span>
                            </button>
                            <button
                                onClick={() => setActiveFeed('popular')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${activeFeed === 'popular' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-[#3A3B3C]'}`}
                            >
                                <TrendingUp className="w-6 h-6" />
                                <span className="text-lg">Popular</span>
                            </button>
                            <button
                                onClick={() => setActiveFeed('following')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${activeFeed === 'following' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-[#3A3B3C]'}`}
                            >
                                <Users className="w-6 h-6" />
                                <span className="text-lg">Following</span>
                            </button>
                        </div>
                    </div>

                    {/* Center - Feed */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Create Post */}
                        <div className="bg-white dark:bg-[#242526] rounded-xl shadow p-4">
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white">
                                    {user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder={`What's on your mind?`}
                                        className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Post Type Selectors */}
                            {postType !== 'text' && (
                                <div className="mb-4 p-4 bg-slate-50 dark:bg-[#3A3B3C] rounded-lg animate-in fade-in slide-in-from-top-2">
                                    {postType === 'trade' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Symbol (e.g. RELIANCE)" className="p-2 rounded border" value={tradeInput.symbol} onChange={e => setTradeInput({ ...tradeInput, symbol: e.target.value })} />
                                            <select className="p-2 rounded border" value={tradeInput.action} onChange={e => setTradeInput({ ...tradeInput, action: e.target.value })}>
                                                <option value="BUY">BUY</option>
                                                <option value="SELL">SELL</option>
                                            </select>
                                            <input type="number" placeholder="Entry Price" className="p-2 rounded border" value={tradeInput.entry} onChange={e => setTradeInput({ ...tradeInput, entry: e.target.value })} />
                                            <input type="number" placeholder="Target" className="p-2 rounded border" value={tradeInput.target} onChange={e => setTradeInput({ ...tradeInput, target: e.target.value })} />
                                            <input type="number" placeholder="Stop Loss" className="p-2 rounded border" value={tradeInput.stopLoss} onChange={e => setTradeInput({ ...tradeInput, stopLoss: e.target.value })} />
                                        </div>
                                    )}
                                    {postType === 'poll' && (
                                        <div className="space-y-3">
                                            <input type="text" placeholder="Poll Question" className="w-full p-2 rounded border" value={pollInput.question} onChange={e => setPollInput({ ...pollInput, question: e.target.value })} />
                                            <input type="text" placeholder="Option 1" className="w-full p-2 rounded border" value={pollInput.option1} onChange={e => setPollInput({ ...pollInput, option1: e.target.value })} />
                                            <input type="text" placeholder="Option 2" className="w-full p-2 rounded border" value={pollInput.option2} onChange={e => setPollInput({ ...pollInput, option2: e.target.value })} />
                                        </div>
                                    )}
                                    {postType === 'photo' && (
                                        <div className="space-y-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="photo-upload"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                                            >
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Preview" className="max-h-64 rounded-lg" />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                                                        <p className="text-slate-600">Click to upload photo</p>
                                                        <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF up to 10MB</p>
                                                    </>
                                                )}
                                            </label>
                                            {photoPreview && (
                                                <button
                                                    onClick={() => setPhotoPreview(null)}
                                                    className="text-sm text-red-500 hover:text-red-700"
                                                >
                                                    Remove photo
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                                <div className="flex gap-2">
                                    <button onClick={() => setPostType('photo')} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${postType === 'photo' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-slate-600'}`}>
                                        <ImageIcon className="w-5 h-5 text-blue-500" />
                                        Photo
                                    </button>
                                    <button onClick={() => setPostType('trade')} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${postType === 'trade' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-slate-600'}`}>
                                        <BarChart2 className="w-5 h-5 text-green-500" />
                                        Trade Idea
                                    </button>
                                    <button onClick={() => setPostType('poll')} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${postType === 'poll' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] text-slate-600'}`}>
                                        <Target className="w-5 h-5 text-purple-500" />
                                        Poll
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={posting || (!newPostContent.trim() && postType === 'text')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {posting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Posting...
                                        </>
                                    ) : (
                                        'Post'
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        {loading ? (
                            <div className="text-center py-10">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-slate-500">Loading feed...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {combinedPosts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-[#242526] rounded-xl shadow overflow-hidden relative">
                                        {post.type === 'tradingview' && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1 shadow-lg animate-pulse">
                                                    <TrendingUp className="w-3 h-3" />
                                                    REAL-TIME IDEA
                                                </span>
                                            </div>
                                        )}
                                        {/* Post Header */}
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={post.avatar_url} alt={post.author} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer">{post.author}</h3>
                                                        {post.badges?.includes('verified') && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />}
                                                        {post.badges?.includes('pro') && <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <span>{post.time}</span>
                                                        <span>•</span>
                                                        <Globe className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] rounded-full transition">
                                                <MoreHorizontal className="w-5 h-5 text-slate-500" />
                                            </button>
                                        </div>

                                        {/* Post Content */}
                                        <div className="px-4 pb-2">
                                            <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap mb-3">{post.content}</p>

                                            {/* Trade Card */}
                                            {post.type === 'trade' && post.tradeDetails && (
                                                <div className="bg-slate-50 dark:bg-[#3A3B3C] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-lg">{post.tradeDetails.symbol}</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${post.tradeDetails.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {post.tradeDetails.action}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-mono bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                                                            {post.tradeDetails.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-slate-500 text-xs">Entry</p>
                                                            <p className="font-semibold">₹{post.tradeDetails.entry}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 text-xs">Target</p>
                                                            <p className="font-semibold text-green-600">₹{post.tradeDetails.target}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 text-xs">Stop Loss</p>
                                                            <p className="font-semibold text-red-600">₹{post.tradeDetails.stopLoss}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Poll Card */}
                                            {post.type === 'poll' && post.pollDetails && (
                                                <div className="bg-slate-50 dark:bg-[#3A3B3C] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                                    <h4 className="font-semibold mb-3">{post.pollDetails.question}</h4>
                                                    <div className="space-y-2">
                                                        {post.pollDetails.options.map(option => {
                                                            const percentage = Math.round((option.votes / post.pollDetails!.totalVotes) * 100) || 0;
                                                            return (
                                                                <div key={option.id} className="relative">
                                                                    <div className="flex justify-between text-sm mb-1 relative z-10">
                                                                        <span>{option.text}</span>
                                                                        <span className="font-medium">{percentage}%</span>
                                                                    </div>
                                                                    <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-lg overflow-hidden relative">
                                                                        <div className="absolute top-0 left-0 h-full bg-blue-100 dark:bg-blue-900/40 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                                                        <button className="absolute inset-0 w-full h-full text-left px-3 text-sm font-medium opacity-0 hover:opacity-100 hover:bg-black/5 transition">
                                                                            Vote
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Community Feed Mid Ad */}
                                                        <AdSlot slot="community-feed-mid" format="fluid" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2">{post.pollDetails.totalVotes} votes • 1 day left</p>
                                                </div>
                                            )}

                                            {/* Photo Display */}
                                            {post.type === 'photo' && post.image_url && (
                                                <img
                                                    src={post.image_url}
                                                    alt="Post"
                                                    className="w-full rounded-lg mt-2 cursor-pointer hover:opacity-95 transition"
                                                />
                                            )}
                                        </div>

                                        {post.image_url && !post.type.includes('photo') && (
                                            <div className="mt-2">
                                                <img src={post.image_url} alt="Post content" className="w-full object-cover max-h-[500px]" />
                                            </div>
                                        )}

                                        {/* Post Stats */}
                                        <div className="px-4 py-2 flex items-center justify-between text-slate-500 text-sm border-b border-gray-200 dark:border-gray-700 mx-4">
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <ThumbsUp className="w-2.5 h-2.5 text-white" />
                                                </div>
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => toggleComments(post.id)} className="hover:underline">
                                                    {comments[post.id]?.length || 0} comments
                                                </button>
                                                <span>{post.shares} shares</span>
                                            </div>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="px-2 py-1 flex items-center justify-between">
                                            {post.type === 'tradingview' ? (
                                                <a
                                                    href={post.external_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition font-bold"
                                                >
                                                    <ArrowUpRight className="w-5 h-5" />
                                                    View Full Analysis on TradingView
                                                </a>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleLike(post.id)}
                                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition font-medium ${post.isLiked ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                                                    >
                                                        <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                                        Like
                                                    </button>
                                                    <button
                                                        onClick={() => toggleComments(post.id)}
                                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition font-medium ${activeCommentPostId === post.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                                                    >
                                                        <MessageSquare className="w-5 h-5" />
                                                        Comment
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare(post)}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition font-medium text-slate-600 dark:text-slate-300"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                        Share
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Comment Section */}
                                        {activeCommentPostId === post.id && (
                                            <div className="px-4 pb-4 pt-2 bg-slate-50 dark:bg-[#1C1D1E] animate-in slide-in-from-top-2">
                                                {/* Write Comment */}
                                                <div className="flex gap-2 mb-4">
                                                    <img src={`https://ui-avatars.com/api/?name=${user?.email || 'You'}`} alt="You" className="w-8 h-8 rounded-full" />
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Write a comment..."
                                                            className="flex-1 bg-white dark:bg-[#3A3B3C] border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={commentContent}
                                                            onChange={(e) => setCommentContent(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                                                        />
                                                        <button
                                                            onClick={() => handlePostComment(post.id)}
                                                            disabled={!commentContent.trim()}
                                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Comment List */}
                                                <div className="space-y-3">
                                                    {comments[post.id]?.map((comment: any) => (
                                                        <div key={comment.id} className="flex gap-2">
                                                            <img src={comment.avatar_url} alt={comment.author} className="w-8 h-8 rounded-full flex-shrink-0" />
                                                            <div className="bg-white dark:bg-[#3A3B3C] p-2 rounded-2xl rounded-tl-none">
                                                                <p className="font-semibold text-xs text-slate-900 dark:text-white">{comment.author}</p>
                                                                <p className="text-sm text-slate-700 dark:text-slate-200">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {comments[post.id]?.length === 0 && (
                                                        <p className="text-center text-slate-500 text-xs py-2">No comments yet. Be the first!</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Trending */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                        <div className="bg-white dark:bg-[#242526] rounded-xl shadow p-4 mb-6">
                            <h3 className="font-bold text-slate-500 mb-4">Trending in Market</h3>
                            <div className="space-y-4">
                                <div className="cursor-pointer hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] p-2 -mx-2 rounded-lg transition">
                                    <p className="text-xs text-slate-500">Stocks • Trending</p>
                                    <p className="font-bold text-slate-900 dark:text-white">#NIFTY50</p>
                                    <p className="text-xs text-slate-500">125K posts</p>
                                </div>
                                <div className="cursor-pointer hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] p-2 -mx-2 rounded-lg transition">
                                    <p className="text-xs text-slate-500">Crypto • Trending</p>
                                    <p className="font-bold text-slate-900 dark:text-white">#Bitcoin</p>
                                    <p className="text-xs text-slate-500">540K posts</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#242526] rounded-xl shadow p-4">
                            <h3 className="font-bold text-slate-500 mb-4">Who to follow</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white">Trader {i}</p>
                                                <p className="text-xs text-slate-500">@trader{i}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleFollowUser(i)}
                                            className={`p-2 rounded-full transition ${followedUsers.includes(i) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-50'}`}
                                            title={followedUsers.includes(i) ? 'Unfollow' : 'Follow'}
                                        >
                                            {followedUsers.includes(i) ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <UserPlus className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* AdSense In-Feed Ad */}
            <InFeedAd adSlot="1234567898" className="mt-6" />
        </div>
    );
}
