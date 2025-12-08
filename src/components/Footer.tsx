import { TrendingUp, Twitter, Facebook, Linkedin, Instagram, Mail, Phone, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Link to="/admin/login" className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition" title="Admin">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </Link>
                            <span className="text-xl font-bold text-white">Fantastic Financial</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Empowering investors with professional-grade tools, real-time data, and community insights to make smarter financial decisions.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/markets" className="hover:text-blue-500 transition">Markets</Link></li>
                            <li><Link to="/news" className="hover:text-blue-500 transition">News Room</Link></li>
                            <li><Link to="/strategy" className="hover:text-blue-500 transition">Strategy Builder</Link></li>
                            <li><Link to="/screener" className="hover:text-blue-500 transition">Stock Screener</Link></li>
                            <li><Link to="/community" className="hover:text-blue-500 transition">Community</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-500 transition">Help Center</a></li>
                            <li>
                                <Link to="/#contact" className="flex items-center gap-2 hover:text-blue-500 transition">
                                    <MessageCircle className="w-4 h-4" />
                                    Send Feedback
                                </Link>
                            </li>
                            <li>
                                <Link to="/review" className="flex items-center gap-2 hover:text-blue-500 transition">
                                    <Star className="w-4 h-4" />
                                    Give Review
                                </Link>
                            </li>
                            <li><Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
                            <li><Link to="/disclaimer" className="hover:text-blue-500 transition">Disclaimer</Link></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div id="contact">
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <a
                                    href="mailto:fantasticfinancialattherate@gmail.com"
                                    className="hover:text-blue-400 transition break-all"
                                >
                                    fantasticfinancialattherate@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <a
                                    href="tel:+919531775665"
                                    className="hover:text-blue-400 transition"
                                >
                                    +91 95317 75665
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center">
                    <p className="text-slate-500 text-sm mb-4 max-w-4xl mx-auto px-4">
                        Disclaimer: Fantastic Financial is an independent website and has no relation to any company, LLP, or entity with similar names. It is not an advisory firm; it is an education and analytics provider.
                    </p>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Fantastic Financial. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
