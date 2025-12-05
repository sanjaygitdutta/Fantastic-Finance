import { PieChart, DollarSign, BarChart3, Home } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: DollarSign,
      title: 'Wealth Management',
      description: 'Comprehensive wealth management strategies to grow and protect your assets over time.'
    },
    {
      icon: PieChart,
      title: 'Portfolio Management',
      description: 'Professionally managed investment portfolios tailored to your risk profile and goals.'
    },
    {
      icon: BarChart3,
      title: 'Tax Planning',
      description: 'Strategic tax optimization to minimize your tax burden and maximize returns.'
    },
    {
      icon: Home,
      title: 'Real Estate Advisory',
      description: 'Expert guidance on real estate investments and property portfolio management.'
    }
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive financial solutions designed to help you achieve your wealth goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition bg-slate-50 hover:bg-blue-50"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}