'use client';

import { useState, useEffect } from 'react';
import { Trash2, Clock, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import { ReadingHistory, getHistory, clearHistory as clearHistoryApi } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  onNavigate: (view: string, params?: any) => void;
  initialHistory: ReadingHistory[];
}

export function HistoryView({ onNavigate, initialHistory }: HistoryViewProps) {
  const [history, setHistory] = useState<ReadingHistory[]>(initialHistory);
  const [loading, setLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  const handleClearHistory = async () => {
    await clearHistoryApi();
    setHistory([]);
    setShowConfirmClear(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Geçmiş yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-display font-black uppercase tracking-tight">Geçmiş</h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="p-3 rounded-xl bg-white/5 border border-white/5 text-[#8E8E93] hover:text-destructive hover:bg-destructive/10 transition-all group"
            title="Geçmişi Temizle"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </header>

      <AnimatePresence>
        {showConfirmClear && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
              onClick={() => setShowConfirmClear(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl space-y-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight">Emin misiniz?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Okuma geçmişiniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 px-4 py-4 rounded-2xl bg-destructive text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-destructive/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Hemen Sil
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {history.length === 0 ? (
        <div className="text-center py-20 space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
            <BookOpen className="w-10 h-10 text-muted-foreground opacity-30" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-display font-black uppercase tracking-widest">Henüz bir şey okumadınız</p>
            <p className="text-xs text-[#444] font-black uppercase tracking-[0.2em]">Kütüphaneden yeni hikayeler keşfedin</p>
          </div>
          <button 
            onClick={() => onNavigate('LIBRARY')} 
            className="px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-4"
          >
            Kütüphaneye Göz At
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {history.map((item, index) => (
              <motion.div
                key={`${item.slug}-${item.timestamp}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
              >
                <button
                  onClick={() => onNavigate('READER', { slug: item.slug, chapterId: item.chapterId })}
                  className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all group"
                >
                  <div className="space-y-2 text-left">
                    <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {item.novelTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        <span>Bölüm {item.chapterId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDistanceToNow(item.timestamp, { addSuffix: true, locale: tr })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <ChevronRight className="w-5 h-5 text-[#8E8E93] group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
