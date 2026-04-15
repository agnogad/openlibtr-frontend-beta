'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, BookOpen, Heart, Bell, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { PromoBanners } from '@/components/PromoBanners';

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

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
