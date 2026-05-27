/* ─── Admin Vehicles Mock Data ─── */

export const VEHICLE_STATS_EMPTY = [
  { id: "total-vehicles", label: "Total Vehicles", value: 0 },
  { id: "available-vehicles", label: "Available Vehicles", value: 0 },
  { id: "booked-vehicles", label: "Booked Vehicles", value: 0 },
  { id: "under-maintenance", label: "Under maintenance", value: 0 },
];

export const VEHICLE_STATS_POPULATED = [
  { id: "total-vehicles", label: "Total Vehicles", value: 200 },
  { id: "available-vehicles", label: "Available Vehicles", value: 117 },
  { id: "booked-vehicles", label: "Booked Vehicles", value: 13 },
  { id: "under-maintenance", label: "Under maintenance", value: 2 },
];

export interface AdminVehicle {
  id?: number;
  name: string;
  brand: string;
  image: string;
  category: string;
  dailyPrice: number;
  capacity: number;
  status: "Available" | "Maintenance" | "Booked" | "Inactive";
  chassisNo: string;
  location: string;
}

export const ADMIN_VEHICLES: AdminVehicle[] = [
  {
    name: "Reynard FF89 FF1600",
    brand: "Reynard",
    image: "/images/3rd-img.png",
    category: "Sports Car",
    dailyPrice: 3000,
    capacity: 4,
    status: "Available",
    chassisNo: "IHGCM826331D3456",
    location: "Lagos",
  },
  {
    name: "Toyota Highlander 2026",
    brand: "Toyota",
    image: "/images/5th-img.png",
    category: "Sedan",
    dailyPrice: 3000,
    capacity: 4,
    status: "Maintenance",
    chassisNo: "IHGCM826331D3456",
    location: "Abuja",
  },
  {
    name: "Lancia Delta Integrale ex Works, Unique",
    brand: "Lancia",
    image: "/images/4th-img.png",
    category: "Sedan",
    dailyPrice: 3000,
    capacity: 4,
    status: "Booked",
    chassisNo: "IHGCM826331D3456",
    location: "Lagos",
  },
  {
    name: "AIM Mychron3 XG LOG",
    brand: "AIM",
    image: "/images/6th-img.png",
    category: "Crossover",
    dailyPrice: 3000,
    capacity: 4,
    status: "Booked",
    chassisNo: "IHGCM826331D3456",
    location: "Abuja",
  },
  {
    name: "Aston Martin Vantage V12 GT3",
    brand: "Aston Martin",
    image: "/images/8th-img.png",
    category: "Sedan",
    dailyPrice: 3000,
    capacity: 4,
    status: "Maintenance",
    chassisNo: "IHGCM826331D3456",
    location: "Lagos",
  },
  {
    name: "Porsche 2012 GT3 Cup",
    brand: "Porsche",
    image: "/images/1st-img.png",
    category: "Light truck",
    dailyPrice: 3000,
    capacity: 4,
    status: "Available",
    chassisNo: "IHGCM826331D3456",
    location: "Abuja",
  },
  {
    name: "Camry 2026",
    brand: "Toyota",
    image: "/images/3rd-img.png",
    category: "Sedan",
    dailyPrice: 120,
    capacity: 4,
    status: "Available",
    chassisNo: "IHGCM82...",
    location: "Abuja",
  },
  {
    name: "Jeep Gladiator",
    brand: "Jeep",
    image: "/images/5th-img.png",
    category: "Sedan",
    dailyPrice: 120,
    capacity: 4,
    status: "Maintenance",
    chassisNo: "IHGCM82...",
    location: "Lagos",
  },
  {
    name: "Ford Cortina",
    brand: "Ford",
    image: "/images/4th-img.png",
    category: "Sedan",
    dailyPrice: 120,
    capacity: 4,
    status: "Booked",
    chassisNo: "IHGCM82...",
    location: "Abuja",
  },
];
