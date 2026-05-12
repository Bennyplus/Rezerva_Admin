/* ─── Admin Drivers Mock Data ─── */

/* ─── Types ─── */
export type DriverStatus = "Active" | "Inactive" | "Suspended";
export type AvailabilityStatus = "Available" | "On Trip" | "Offline";
export type LicenseStatus = "Valid" | "Expired";
export type BookingStatus = "Completed" | "Cancelled" | "In Progress";

export interface BookingRecord {
  id: string;
  vehicle: string;
  fromDate: string;
  toDate: string;
  status: BookingStatus;
}

export interface DriverDocument {
  label: string;
  filename: string;
  size: string; /* e.g. "120 KB" */
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
  email: string;
  licenseNo: string;
  licenseStatus: LicenseStatus;
  status: DriverStatus;
  availability: AvailabilityStatus;
  location: string;
  totalTrips: number;
  reports: number;
  currentBooking: string | null;
  assignedTrips: number;
  bookingHistory: BookingRecord[];
  documents: {
    driversLicense: DriverDocument;
    nin: DriverDocument;
    proofOfAddress: DriverDocument;
    nin2: DriverDocument;
  };
}

/* ─── Mock Drivers ─── */
export const ADMIN_DRIVERS: Driver[] = [
  {
    id: "drv-1",
    name: "Bessie Cooper",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.0,
    phone: "(252) 555-0126",
    email: "sara.cruz@example.com",
    licenseNo: "MP09ZD6142",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Abuja",
    totalTrips: 24,
    reports: 0,
    currentBooking: "ORDER-WD1234-23",
    assignedTrips: 20,
    bookingHistory: [
      { id: "DRF-12445-LLY", vehicle: "Toyota HighLander", fromDate: "22 Apr 2026", toDate: "30 May 2027", status: "Completed" },
      { id: "DRF-12445-LLY", vehicle: "Toyota HighLander", fromDate: "22 Apr 2026", toDate: "30 May 2027", status: "Completed" },
      { id: "DRF-11234-AAB", vehicle: "Honda CR-V", fromDate: "10 Mar 2026", toDate: "15 Mar 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-2",
    name: "Jacob Jones",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 5.0,
    phone: "(205) 555-0100",
    email: "alma.lawson@example.com",
    licenseNo: "GA03NH6589",
    licenseStatus: "Valid",
    status: "Inactive",
    availability: "Offline",
    location: "Lagos",
    totalTrips: 18,
    reports: 2,
    currentBooking: null,
    assignedTrips: 14,
    bookingHistory: [
      { id: "DRF-22200-XYZ", vehicle: "Ford Explorer", fromDate: "01 Jan 2026", toDate: "10 Jan 2026", status: "Completed" },
      { id: "DRF-22201-XYZ", vehicle: "Toyota Camry", fromDate: "15 Feb 2026", toDate: "20 Feb 2026", status: "Cancelled" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-3",
    name: "Courtney Henry",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 3.0,
    phone: "(307) 555-0133",
    email: "michael.mitc@example.com",
    licenseNo: "KA03CN8452",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Abuja",
    totalTrips: 31,
    reports: 1,
    currentBooking: "ORDER-XA9900-01",
    assignedTrips: 28,
    bookingHistory: [
      { id: "DRF-33300-QQQ", vehicle: "Lexus RX 350", fromDate: "05 Mar 2026", toDate: "12 Mar 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-4",
    name: "Jerome Bell",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.2,
    phone: "(603) 555-0123",
    email: "willie.jennings@example.com",
    licenseNo: "CG04RAI403",
    licenseStatus: "Expired",
    status: "Inactive",
    availability: "Offline",
    location: "Lagos",
    totalTrips: 9,
    reports: 3,
    currentBooking: null,
    assignedTrips: 7,
    bookingHistory: [
      { id: "DRF-44400-BBB", vehicle: "Kia Sorento", fromDate: "20 Feb 2026", toDate: "25 Feb 2026", status: "Cancelled" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-5",
    name: "Dianne Russell",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.5,
    phone: "(319) 555-0115",
    email: "kenzi.lawson@example.com",
    licenseNo: "CH01BR2047",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Abuja",
    totalTrips: 42,
    reports: 0,
    currentBooking: null,
    assignedTrips: 38,
    bookingHistory: [
      { id: "DRF-55500-CCC", vehicle: "Hyundai Tucson", fromDate: "01 Apr 2026", toDate: "07 Apr 2026", status: "Completed" },
      { id: "DRF-55501-CCC", vehicle: "Nissan X-Trail", fromDate: "12 Apr 2026", toDate: "16 Apr 2026", status: "In Progress" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-6",
    name: "Cameron Williamson",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 3.5,
    phone: "(201) 555-0124",
    email: "debbie.baker@example.com",
    licenseNo: "WB20LX7003",
    licenseStatus: "Valid",
    status: "Active",
    availability: "On Trip",
    location: "Lagos",
    totalTrips: 15,
    reports: 1,
    currentBooking: "ORDER-WB2024-06",
    assignedTrips: 12,
    bookingHistory: [
      { id: "DRF-66600-DDD", vehicle: "Toyota Prado", fromDate: "28 Mar 2026", toDate: "02 Apr 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-7",
    name: "Marvin McKinney",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.8,
    phone: "+7 (903) 880-91-85",
    email: "darz@aol.com",
    licenseNo: "1HGC M8263 3A123 456",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Lagos",
    totalTrips: 56,
    reports: 0,
    currentBooking: null,
    assignedTrips: 52,
    bookingHistory: [
      { id: "DRF-77700-EEE", vehicle: "Mercedes GLE", fromDate: "10 Apr 2026", toDate: "18 Apr 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-8",
    name: "Wade Warren",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.1,
    phone: "+7 (903) 941-02-27",
    email: "chronos@aol.com",
    licenseNo: "1HGC M8263 3A123 456",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Abuja",
    totalTrips: 28,
    reports: 0,
    currentBooking: null,
    assignedTrips: 25,
    bookingHistory: [
      { id: "DRF-88800-FFF", vehicle: "BMW X5", fromDate: "05 Apr 2026", toDate: "09 Apr 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "drv-9",
    name: "Eleanor Pena",
    avatar: "/images/admin/profile-Avatar.svg",
    rating: 4.6,
    phone: "+7 (903) 134-55-26",
    email: "mthurn@optonline.net",
    licenseNo: "1HGC M8263 3A123 456",
    licenseStatus: "Valid",
    status: "Active",
    availability: "Available",
    location: "Lagos",
    totalTrips: 37,
    reports: 0,
    currentBooking: null,
    assignedTrips: 34,
    bookingHistory: [
      { id: "DRF-99900-GGG", vehicle: "Audi Q7", fromDate: "01 May 2026", toDate: "05 May 2026", status: "Completed" },
    ],
    documents: {
      driversLicense: { label: "Drivers License", filename: "my-cv.pdf", size: "120 KB" },
      nin: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
      proofOfAddress: { label: "Proof Of Address", filename: "my-cv.pdf", size: "120 KB" },
      nin2: { label: "NIN", filename: "my-cv.pdf", size: "120 KB" },
    },
  },
];

/* ─── Driver stats for stat cards ─── */
export const DRIVER_STATS = [
  { id: "total", label: "Total Drivers", value: "144" },
  { id: "active", label: "Active Drivers", value: "98" },
  { id: "inactive", label: "Inactive Drivers", value: "34" },
  { id: "suspended", label: "Suspended Drivers", value: "12" },
];
