import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Drifully | 24/7 Customer Support',
  description: 'Need help with your car rental or chauffeur service? Reach out to the Drifully support team for quick assistance, booking inquiries, or special requests.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
