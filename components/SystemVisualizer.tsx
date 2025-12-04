import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SystemConfiguration, UserRequirements } from '../types';

interface SystemVisualizerProps {
  config: SystemConfiguration;
  requirements: UserRequirements;
}

const SystemVisualizer: React.FC<SystemVisualizerProps> = ({ config, requirements }) => {
  const energyRequired = requirements.energyReqKWh ?? (requirements.peakLoadKW * requirements.backupHours);

  const data = [
    {
      name: 'Power (kW)',
      required: requirements.peakLoadKW,
      provided: config.totalPowerKW,
    },
    {
      name: 'Storage (kWh)',
      required: energyRequired,
      provided: config.totalCapacityKWh,
    },
  ];

  return (
    <div className="h-64 w-full">
       <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          layout="vertical"
        >
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="required" name="Your Need" fill="#94a3b8" barSize={20} radius={[0, 4, 4, 0]} />
          <Bar dataKey="provided" name="System Capacity" fill="#10b981" barSize={20} radius={[0, 4, 4, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.provided >= entry.required ? '#10b981' : '#fbbf24'} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-400 rounded-sm"></div>
          <span>Your Requirement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
          <span>System Capacity</span>
        </div>
      </div>
    </div>
  );
};

export default SystemVisualizer;