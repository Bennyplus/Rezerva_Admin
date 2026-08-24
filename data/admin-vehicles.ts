/* ─── Admin Vehicles Data & Types ─── */

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

export interface VehicleDocument {
  document_type: string;
  file: string;
  expires_on: string | null;
  verified: boolean;
  uploaded_at: string;
}

export interface AdminVehicle {
  id?: number | string;
  name: string;
  brand: string;
  driverName?: string;
  plateNumber?: string;
  image: string;
  images?: { image: string; is_primary: boolean }[];
  category: string;
  dailyPrice: number;
  capacity: number;
  status: "Available" | "Maintenance" | "Booked" | "Inactive";
  chassisNo: string;
  location: string;
  documents?: VehicleDocument[];
}

export const ADMIN_VEHICLES: AdminVehicle[] = [
  {
    name: "Toyota Camry",
    brand: "Toyota",
    driverName: "Fade Bayo",
    plateNumber: "KTU-812-FP",
    image: "/images/3rd-img.png",
    category: "Sedan",
    dailyPrice: 3000,
    capacity: 4,
    status: "Available",
    chassisNo: "KTU-812-FP",
    location: "Lagos",
    documents: [
      {
        document_type: "INSURANCE",
        file: "https://prosper-django-bucket.s3.amazonaws.com/media/vehicle_documents/Screenshot_2026-06-29_141214_8PFidYi.png",
        expires_on: null,
        verified: false,
        uploaded_at: "2026-07-22T14:17:44.645976Z"
      }
    ]
  }
];
