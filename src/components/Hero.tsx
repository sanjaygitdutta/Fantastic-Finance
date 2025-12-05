import { ArrowRight, Zap, BarChart3, TrendingUp, Shield, Target, Sparkles } from 'lucide-react';

interface HeroProps {
  onSignUpClick: () => void;
}

export default function Hero({ onSignUpClick }: HeroProps) {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 text-sm font-medium text-blue-700 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Join 10,000+ Traders Using Professional Tools
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6">
            Trade Options with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Institutional Edge
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Empower your trading with AI-driven signals, dynamic Greeks, and a risk-free environment to master complex strategies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onSignUpClick}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Trading Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white transition font-semibold text-lg border border-slate-200 hover:border-blue-300 shadow-sm"
            >
              Explore Features
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>AI-Powered Signals</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Advanced Charting Tools</span>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:border-blue-300 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Strategy Builder</h3>
            <p className="text-slate-600 text-sm">Design custom strategies with visual P/L charts</p>
            <div className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              15+ Strategies
            </div>
          </div>

          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:border-purple-300 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">AI Analytics</h3>
            <p className="text-slate-600 text-sm">Predictive signals, PCR analysis, and IV trends</p>
            <div className="mt-3 inline-flex items-center text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Smart Signals
            </div>
          </div>

          <div className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:border-green-300 hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Paper Trading</h3>
            <p className="text-slate-600 text-sm">Practice with ₹10L virtual money risk-free</p>
            <div className="mt-3 inline-flex items-center text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Risk-Free
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}