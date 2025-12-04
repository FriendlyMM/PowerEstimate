export enum GridType {
  SinglePhase = 'Single Phase',
  ThreePhase = 'Three Phase'
}

export interface UserRequirements {
  peakLoadKW: number;
  backupHours: number;
  gridType: GridType;
  energyReqKWh?: number; // Calculated total energy requirement based on specific appliance run times
}

export interface Product {
  id: string;
  name: string;
  type: 'inverter' | 'battery';
  capacity: number; // kW for inverter, kWh for battery
  voltage?: number;
  ampHours?: number;
  imageUrl?: string;
  description: string;
}

export interface SystemConfiguration {
  inverterCount: number;
  batteryCount: number;
  batteryType: Product; // The selected battery model
  inverterType: Product;
  totalCapacityKWh: number;
  totalPowerKW: number;
  estimatedAutonomy: number; // hours
}

export interface Appliance {
  id: string;
  name: string;
  category: 'HVAC' | 'Kitchen' | 'Water' | 'Electronics' | 'Lighting' | 'Other';
  defaultPowerWatts: number;
}

export interface SelectedAppliance extends Appliance {
  uniqueId: string;
  quantity: number;
  userPowerWatts: number;
  runningHours: number;
}