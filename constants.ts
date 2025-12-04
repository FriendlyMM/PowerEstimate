import { Product, Appliance } from './types';

export const INVERTER_5_5KW: Product = {
  id: 'inv-5.5',
  name: 'LSHE MSP 5.5kW Hybrid Inverter',
  type: 'inverter',
  capacity: 5.5,
  description: 'High-efficiency hybrid inverter. Parallel capable (up to 12 units). Supports 3-phase configuration.',
  imageUrl: 'https://picsum.photos/400/300?random=1'
};

export const BATTERY_100AH: Product = {
  id: 'bat-100',
  name: 'LSHE MSP 51.2V 100Ah',
  type: 'battery',
  capacity: 5.12, // 51.2 * 100 / 1000
  voltage: 51.2,
  ampHours: 100,
  description: 'Compact 5.12kWh rack-mount battery. Parallel scalable.',
  imageUrl: 'https://picsum.photos/400/300?random=2'
};

export const BATTERY_200AH: Product = {
  id: 'bat-200',
  name: 'LSHE MSP 51.2V 200Ah',
  type: 'battery',
  capacity: 10.24, // 51.2 * 200 / 1000
  voltage: 51.2,
  ampHours: 200,
  description: 'High-density 10.24kWh battery. Ideal for larger storage needs.',
  imageUrl: 'https://picsum.photos/400/300?random=3'
};

export const APPLIANCE_CATALOG: Appliance[] = [
  // HVAC
  { id: 'ac-1.0', name: 'Air Conditioner (1.0 HP)', category: 'HVAC', defaultPowerWatts: 750 },
  { id: 'ac-1.5', name: 'Air Conditioner (1.5 HP)', category: 'HVAC', defaultPowerWatts: 1100 },
  { id: 'ac-2.0', name: 'Air Conditioner (2.0 HP)', category: 'HVAC', defaultPowerWatts: 1500 },
  { id: 'fan', name: 'Ceiling Fan', category: 'HVAC', defaultPowerWatts: 60 },
  
  // Kitchen
  { id: 'fridge-std', name: 'Refrigerator (Standard)', category: 'Kitchen', defaultPowerWatts: 150 },
  { id: 'fridge-lrg', name: 'Refrigerator (Large/SBS)', category: 'Kitchen', defaultPowerWatts: 250 },
  { id: 'stove-1', name: 'Stove (1 Burner/Induction)', category: 'Kitchen', defaultPowerWatts: 1500 },
  { id: 'stove-2', name: 'Stove (2 Burner/Induction)', category: 'Kitchen', defaultPowerWatts: 3000 },
  { id: 'microwave', name: 'Microwave', category: 'Kitchen', defaultPowerWatts: 1000 },
  
  // Water
  { id: 'pump-0.5', name: 'Water Pump (0.5 HP)', category: 'Water', defaultPowerWatts: 375 },
  { id: 'pump-1.0', name: 'Water Pump (1.0 HP)', category: 'Water', defaultPowerWatts: 750 },
  { id: 'heater', name: 'Water Heater (Instant)', category: 'Water', defaultPowerWatts: 3500 },

  // Electronics & Lighting
  { id: 'tv', name: 'TV (LED)', category: 'Electronics', defaultPowerWatts: 100 },
  { id: 'wifi', name: 'WiFi Router', category: 'Electronics', defaultPowerWatts: 15 },
  { id: 'computer', name: 'Desktop Computer', category: 'Electronics', defaultPowerWatts: 200 },
  { id: 'lights-10', name: 'LED Lights (10 pack)', category: 'Lighting', defaultPowerWatts: 100 },
];
