'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Search, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate?: (view: string, params?: any) => void;
  currentView?: string;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Kütüphane', href: '/', icon: Home, view: 'LIBRARY' },
    { name: 'Geçmiş', href: '/history', icon: History, view: 'HISTORY' },
    { name: 'Profil', href: '/profile', icon: User, view: 'PROFILE' },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.view);
    }
  };

  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-20 relative">
            {/* Left: Nav Items (Desktop Only) */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = onNavigate ? currentView === item.view : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={cn(
                      "flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all relative py-2",
                      isActive ? "text-primary" : "text-[#8E8E93] hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link 
                href="/" 
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('LIBRARY');
                  }
                }}
                className="group flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase">
                  OpenLib<span className="text-primary">TR</span>
                </span>
              </Link>
            </div>

            {/* Right: Search Toggle or User Action (Placeholder) */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <Search className="w-5 h-5 text-[#8E8E93]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar (Mobile Only) */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl shadow-black h-20 flex items-center justify-around px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = onNavigate ? currentView === item.view : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 transition-all w-16 h-16 rounded-2xl",
                  isActive ? "text-primary bg-primary/10" : "text-[#8E8E93]"
                )}
              >
                <Icon className={cn("transition-transform", isActive ? "w-6 h-6 scale-110" : "w-5 h-5")} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
