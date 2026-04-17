import type {Metadata} from 'next';
import './globals.css';
import { ThemeInitializer } from '@/components/ThemeInitializer';
import { ClientLayout } from '@/components/ClientLayout';
import { cn } from '@/lib/utils';

import { Inter, Outfit, Lora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-reading',
});

export const metadata: Metadata = {
  title: 'OpenLibTR - Light Novel Reader',
  description: 'Modern ve karanlık mod odaklı Light Novel okuma platformu.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" className={cn("dark", inter.variable, outfit.variable, lora.variable)}>
      <body suppressHydrationWarning className="min-h-screen bg-[#0A0A0B] text-white pt-20 pb-32 md:pb-0 font-sans">
        <div className="atmosphere" />
        <ThemeInitializer />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
