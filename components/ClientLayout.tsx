'use client';

import { Navbar } from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  // Reader page pattern: /novel/[slug]/[chapterId]
  const isReaderPage = pathname?.includes('/novel/') && pathname?.split('/').filter(Boolean).length === 3;

  return (
    <>
      {!isReaderPage && !isHomePage && <Navbar />}
      <main className={isReaderPage ? "max-w-3xl mx-auto px-6 py-8 -mt-20" : isHomePage ? "" : "max-w-5xl mx-auto px-6 md:px-10 py-8"}>
        {children}
      </main>
    </>
  );
}
