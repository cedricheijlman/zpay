import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ZPay - Your Payment Solution your business needs',
  description: 'ZPay - Your Payment Solution for your business needs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {' '}
        <Toaster richColors position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
