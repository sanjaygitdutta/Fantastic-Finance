import { Zap, Shield, BarChart2, Brain, Globe, Smartphone, BookOpen, Users } from 'lucide-react';

export default function About() {
  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Stop guessing. Let our advanced AI analyze market trends, PCR ratios, and option chains to generate high-probability trading signals for you.'
    },
    {
      icon: BarChart2,
      title: 'Visual Strategy Builder',
      description: 'Visualize complex strategies like Iron Condors and Straddles with interactive P/L payoff charts. Understand your risk and reward instantly.'
    },
    {
      icon: Shield,
      title: 'Risk-Free Practice',
      description: 'Master the market without losing a rupee. Practice with ₹10 Lakhs virtual capital in our realistic paper trading environment.'
    },
    {
      icon: Zap,
      title: 'Seamless Trade Execution',
      description: 'Experience instant order placement in our simulation engine. Test your strategies with realistic execution speeds and zero latency.'
    },
    {
      icon: BookOpen,
      title: 'Learn from Experts',
      description: 'Access our comprehensive Trading Academy. From basics to advanced Greeks, we provide the educational resources you need to succeed.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a vibrant community of traders. Share strategies, discuss market views, and grow together with like-minded individuals.'
    },
    {
      icon: Globe,
      title: 'Trade Anywhere',
      description: 'Fully responsive platform. Analyze markets and manage your positions seamlessly from your desktop, tablet, or mobile device.'
    },
    {
      icon: Smartphone,
      title: 'Smart Alerts',
      description: 'Set custom price and IV alerts. Get notified instantly via WhatsApp or Email when your setup triggers, so you never miss an opportunity.'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Traders Choose <span className="text-blue-600">Fantastic Finance</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We combine institutional-grade analytics with an intuitive interface to give retail traders the edge they deserve. Here is how we help you trade smarter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}