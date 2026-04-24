'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, X, Info } from 'lucide-react';

export function MigrationNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenNotice = localStorage.getItem('migration_notice_seen');
      if (!hasSeenNotice) {
        // Show after a short delay for better UX
        const timer = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('migration_notice_seen', 'true');
    }
  };

  const handleNavigate = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('migration_notice_seen', 'true');
      window.location.href = 'https://okuttur.web.app/';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 20, scale: 0.9 }}
           className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100] glass border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-5 space-y-4">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-display font-black tracking-tight text-white uppercase text-lg">Yeni Siteye Geçiş</h3>
                   </div>
                </div>
                <button onClick={handleDismiss} className="text-[#8E8E93] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <p className="text-sm text-white/80 leading-relaxed font-medium">
                Yeni sitemize geçmek ister misiniz? Aynı hesabı kullanarak okumaya kaldığınız yerden devam edebilirsiniz.
             </p>
             
             <div className="flex gap-3 pt-2">
                <button onClick={handleDismiss} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest transition-colors border border-white/5 text-white/70">
                  İptal
                </button>
                <button onClick={handleNavigate} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span>Geçiş Yap</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
