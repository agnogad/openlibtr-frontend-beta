'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, BookOpen, Heart, Bell, ChevronRight, LogIn, UserPlus, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { PromoBanners } from '@/components/PromoBanners';
import { cn } from '@/lib/utils';
import { ProxyProvider, ProxyConfig } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('openlibtr_proxy_config');
      return saved ? JSON.parse(saved) : { enabled: false, provider: 'gh-proxy.com' };
    }
    return { enabled: false, provider: 'gh-proxy.com' };
  });

  const updateProxyConfig = (updates: Partial<ProxyConfig>) => {
    const newConfig = { ...proxyConfig, ...updates };
    setProxyConfig(newConfig);
    localStorage.setItem('openlibtr_proxy_config', JSON.stringify(newConfig));
  };

  const proxyProviders: ProxyProvider[] = ['fastgit.cc', 'gh.llkk.cc', 'gh-proxy.com', 'ghproxy.net'];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [activeColor, setActiveColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-primary-color') || '#007AFF';
    }
    return '#007AFF';
  });

  const themeColors = [
    { name: 'Mavi', color: '#007AFF' },
    { name: 'Yeşil', color: '#34C759' },
    { name: 'Turuncu', color: '#FF9500' },
    { name: 'Kırmızı', color: '#FF3B30' },
    { name: 'Mor', color: '#AF52DE' },
    { name: 'Pembe', color: '#FF2D55' },
    { name: 'Sarı', color: '#FFCC00' },
    { name: 'Gri', color: '#8E8E93' },
  ];

  const changeThemeColor = (color: string) => {
    setActiveColor(color);
    localStorage.setItem('theme-primary-color', color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--ring', color);
    // Also set the Tailwind 4 specific variables just in case
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-accent', color);
    document.documentElement.style.setProperty('--color-ring', color);
  };

  const menuItems = [
    { icon: Heart, name: 'Favorilerim', count: '0' },
    { icon: BookOpen, name: 'Okuma Listelerim', count: '0' },
    { icon: Bell, name: 'Bildirimler', count: '0' },
    { icon: Settings, name: 'Ayarlar', count: null },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
      </header>

      {!user ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-[#121212] border border-white/10 text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Henüz giriş yapmadınız</h2>
            <p className="text-[#8E8E93]">Favorilerinizi kaydetmek ve okuma geçmişinizi senkronize etmek için giriş yapın.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-5 h-5" />
              <span>Giriş Yap</span>
            </Link>
            <Link
              href="/signup"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Kayıt Ol</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-[#121212] border border-white/10 flex items-center gap-6 shadow-xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
              {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.user_metadata?.full_name || 'Kullanıcı'}</h2>
              <p className="text-[#8E8E93]">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                Üye
              </div>
            </div>
          </motion.div>

          {/* Menu Items */}
          <div className="grid gap-3">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-[#121212] border border-white/10 hover:bg-[#1c1c1e] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-[#8E8E93] group-hover:text-primary transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.count !== null && item.count !== '0' && (
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#8E8E93] group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-4"
          >
            <h3 className="font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Tema Rengi
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {themeColors.map((theme) => (
                <button
                  key={theme.color}
                  onClick={() => changeThemeColor(theme.color)}
                  className="group relative flex flex-col items-center gap-2"
                  title={theme.name}
                >
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all group-hover:scale-110 group-active:scale-95 flex items-center justify-center",
                      activeColor === theme.color ? "border-white scale-110 shadow-lg shadow-white/10" : "border-white/10"
                    )}
                    style={{ backgroundColor: theme.color }}
                  >
                    {activeColor === theme.color && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Proxy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Proxy Ayarları
              </h3>
              <button
                onClick={() => updateProxyConfig({ enabled: !proxyConfig.enabled })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  proxyConfig.enabled ? "bg-primary" : "bg-white/10"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    proxyConfig.enabled ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {proxyConfig.enabled && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Proxy Sağlayıcı Seçin</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {proxyProviders.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => updateProxyConfig({ provider })}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border",
                        proxyConfig.provider === provider
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white/5 border-transparent text-[#8E8E93] hover:text-white hover:bg-white/10"
                      )}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#8E8E93] leading-relaxed">
                  Not: Proxy ayarları GitHub üzerinden çekilen kütüphane, kapak resimleri ve bölüm içerikleri için geçerlidir.
                </p>
              </div>
            )}
          </motion.div>

          <PromoBanners />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-bold hover:bg-destructive/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </div>
  );
}
