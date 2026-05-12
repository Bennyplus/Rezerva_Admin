/* ─── Admin Customers Mock Data ─── */

export type VerificationStatus = "Verified" | "Pending Verification" | "Suspended";
export type BookingStatus = "Active" | "Completed" | "Cancelled";
export type BookingType = "Chauffeur" | "Self Drive";

export interface CustomerBooking {
  id: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  amountPaid: string;
  bookingType: BookingType;
  status: BookingStatus;
}

export interface CustomerActivity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface CustomerDocument {
  filename: string;
  size: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  emergencyContact: string;
  licenseStatus: "Valid" | "Expired";
  address: string;
  verificationStatus: VerificationStatus;
  totalBookings: number;
  flagsCount: number;
  bookings: CustomerBooking[];
  activityLog: CustomerActivity[];
  documents: {
    driversLicense: CustomerDocument;
    citizenshipDocument: CustomerDocument;
  };
}

/* ─── Mock Customers ─── */
export const ADMIN_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Bessie Cooper",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(252) 555-0126",
    email: "sara.cruz@example.com",
    emergencyContact: "+2342398472047",
    licenseStatus: "Valid",
    address: "42 Montgomery Road Yaba, Lagos , Nigeria 100254",
    verificationStatus: "Verified",
    totalBookings: 492,
    flagsCount: 2,
    bookings: [
      { id: "(252) 555-0126", vehicle: "Toyota HighLander", startDate: "22 Apr 2026", endDate: "6 May 2027", amountPaid: "$1,200,000.00", bookingType: "Chauffeur", status: "Active" },
      { id: "BK-10024", vehicle: "Honda CR-V", startDate: "10 Mar 2026", endDate: "15 Mar 2026", amountPaid: "$85,000.00", bookingType: "Self Drive", status: "Completed" },
    ],
    activityLog: [
      { id: "act-1", action: "Booking Created", timestamp: "22 Apr 2026, 10:30 AM", details: "Booked Toyota HighLander" },
      { id: "act-2", action: "Profile Updated", timestamp: "20 Apr 2026, 02:15 PM", details: "Updated phone number" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "cust-2",
    name: "Jacob Jones",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(205) 555-0100",
    email: "alma.lawson@example.com",
    emergencyContact: "+2341234567890",
    licenseStatus: "Valid",
    address: "15 Allen Avenue Ikeja, Lagos, Nigeria 100001",
    verificationStatus: "Pending Verification",
    totalBookings: 426,
    flagsCount: 0,
    bookings: [
      { id: "BK-20041", vehicle: "Ford Explorer", startDate: "01 Jan 2026", endDate: "10 Jan 2026", amountPaid: "$150,000.00", bookingType: "Chauffeur", status: "Completed" },
    ],
    activityLog: [
      { id: "act-3", action: "Registration", timestamp: "15 Dec 2025, 09:00 AM", details: "Account created" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "cust-3",
    name: "Courtney Henry",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(307) 555-0133",
    email: "michael.mitc@example.com",
    emergencyContact: "+2349012345678",
    licenseStatus: "Valid",
    address: "5 Broad Street Victoria Island, Lagos, Nigeria 101001",
    verificationStatus: "Verified",
    totalBookings: 647,
    flagsCount: 0,
    bookings: [
      { id: "BK-30077", vehicle: "Lexus RX 350", startDate: "05 Mar 2026", endDate: "12 Mar 2026", amountPaid: "$320,000.00", bookingType: "Chauffeur", status: "Completed" },
    ],
    activityLog: [
      { id: "act-4", action: "Booking Cancelled", timestamp: "12 Mar 2026, 11:00 AM", details: "Cancelled booking BK-30077" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "cust-4",
    name: "Jerome Bell",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(603) 555-0123",
    email: "willie.jennings@example.com",
    emergencyContact: "+2348109876543",
    licenseStatus: "Expired",
    address: "22 Adeniyi Jones Avenue Ikeja, Lagos, Nigeria 100281",
    verificationStatus: "Pending Verification",
    totalBookings: 429,
    flagsCount: 1,
    bookings: [
      { id: "BK-40088", vehicle: "Kia Sorento", startDate: "20 Feb 2026", endDate: "25 Feb 2026", amountPaid: "$95,000.00", bookingType: "Self Drive", status: "Cancelled" },
    ],
    activityLog: [
      { id: "act-5", action: "Document Upload", timestamp: "19 Feb 2026, 08:45 AM", details: "Uploaded citizenship document" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "cust-5",
    name: "Dianne Russell",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(319) 555-0115",
    email: "kenzi.lawson@example.com",
    emergencyContact: "+2347034567890",
    licenseStatus: "Valid",
    address: "10 Akin Adesola Street Victoria Island, Lagos, Nigeria 101241",
    verificationStatus: "Verified",
    totalBookings: 826,
    flagsCount: 0,
    bookings: [
      { id: "BK-50099", vehicle: "Hyundai Tucson", startDate: "01 Apr 2026", endDate: "07 Apr 2026", amountPaid: "$200,000.00", bookingType: "Self Drive", status: "Completed" },
    ],
    activityLog: [
      { id: "act-6", action: "Booking Created", timestamp: "01 Apr 2026, 07:30 AM", details: "Booked Hyundai Tucson" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
  {
    id: "cust-6",
    name: "Cameron Williamson",
    avatar: "/images/admin/profile-Avatar.svg",
    phone: "(201) 555-0124",
    email: "debbie.baker@example.com",
    emergencyContact: "+2348023456789",
    licenseStatus: "Valid",
    address: "3 Wole Olateju Crescent Lekki, Lagos, Nigeria 101245",
    verificationStatus: "Suspended",
    totalBookings: 600,
    flagsCount: 3,
    bookings: [
      { id: "BK-60012", vehicle: "Toyota Prado", startDate: "28 Mar 2026", endDate: "02 Apr 2026", amountPaid: "$450,000.00", bookingType: "Chauffeur", status: "Completed" },
    ],
    activityLog: [
      { id: "act-7", action: "Account Suspended", timestamp: "05 Apr 2026, 03:00 PM", details: "Suspended due to policy violation" },
    ],
    documents: {
      driversLicense: { filename: "my-cv.pdf", size: "120 KB" },
      citizenshipDocument: { filename: "my-cv.pdf", size: "120 KB" },
    },
  },
];
