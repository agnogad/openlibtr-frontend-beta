'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Clock, BookOpen, ChevronRight, AlertCircle, X } from 'lucide-react';
import { ReadingHistory, getHistory, clearHistory as clearHistoryApi } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

export default function HistoryPage() {
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getHistory();
      setHistory(data);
      setLoading(false);
    };
    loadData();
  }, []);

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
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Geçmiş</h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="p-2 text-[#8E8E93] hover:text-destructive transition-colors"
            title="Geçmişi Temizle"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-secondary border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-destructive mb-4">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Emin misiniz?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Okuma geçmişiniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-4 py-3 rounded-xl bg-destructive text-white font-semibold hover:bg-destructive/90 transition-colors"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
          <p className="text-muted-foreground text-lg">Henüz bir şey okumadınız.</p>
          <Link href="/" className="text-primary hover:underline inline-block">Kütüphaneye Göz At</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={`${item.slug}-${item.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/novel/${item.slug}/${item.chapterId}`}
                  className="flex items-center justify-between p-5 rounded-2xl bg-[#121212] border border-white/10 hover:bg-[#1c1c1e] transition-all group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {item.novelTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#8E8E93]">
                      <span className="font-medium text-primary">Bölüm {item.chapterId}</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(item.timestamp, { addSuffix: true, locale: tr })}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8E8E93] group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
