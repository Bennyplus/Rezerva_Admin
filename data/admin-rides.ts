/* ─── Admin Rides Data & Types ─── */

export interface Ride {
  id: string | number;
  driver: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: string;
  price: number;
  status: "Completed" | "Upcoming" | "Ongoing" | "Cancelled";
  date?: string;
  driverPhone?: string;
}

export interface RideStat {
  id: string;
  label: string;
  value: number | string;
}

export const RIDE_STATS_EMPTY: RideStat[] = [
  { id: "total-trips-created", label: "Total Trips Created", value: 0 },
  { id: "total-upcoming-trips", label: "Total Upcoming Trips", value: 0 },
  { id: "total-completed", label: "Total Completed", value: 0 },
  { id: "total-cancelled", label: "Total Cancelled", value: 0 },
];

export const RIDE_STATS_POPULATED: RideStat[] = [
  { id: "total-trips-created", label: "Total Trips Created", value: 142 },
  { id: "total-upcoming-trips", label: "Total Upcoming Trips", value: 38 },
  { id: "total-completed", label: "Total Completed", value: 89 },
  { id: "total-cancelled", label: "Total Cancelled", value: 15 },
];

export const ADMIN_RIDES: Ride[] = [
  {
    id: "RD-001",
    driver: "Henry, Arthur",
    origin: "8080 Railroad St.",
    destination: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    departureTime: "07:13 PM",
    availableSeats: "2/4",
    price: 11.70,
    status: "Completed",
    date: "2026-08-23",
    driverPhone: "+1 (555) 234-5678",
  },
  {
    id: "RD-002",
    driver: "Cooper, Kristin",
    origin: "7529 E. Pecan St.",
    destination: "4140 Parker Rd. Allentown, New Mexico 31134",
    departureTime: "10:41 PM",
    availableSeats: "1/4",
    price: 17.84,
    status: "Upcoming",
    date: "2026-08-23",
    driverPhone: "+1 (555) 345-6789",
  },
  {
    id: "RD-003",
    driver: "Flores, Juanita",
    origin: "3890 Poplar Dr.",
    destination: "2715 Ash Dr. San Jose, South Dakota 83475",
    departureTime: "03:48 AM",
    availableSeats: "1/2",
    price: 5.22,
    status: "Ongoing",
    date: "2026-08-23",
    driverPhone: "+1 (555) 456-7890",
  },
  {
    id: "RD-004",
    driver: "Miles, Esther",
    origin: "8558 Green Rd.",
    destination: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    departureTime: "01:08 PM",
    availableSeats: "3/3",
    price: 14.81,
    status: "Cancelled",
    date: "2026-08-23",
    driverPhone: "+1 (555) 567-8901",
  },
  {
    id: "RD-005",
    driver: "Black, Marvin",
    origin: "2464 Royal Ln.",
    destination: "6391 Elgin St. Celina, Delaware 10299",
    departureTime: "08:30 AM",
    availableSeats: "4/4",
    price: 22.50,
    status: "Upcoming",
    date: "2026-08-24",
    driverPhone: "+1 (555) 678-9012",
  },
  {
    id: "RD-006",
    driver: "Hawkins, Guy",
    origin: "1901 Thornridge Cir.",
    destination: "4517 Washington Ave. Manchester, Kentucky 39495",
    departureTime: "11:15 AM",
    availableSeats: "1/3",
    price: 9.99,
    status: "Ongoing",
    date: "2026-08-24",
    driverPhone: "+1 (555) 789-0123",
  },
  {
    id: "RD-007",
    driver: "Fox, Robert",
    origin: "3517 W. Gray St.",
    destination: "8502 Preston Rd. Inglewood, Maine 98380",
    departureTime: "04:20 PM",
    availableSeats: "2/4",
    price: 18.00,
    status: "Completed",
    date: "2026-08-24",
    driverPhone: "+1 (555) 890-1234",
  },
  {
    id: "RD-008",
    driver: "Simmons, Cody",
    origin: "4140 Parker Rd.",
    destination: "3890 Poplar Dr. San Jose, Illinois 85486",
    departureTime: "06:00 PM",
    availableSeats: "3/4",
    price: 13.45,
    status: "Upcoming",
    date: "2026-08-25",
    driverPhone: "+1 (555) 901-2345",
  },
  {
    id: "RD-009",
    driver: "Wilson, Jenny",
    origin: "775 Rolling Green Rd.",
    destination: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    departureTime: "09:45 PM",
    availableSeats: "2/2",
    price: 16.20,
    status: "Completed",
    date: "2026-08-25",
    driverPhone: "+1 (555) 012-3456",
  },
];
