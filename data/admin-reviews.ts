export interface Review {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  reviewText: string;
  starRating: number;
  datePosted: string;
  status: "Published" | "Removed";
  
  // Related booking details
  bookingId: string;
  bookingDate: string;
  vehicleName: string;
  bookingType: string;
}

export const ADMIN_REVIEWS: Review[] = [
  {
    id: "REV-001",
    customerName: "Talking Thomas",
    phone: "+2348087364453",
    email: "Talkingtom@gmail.com",
    reviewText: "Lorem ipsum et odio netus nibh massa tellus sapien morbi diam amet amet eu morbi viverra donec in nulla in sit metus volutpat quis hendrerit etiam in commodo nunc lectus mi enim consectetur nibh viverra tincidunt cras nisi nisl in amet faucibus turpis quisque auctor lectus nulla in purus risus.",
    starRating: 4.5,
    datePosted: "14 May 2026",
    status: "Published",
    bookingId: "Toyota",
    bookingDate: "Camry 2026",
    vehicleName: "Sedan",
    bookingType: "Lagos",
  },
  {
    id: "REV-002",
    customerName: "Alyssa Sherman",
    phone: "+1234567890",
    email: "alyssa.s@example.com",
    reviewText: "Lorem ipsum et odio netus nibh massa tellus sapien morbi diam amet amet eu morbi viverra donec in nulla in sit metus volutpat quis hendrerit.",
    starRating: 1.5,
    datePosted: "22 Jun 2025",
    status: "Removed",
    bookingId: "Honda",
    bookingDate: "Civic 2024",
    vehicleName: "Compact",
    bookingType: "Abuja",
  },
  {
    id: "REV-003",
    customerName: "David Moon",
    phone: "+0987654321",
    email: "david.moon@example.com",
    reviewText: "Lorem ipsum et odio netus nibh massa tellus sapien morbi diam amet amet eu morbi viverra.",
    starRating: 1.2,
    datePosted: "1 Aug 2021",
    status: "Published",
    bookingId: "Ford",
    bookingDate: "Explorer 2022",
    vehicleName: "SUV",
    bookingType: "Port Harcourt",
  },
  {
    id: "REV-004",
    customerName: "Jeffry Graham",
    phone: "+1122334455",
    email: "j.graham@example.com",
    reviewText: "Lorem ipsum et odio netus nibh massa tellus sapien morbi diam amet amet eu morbi viverra donec in nulla in sit metus volutpat quis hendrerit etiam in commodo nunc lectus.",
    starRating: 1.5,
    datePosted: "29 Sept 2007",
    status: "Removed",
    bookingId: "Kia",
    bookingDate: "Sportage 2021",
    vehicleName: "SUV",
    bookingType: "Kano",
  },
  {
    id: "REV-005",
    customerName: "Allyson Choi",
    phone: "+5544332211",
    email: "allyson.choi@example.com",
    reviewText: "Lorem ipsum et odio netus nibh massa tellus sapien morbi diam amet amet eu morbi viverra donec in nulla in sit metus.",
    starRating: 1,
    datePosted: "25 Dec 2003",
    status: "Published",
    bookingId: "Toyota",
    bookingDate: "Corolla 2025",
    vehicleName: "Sedan",
    bookingType: "Lagos",
  }
];
