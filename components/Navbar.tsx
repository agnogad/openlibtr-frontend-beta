'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, MessageSquare, Home, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Kütüphane', href: '/', icon: Home },
    { name: 'Geçmiş', href: '/history', icon: History },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left: Nav Items (Desktop Only) */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-[#8E8E93] hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                <span className="text-white">OpenLib<span className="text-primary">TR</span></span>
              </Link>
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-3 md:gap-5 ml-auto md:ml-0">
              <a
                href="https://discord.gg/vPjmyZtkpr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#8E8E93] hover:text-white transition-colors"
                title="Discord"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/agnogad/openlibtr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#8E8E93] hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#121212]/80 backdrop-blur-2xl border-t border-white/10">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-[#8E8E93] hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
