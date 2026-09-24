import type { Metadata } from 'next';
import { Inter, Hind_Siliguri, Anek_Bangla } from 'next/font/google';
import './globals.css';
import { Providers } from '@/context/Providers';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-anek-bangla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | BDNEEDS - Premium Multi-Category Shopping',
    default: 'BDNEEDS | Premium Multi-Category E-Commerce Platform',
  },
  description:
    'Explore curated collections across electronics, luxury fashion, footwear, beauty, accessories, and modern living.',
  keywords: [
    'ecommerce',
    'electronics',
    'fashion',
    'premium shopping',
    'BdNeeds',
    'luxury goods',
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindSiliguri.variable} ${anekBangla.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#0B132B]">
        <Providers>{children}</Providers>
        <WhatsAppWidget />
      </body>
    </html>
  );
}
