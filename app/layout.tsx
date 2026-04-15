import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ThemeInitializer } from '@/components/ThemeInitializer';

export const metadata: Metadata = {
  title: 'OpenLibTR - Light Novel Reader',
  description: 'Modern ve karanlık mod odaklı Light Novel okuma platformu.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" className="dark">
      <body suppressHydrationWarning className="min-h-screen pt-16 pb-20 md:pb-0">
        <ThemeInitializer />
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
