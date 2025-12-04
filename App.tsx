import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CalculatorForm from './components/CalculatorForm';
import RecommendationCard from './components/RecommendationCard';
import { UserRequirements, GridType, SystemConfiguration } from './types';
import { INVERTER_5_5KW, BATTERY_100AH, BATTERY_200AH } from './constants';
import { analyzeSystem } from './services/geminiService';
import { Sparkles, Sun, Info } from 'lucide-react';

const App: React.FC = () => {
  const [requirements, setRequirements] = useState<UserRequirements>({
    peakLoadKW: 8,
    backupHours: 4,
    gridType: GridType.SinglePhase
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [debouncedReqs, setDebouncedReqs] = useState(requirements);

  // Debounce effect for AI calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedReqs(requirements);
    }, 1500); // Wait 1.5s after user stops interacting
    return () => clearTimeout(timer);
  }, [requirements]);

  const calculateConfig = useCallback((reqs: UserRequirements, batteryModel: typeof BATTERY_100AH | typeof BATTERY_200AH): SystemConfiguration => {
    // 1. Inverter Calculation
    let invCount = Math.ceil(reqs.peakLoadKW / INVERTER_5_5KW.capacity);
    if (invCount < 1) invCount = 1;

    // 3-Phase Logic: Must be multiples of 3 for balanced operation, or at least 3.
    if (reqs.gridType === GridType.ThreePhase) {
      if (invCount < 3) invCount = 3;
      else {
        // Ensure multiple of 3
        const remainder = invCount % 3;
        if (remainder !== 0) {
          invCount += (3 - remainder);
        }
      }
    }

    const totalInvPower = invCount * INVERTER_5_5KW.capacity;

    // 2. Battery Calculation
    // Use the detailed calculated energy (if available) or estimate based on Peak * Hours
    const requiredStorageKWh = reqs.energyReqKWh !== undefined 
      ? reqs.energyReqKWh 
      : reqs.peakLoadKW * reqs.backupHours;
    
    // Depth of Discharge (DoD) is 80%
    const dod = 0.8;
    const targetStorageKWh = requiredStorageKWh / dod;

    let batCount = Math.ceil(targetStorageKWh / batteryModel.capacity);
    if (batCount < 1) batCount = 1;

    const totalBatCapacity = batCount * batteryModel.capacity;
    
    // Estimated Autonomy
    // If we have a specific energy profile (energyReqKWh), the autonomy is tricky to express in hours because load varies.
    // Standard approach: Autonomy = Capacity / Load.
    // We will use Peak Load for conservative estimation, but practically it might be longer if the pump turns off.
    const estimatedAutonomy = (totalBatCapacity * dod) / (reqs.peakLoadKW || 1); 

    return {
      inverterCount: invCount,
      inverterType: INVERTER_5_5KW,
      batteryCount: batCount,
      batteryType: batteryModel,
      totalCapacityKWh: totalBatCapacity,
      totalPowerKW: totalInvPower,
      estimatedAutonomy
    };
  }, []);

  const config100 = useMemo(() => calculateConfig(requirements, BATTERY_100AH), [requirements, calculateConfig]);
  const config200 = useMemo(() => calculateConfig(requirements, BATTERY_200AH), [requirements, calculateConfig]);

  // Determine "Best" config to send to AI (usually the one with fewer batteries or better fit)
  const bestConfig = config200.batteryCount <= config100.batteryCount ? config200 : config100;

  useEffect(() => {
    // Call AI when debounced requirements change
    const fetchAnalysis = async () => {
        setLoadingAi(true);
        // Recalculate best config for the debounced state
        const cfg100 = calculateConfig(debouncedReqs, BATTERY_100AH);
        const cfg200 = calculateConfig(debouncedReqs, BATTERY_200AH);
        const best = cfg200.batteryCount <= cfg100.batteryCount ? cfg200 : cfg100;

        const text = await analyzeSystem(best, debouncedReqs);
        setAiAnalysis(text);
        setLoadingAi(false);
    };

    if (process.env.API_KEY) {
        fetchAnalysis();
    } else {
        setAiAnalysis("Gemini API Key not found. Please add API_KEY to metadata.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReqs]);


  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg text-white">
              <Sun className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">LSHE MSP</h1>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600">Need Help?</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Build Your Perfect Energy System
          </h2>
          <p className="text-lg text-slate-600">
            Tell us about your energy needs during backup, and we'll calculate the optimal inverter and battery combination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <CalculatorForm requirements={requirements} onChange={setRequirements} />
            
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="font-bold text-lg">AI Energy Consultant</h3>
              </div>
              <div className="prose prose-invert prose-sm min-h-[100px]">
                {loadingAi ? (
                  <div className="flex flex-col gap-2 animate-pulse">
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-full"></div>
                    <div className="h-2 bg-white/20 rounded w-5/6"></div>
                  </div>
                ) : (
                  <p className="text-indigo-100 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-sm">We found 2 viable configurations for you.</span>
            </div>

            <RecommendationCard 
                config={bestConfig.batteryType.id === BATTERY_200AH.id ? config200 : config100} 
                requirements={requirements} 
            />
            
            {/* Secondary Option */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
               <RecommendationCard 
                config={bestConfig.batteryType.id === BATTERY_200AH.id ? config100 : config200} 
                requirements={requirements}
                isCompact={true}
            />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;