'use client';

import { useState, useEffect } from 'react';
import { User, Settings, LogOut, BookOpen, Heart, Bell, ChevronRight, LogIn, UserPlus, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { PromoBanners } from '@/components/PromoBanners';
import { cn } from '@/lib/utils';
import { ProxyProvider, ProxyConfig } from '@/lib/api';

interface ProfileViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export function ProfileView({ onNavigate }: ProfileViewProps) {
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
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-display font-black uppercase tracking-tight">Profil</h1>
      </header>

      {!user ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 text-center space-y-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto rotate-3">
            <User className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-display font-black uppercase tracking-tight">Giriş Yapılmadı</h2>
            <p className="text-sm text-[#8E8E93] max-w-sm mx-auto leading-relaxed">Favorilerinizi kaydetmek ve okuma geçmişinizi tüm cihazlarınızda senkronize etmek için hesabınıza bağlanın.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => onNavigate('LOGIN')}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span>Giriş Yap</span>
            </button>
            <button
              onClick={() => onNavigate('SIGNUP')}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Kayıt Ol</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            <div className="w-28 h-28 rounded-3xl bg-white/10 flex items-center justify-center text-4xl font-display font-black text-white shadow-2xl shadow-white/5 rotate-2 group-hover:rotate-0 transition-transform duration-500">
              {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-display font-black uppercase tracking-tight">{user.user_metadata?.full_name || 'Kullanıcı'}</h2>
                <p className="text-sm font-black tracking-widest text-[#8E8E93] uppercase opacity-60">{user.email}</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-white/60 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Daimi Üye
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-[#8E8E93] group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.count !== null && item.count !== '0' && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary text-white shadow-lg shadow-primary/20 uppercase">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#444] group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">Kişiselleştirme</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444]">Tema Rengi Seçin</p>
              <div className="flex flex-wrap gap-3">
                {themeColors.map((theme) => (
                  <button
                    key={theme.color}
                    onClick={() => changeThemeColor(theme.color)}
                    className="group relative"
                    title={theme.name}
                  >
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center",
                        activeColor === theme.color 
                          ? "border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                      )}
                      style={{ backgroundColor: theme.color }}
                    >
                      {activeColor === theme.color && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-inner" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-display font-black uppercase tracking-tight">Bağlantı Ayarları</h3>
              </div>
              <button
                onClick={() => updateProxyConfig({ enabled: !proxyConfig.enabled })}
                className={cn(
                  "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-500 focus:outline-none",
                  proxyConfig.enabled ? "bg-primary shadow-[0_0_15px_rgba(255,100,0,0.3)]" : "bg-white/10"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-500 shadow-md",
                    proxyConfig.enabled ? "translate-x-8" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {proxyConfig.enabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="h-[1px] w-full bg-white/5" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#444]">GitHub Proxy Sağlayıcılar</p>
                <div className="grid grid-cols-2 gap-3">
                  {proxyProviders.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => updateProxyConfig({ provider })}
                      className={cn(
                        "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center border-2",
                        proxyConfig.provider === provider
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white/5 border-transparent text-[#444] hover:text-white hover:bg-white/10"
                      )}
                    >
                      {provider.split('.')[0]}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground italic text-center">İçerik yükleme hataları alıyorsanız farklı bir sağlayıcı deneyin.</p>
              </div>
            )}
          </motion.div>

          <PromoBanners />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-destructive/5 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-[0.2em] hover:bg-destructive hover:text-white transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Oturumu Kapat</span>
          </button>
        </div>
      )}
    </div>
  );
}
