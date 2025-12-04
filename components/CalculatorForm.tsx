import React, { useState } from 'react';
import { UserRequirements, GridType } from '../types';
import { Zap, Clock, Calculator } from 'lucide-react';
import LoadCalculator from './LoadCalculator';

interface CalculatorFormProps {
  requirements: UserRequirements;
  onChange: (req: UserRequirements) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ requirements, onChange }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  
  const update = (field: keyof UserRequirements, value: number | string) => {
    onChange({ ...requirements, [field]: value });
  };

  const handleCalculatorApply = (peak: number, energy: number) => {
    onChange({
      ...requirements,
      peakLoadKW: peak,
      energyReqKWh: energy,
    });
    setShowCalculator(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-8">
      
      <div className="space-y-6">
        {/* Grid Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">System Phase</label>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
            <button
              onClick={() => update('gridType', GridType.SinglePhase)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                requirements.gridType === GridType.SinglePhase
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Single Phase
            </button>
            <button
              onClick={() => update('gridType', GridType.ThreePhase)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                requirements.gridType === GridType.ThreePhase
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Three Phase
            </button>
          </div>
        </div>

        {/* Load Calculator Toggle */}
        {!showCalculator ? (
            <button
                onClick={() => setShowCalculator(true)}
                className="w-full py-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-indigo-700 font-semibold flex items-center justify-center gap-2 transition-all"
            >
                <Calculator className="w-5 h-5" />
                Open Appliance Load Calculator
            </button>
        ) : (
            <LoadCalculator 
                systemBackupHours={requirements.backupHours}
                onApply={handleCalculatorApply} 
                onCancel={() => setShowCalculator(false)} 
            />
        )}

        {!showCalculator && (
          <>
            {/* Peak Load */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Backup Load (kW)
                </label>
                <span className="text-sm font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  {requirements.peakLoadKW} kW
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={requirements.peakLoadKW}
                onChange={(e) => update('peakLoadKW', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-xs text-slate-400 mt-1">Total power of appliances you want to run during a blackout.</p>
            </div>
          </>
        )}

        {/* Backup Duration */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Target Backup (Hours)
            </label>
            <span className="text-sm font-bold text-slate-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {requirements.backupHours} hrs
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="48"
            step="1"
            value={requirements.backupHours}
            onChange={(e) => update('backupHours', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">How long you need to run the selected appliances off batteries.</p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;