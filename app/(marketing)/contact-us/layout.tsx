import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Drifully',
  description: 'Questions, issues, or special requests? Reach out and we\'ll get back to you quickly.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
