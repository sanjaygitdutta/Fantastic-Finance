import { ArrowRight, Shield, Zap } from 'lucide-react';

interface FinalCTAProps {
    onSignUpClick: () => void;
}

export default function FinalCTA({ onSignUpClick }: FinalCTAProps) {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Ready to Trade Like a
                    <br />
                    Professional?
                </h2>

                <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of smart traders using Fantastic Finance to master the markets.
                </p>

                <button
                    onClick={onSignUpClick}
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                    Create Free Account
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-blue-50">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span>Start trading in 30 seconds</span>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div>
                            <div className="text-3xl font-bold">10,000+</div>
                            <div className="text-blue-100 text-sm">Active Traders</div>
                        </div>
                        <div className="h-12 w-px bg-white/20"></div>
                        <div>
                            <div className="text-3xl font-bold">₹500Cr+</div>
                            <div className="text-blue-100 text-sm">Paper Trades</div>
                        </div>
                        <div className="h-12 w-px bg-white/20"></div>
                        <div>
                            <div className="text-3xl font-bold">99.9%</div>
                            <div className="text-blue-100 text-sm">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
