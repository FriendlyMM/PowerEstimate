import React from 'react';
import { SystemConfiguration } from '../types';
import { Zap, BatteryCharging, Box, CheckCircle2 } from 'lucide-react';
import SystemVisualizer from './SystemVisualizer';
import { UserRequirements } from '../types';

interface RecommendationCardProps {
  config: SystemConfiguration;
  requirements: UserRequirements;
  isCompact?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ config, requirements, isCompact = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 ${isCompact ? 'border-slate-100' : 'border-emerald-500 relative overflow-hidden'}`}>
      
      {!isCompact && (
        <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 absolute top-0 right-0 rounded-bl-xl">
          RECOMMENDED CHOICE
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {isCompact ? 'Performance Option' : 'Balanced Option'}
          </h3>
          <p className="text-slate-500 text-sm">
            Optimized for {requirements.gridType} reliability.
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Inverter Section */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Inverter System</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{config.inverterCount}x</span>
                <span className="text-lg font-medium text-slate-600">{config.inverterType.capacity}kW</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{config.inverterType.name}</p>
              <div className="mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block">
                Total Output: <span className="font-bold">{config.totalPowerKW.toFixed(1)} kW</span>
              </div>
            </div>
          </div>

          {/* Battery Section */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Battery Storage</p>
               <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{config.batteryCount}x</span>
                <span className="text-lg font-medium text-slate-600">{config.batteryType.ampHours}Ah</span>
              </div>
               <p className="text-sm text-slate-500 mt-1">{config.batteryType.name}</p>
              <div className="mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block">
                Total Storage: <span className="font-bold">{config.totalCapacityKWh.toFixed(1)} kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Summary */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <SystemVisualizer config={config} requirements={requirements} />
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Capable of handling {config.totalPowerKW >= requirements.peakLoadKW ? '100%' : `${Math.round((config.totalPowerKW/requirements.peakLoadKW)*100)}%`} of your peak load</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Provides approx. {config.estimatedAutonomy.toFixed(1)} hours of backup</span>
          </li>
           <li className="flex items-center gap-2 text-sm text-slate-600">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Modular design allows future expansion</span>
          </li>
        </ul>

      </div>
    </div>
  );
};

export default RecommendationCard;
