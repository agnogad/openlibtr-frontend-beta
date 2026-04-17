'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Search, Library, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  onNavigate?: (view: string, params?: any) => void;
  currentView?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const Logo = ({ onNavigate }: { onNavigate?: (view: string, params?: any) => void }) => (
  <Link 
    href="/" 
    onClick={(e) => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate('LIBRARY');
      }
    }}
    className="group flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
  >
    <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl transition-transform group-hover:rotate-6">
      <Library className="w-5 h-5 text-white" />
    </div>
    <span className="text-lg font-display font-black tracking-tight text-white">OpenLib<span className="text-primary">TR</span></span>
  </Link>
);

export function Navbar({ onNavigate, currentView, searchQuery, setSearchQuery }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const desktopNavItems = [
    { name: 'Kütüphane', href: '/', icon: Home, view: 'LIBRARY' },
    { name: 'Geçmiş', href: '/history', icon: History, view: 'HISTORY' },
    { name: 'Profil', href: '/profile', icon: User, view: 'PROFILE' },
  ];

  // Mobile order: Library, Profile, History
  const mobileNavItems = [
    { name: 'Kütüphane', href: '/', icon: Home, view: 'LIBRARY' },
    { name: 'Profil', href: '/profile', icon: User, view: 'PROFILE' },
    { name: 'Geçmiş', href: '/history', icon: History, view: 'HISTORY' },
  ];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.view);
    }
  };

  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-4">
          <div className="glass h-16 md:h-18 rounded-[2rem] flex items-center justify-between px-6 shadow-2xl shadow-black/40">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between w-full relative h-full">
              {/* Left Side */}
              <div className="flex-1 flex items-center">
                {user ? (
                  <div className="flex items-center gap-10">
                    {desktopNavItems.map((item) => {
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
                ) : (
                  <Logo onNavigate={onNavigate} />
                )}
              </div>

              {/* Center Logo (Only when logged in) */}
              {user && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Logo onNavigate={onNavigate} />
                </div>
              )}

              {/* Right Side */}
              <div className="flex-1 flex items-center justify-end gap-4">
                <div className={cn(
                  "relative flex items-center transition-all duration-300",
                  isSearchOpen ? "w-full md:w-64" : "w-10"
                )}>
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.input
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        type="text"
                        placeholder="Ara..."
                        value={searchQuery || ''}
                        onChange={(e) => {
                          setSearchQuery?.(e.target.value);
                          if (currentView !== 'LIBRARY') {
                            onNavigate?.('LIBRARY');
                          }
                        }}
                        autoFocus
                        className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs font-bold"
                      />
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={cn(
                      "p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all",
                      isSearchOpen ? "absolute left-0 border-none bg-transparent" : ""
                    )}
                  >
                    <Search className="w-5 h-5 text-[#8E8E93]" />
                  </button>
                </div>
                
                {!user && (
                  <button 
                    onClick={() => onNavigate?.('LOGIN')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Layout (Logo Only) */}
            <div className="md:hidden flex items-center justify-between w-full">
              <Logo onNavigate={onNavigate} />
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (!isSearchOpen && currentView !== 'LIBRARY') {
                      onNavigate?.('LIBRARY');
                    }
                  }}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isSearchOpen ? "bg-primary text-white" : "bg-white/5 border border-white/5 text-[#8E8E93]"
                  )}
                >
                  <Search className="w-5 h-5" />
                </button>
                {!user && (
                  <button 
                    onClick={() => onNavigate?.('LOGIN')}
                    className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
                  >
                    <LogIn className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Input - Moved outside h-20 to allow expansion */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                className="md:hidden w-full pb-6"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="text"
                    placeholder="Binlerce bölüm arasında ara..."
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery?.(e.target.value)}
                    autoFocus
                    className="w-full h-14 pl-12 pr-4 bg-white/5 border border-primary/20 rounded-2xl focus:outline-none focus:border-primary/50 text-sm font-bold shadow-2xl shadow-primary/5"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Bottom Tab Bar (Mobile Only) */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl shadow-black h-20 flex items-center justify-around px-4">
          {mobileNavItems.map((item) => {
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
