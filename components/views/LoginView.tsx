'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface LoginViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onNavigate('PROFILE');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'GitHub ile giriş yapılırken bir hata oluştu.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#121212] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz</h1>
          <p className="text-[#8E8E93]">Hesabınıza giriş yapın</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#8E8E93] ml-1">E-posta</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full h-12 pl-12 pr-4 bg-[#1c1c1e] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#8E8E93] ml-1">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-4 bg-[#1c1c1e] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121212] px-2 text-[#8E8E93]">Veya şununla devam et</span>
          </div>
        </div>

        <button
          onClick={handleGithubLogin}
          className="w-full h-12 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
        >
          <Github className="w-5 h-5" />
          <span>GitHub ile Giriş Yap</span>
        </button>

        <p className="text-center mt-8 text-[#8E8E93]">
          Hesabınız yok mu?{' '}
          <button onClick={() => onNavigate('SIGNUP')} className="text-primary font-bold hover:underline">
            Kayıt Ol
          </button>
        </p>
      </motion.div>
    </div>
  );
}
