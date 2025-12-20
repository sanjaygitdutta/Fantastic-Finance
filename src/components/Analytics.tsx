import { useState, useEffect } from 'react';
import { Grid, Activity, Calculator } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import OptionChain from './OptionChain';
import MarketHeatmap from './MarketHeatmap';
import PCRAnalysis from './PCRAnalysis';
import BlackScholesCalculator from './BlackScholesCalculator';
import PerformanceMetrics from './PerformanceMetrics';
import AdSlot from './AdSlot';

type Tab = 'chain' | 'heatmap' | 'pcr' | 'calculator' | 'metrics';

export default function Analytics() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') as Tab | null;
    const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'chain');

    useEffect(() => {
        if (tabParam && ['chain', 'heatmap', 'pcr', 'calculator', 'metrics'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Market Analytics</h1>
                    <p className="text-slate-500">Advanced derivatives data and market visualization</p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('chain')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'chain' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        Option Chain
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'calculator' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Calculator className="w-4 h-4" />
                        BS Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab('metrics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'metrics' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        Performance Metrics
                    </button>
                    <button
                        onClick={() => setActiveTab('heatmap')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'heatmap' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Grid className="w-4 h-4" />
                        Heatmap
                    </button>
                    <button
                        onClick={() => setActiveTab('pcr')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${activeTab === 'pcr' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        PCR Analysis
                    </button>
                </div>
            </div>

            <div className="min-h-[600px]">
                {activeTab === 'chain' && <OptionChain />}
                {activeTab === 'calculator' && <BlackScholesCalculator />}
                {activeTab === 'metrics' && <PerformanceMetrics />}
                {activeTab === 'heatmap' && <MarketHeatmap />}
                {activeTab === 'pcr' && <PCRAnalysis />}
            </div>

            {/* AdSense Display Ad */}
            <AdSlot slot="analytics-bottom" format="horizontal" className="mt-6" />
        </div>
    );
}
