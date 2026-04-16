import type {Metadata} from 'next';
import './globals.css';
import { ThemeInitializer } from '@/components/ThemeInitializer';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'OpenLibTR - Light Novel Reader',
  description: 'Modern ve karanlık mod odaklı Light Novel okuma platformu.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" className="dark">
      <body suppressHydrationWarning className="min-h-screen pt-24 pb-32 md:pb-0">
        <ThemeInitializer />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
