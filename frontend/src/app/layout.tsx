import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Traffic Enforcer — AI Traffic Violation Detection',
  description:
    'Enterprise-grade AI platform for automated traffic violation detection, license plate recognition, and evidence generation. Built for government agencies and traffic enforcement teams.',
  keywords: [
    'traffic violation detection',
    'AI enforcement',
    'license plate recognition',
    'computer vision',
    'traffic analytics',
  ],
  authors: [{ name: 'Traffic Enforcer Platform' }],
  openGraph: {
    title: 'Traffic Enforcer — AI Traffic Violation Detection',
    description: 'Automated traffic enforcement powered by computer vision and AI',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#0a0a0a]">{children}</body>
    </html>
  );
}
