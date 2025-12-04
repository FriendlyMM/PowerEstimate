import React, { useState } from 'react';
import { Appliance, SelectedAppliance } from '../types';
import { APPLIANCE_CATALOG } from '../constants';
import { Plus, Trash2, Calculator, Save, AlertCircle, Clock } from 'lucide-react';

interface LoadCalculatorProps {
  systemBackupHours: number;
  onApply: (peakKW: number, energyKWh: number) => void;
  onCancel: () => void;
}

const LoadCalculator: React.FC<LoadCalculatorProps> = ({ systemBackupHours, onApply, onCancel }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedAppliance[]>([]);
  const [selectedApplianceId, setSelectedApplianceId] = useState<string>(APPLIANCE_CATALOG[0].id);

  const addItem = () => {
    const appliance = APPLIANCE_CATALOG.find(a => a.id === selectedApplianceId);
    if (!appliance) return;

    const newItem: SelectedAppliance = {
      ...appliance,
      uniqueId: Date.now().toString() + Math.random().toString(),
      quantity: 1,
      userPowerWatts: appliance.defaultPowerWatts,
      runningHours: systemBackupHours, // Default to full system backup time
    };

    setSelectedItems([...selectedItems, newItem]);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.uniqueId !== id));
  };

  const updateItem = (id: string, field: keyof SelectedAppliance, value: number) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.uniqueId === id) {
        let updatedValue = value;
        // Constraint: Running hours cannot exceed system backup hours
        if (field === 'runningHours' && value > systemBackupHours) {
          updatedValue = systemBackupHours;
        }
        return { ...item, [field]: updatedValue };
      }
      return item;
    }));
  };

  // Calculate totals
  const totalPeakWatts = selectedItems.reduce((sum, item) => sum + (item.userPowerWatts * item.quantity), 0);
  const totalPeakKW = totalPeakWatts / 1000;

  const totalEnergyWh = selectedItems.reduce((sum, item) => sum + (item.userPowerWatts * item.quantity * item.runningHours), 0);
  const totalEnergyKWh = totalEnergyWh / 1000;

  const handleApply = () => {
    onApply(Number(totalPeakKW.toFixed(2)), Number(totalEnergyKWh.toFixed(2)));
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          Appliance Load Calculator
        </h3>
        <button onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700">
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 bg-white p-3 rounded-lg border border-slate-200 shadow-sm items-end">
        <div className="sm:col-span-10">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Select Appliance</label>
          <select
            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedApplianceId}
            onChange={(e) => setSelectedApplianceId(e.target.value)}
          >
            {APPLIANCE_CATALOG.map(app => (
              <option key={app.id} value={app.id}>
                {app.name} ({app.defaultPowerWatts}W)
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button
            onClick={addItem}
            className="w-full flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {selectedItems.length === 0 ? (
        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg mb-6">
          <p>No appliances added yet. Add items to calculate your backup load.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {selectedItems.map((item) => (
            <div key={item.uniqueId} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4">
                <span className="font-medium text-slate-800 text-sm">{item.name}</span>
                <div className="text-xs text-slate-400">{item.category}</div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.uniqueId, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full p-1 text-sm border border-slate-200 rounded"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Watts</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={item.userPowerWatts}
                  onChange={(e) => updateItem(item.uniqueId, 'userPowerWatts', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 text-sm border border-slate-200 rounded"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5 truncate" title={`Max: ${systemBackupHours}h`}>Run Hrs</label>
                <input
                  type="number"
                  min="0.1"
                  max={systemBackupHours}
                  step="0.5"
                  value={item.runningHours}
                  onChange={(e) => updateItem(item.uniqueId, 'runningHours', parseFloat(e.target.value) || 0)}
                  className="w-full p-1 text-sm border border-slate-200 rounded"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button 
                  onClick={() => removeItem(item.uniqueId)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 rounded-xl p-4 flex flex-col justify-center">
          <span className="block text-xs text-indigo-600 uppercase font-bold mb-1">Total Peak Load</span>
          <span className="text-2xl font-bold text-indigo-900">{totalPeakKW.toFixed(2)} kW</span>
          <span className="text-[10px] text-indigo-400">Used for Inverter Sizing</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col justify-center">
          <span className="block text-xs text-blue-600 uppercase font-bold mb-1">Total Energy</span>
          <span className="text-2xl font-bold text-blue-900">{totalEnergyKWh.toFixed(2)} kWh</span>
          <span className="text-[10px] text-blue-400">Used for Battery Sizing</span>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-4 p-3 bg-slate-100 rounded-lg">
          <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Running hours are limited to your target backup time ({systemBackupHours}h). 
            Adjust the main backup slider to increase this limit.
          </p>
      </div>

      <button
        onClick={handleApply}
        disabled={selectedItems.length === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
      >
        <Save className="w-5 h-5" />
        Apply Load Configuration
      </button>
    </div>
  );
};

export default LoadCalculator;