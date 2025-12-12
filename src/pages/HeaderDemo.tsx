import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, Bell, TrendingUp, Wallet } from 'lucide-react';

const HeaderDemo = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8 space-y-12">
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Header Design Concepts</h1>
                    <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
                </div>
                <p className="text-gray-600">Review these 3 concepts. They are fully coded demos.</p>
            </div>

            {/* --- CONCEPT 1: MODERN MINIMAL --- */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wider">Concept 1: Modern Minimal</h2>
                <div className="bg-gray-200 p-4 rounded-lg overflow-hidden">
                    {/* DEMO CONTAINER */}
                    <header className="bg-white shadow-sm border-b border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 text-white p-1 rounded font-bold text-xl">FF</div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">Fantastic Finance</span>
                            </div>

                            {/* Nav */}
                            <nav className="hidden md:flex items-center gap-8">
                                {['Markets', 'News', 'Analysis', 'Pro Tools'].map((item) => (
                                    <a key={item} href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button className="text-gray-500 hover:text-gray-700">
                                    <Search className="w-5 h-5" />
                                </button>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <button className="text-gray-600 font-medium hover:text-gray-900">Sign In</button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/20">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="h-64 bg-white/50 w-full flex items-center justify-center text-gray-400">Content Area</div>
                </div>
            </section>


            {/* --- CONCEPT 2: PROFESSIONAL FINANCIAL --- */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wider">Concept 2: Professional Financial (Apex Terminal)</h2>
                <div className="bg-slate-900 p-4 rounded-lg overflow-hidden">
                    {/* DEMO CONTAINER */}
                    <div className="flex flex-col">
                        {/* Ticker Bar */}
                        <div className="bg-slate-950 text-xs text-slate-400 py-1.5 px-4 flex justify-between border-b border-slate-800">
                            <div className="flex gap-6 overflow-hidden">
                                <span className="flex gap-2"><span className="text-green-400">NIFTY</span> 24,502 <span className="text-green-500">+0.4%</span></span>
                                <span className="flex gap-2"><span className="text-red-400">SENSEX</span> 81,200 <span className="text-red-500">-0.1%</span></span>
                                <span className="flex gap-2"><span className="text-green-400">GOLD</span> 76,000 <span className="text-green-500">+1.2%</span></span>
                            </div>
                            <div className="flex gap-4">
                                <span>New York: <span className="text-green-400">Open</span></span>
                                <span>London: <span className="text-red-400">Closed</span></span>
                            </div>
                        </div>

                        {/* Main Header */}
                        <header className="bg-slate-900 border-b border-slate-700 text-white">
                            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <span className="text-lg font-bold tracking-wider text-blue-400">FF<span className="text-white">TERMINAL</span></span>

                                    <div className="hidden md:flex items-center bg-slate-800 rounded px-3 py-1.5 border border-slate-700 focus-within:border-blue-500 transition-colors">
                                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                                        <input type="text" placeholder="Search Symbol..." className="bg-transparent border-none outline-none text-sm text-white w-48 placeholder-slate-500" />
                                    </div>
                                </div>

                                <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
                                    {['Dashboard', 'Screeners', 'Options', 'News'].map((item) => (
                                        <a key={item} href="#" className="hover:text-white hover:border-b-2 border-blue-500 py-5 transition-all">{item}</a>
                                    ))}
                                </nav>

                                <div className="flex items-center gap-4">
                                    <button className="p-2 text-slate-400 hover:text-white"><Bell className="w-5 h-5" /></button>
                                    <button className="flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 px-4 py-1.5 rounded hover:bg-blue-600 hover:text-white transition-all text-sm">
                                        <Wallet className="w-4 h-4" /> Connect
                                    </button>
                                </div>
                            </div>
                        </header>
                        <div className="h-64 bg-slate-800/50 w-full flex items-center justify-center text-slate-600">Dark Data-Heavy View</div>
                    </div>
                </div>
            </section>


            {/* --- CONCEPT 3: GLASSMORPHISM / WEB3 --- */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wider">Concept 3: Glassmorphism / Web3</h2>
                <div className="relative bg-black p-4 rounded-lg overflow-hidden group">
                    {/* Background Image/Gradient for effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

                    {/* DEMO CONTAINER */}
                    <div className="relative z-10 p-8 h-80 flex flex-col">

                        {/* FLOATING HEADER */}
                        <header className="mx-auto w-full max-w-5xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between px-6 py-4 transition-all hover:bg-white/10">

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]">F</div>
                                <span className="text-white font-semibold text-lg tracking-wide">Fantastic.fi</span>
                            </div>

                            <nav className="hidden md:flex items-center bg-black/20 rounded-full px-2 py-1 border border-white/5">
                                {['Explore', 'Exchange', 'Learn', 'Community'].map((item, i) => (
                                    <a key={item} href="#"
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${i === 1 ? 'bg-white/10 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            <div className="flex items-center gap-4">
                                <button className="text-white/70 hover:text-white transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105">
                                    Launch App
                                </button>
                            </div>

                        </header>

                        <div className="mt-12 text-center text-white/30 font-light">Content floats below the glass header</div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HeaderDemo;
