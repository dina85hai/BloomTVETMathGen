import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BloomTVET MathGen',
  description: 'Research-aligned TVET mathematics question generator'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
