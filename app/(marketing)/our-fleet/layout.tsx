import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Fleet | Premium Car Rentals & Chauffeur Services',
  description: 'Explore the Drifully fleet. Choose from luxury sedans, spacious SUVs, hatchbacks, and reliable vans for self-drive or chauffeur-driven journeys.',
};

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
