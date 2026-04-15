'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Calendar, BookOpen, Search, Play } from 'lucide-react';
import { NovelConfig, fetchNovelConfig, getCoverUrl, getHistory, ReadingHistory } from '@/lib/api';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function NovelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastReadChapterId, setLastReadChapterId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [novelConfig, history] = await Promise.all([
          fetchNovelConfig(slug),
          getHistory()
        ]);
        
        setConfig(novelConfig);
        
        // Find last read chapter for this novel
        const novelHistory = history.find(item => item.slug === slug);
        if (novelHistory) {
          setLastReadChapterId(novelHistory.chapterId);
        }
      } catch (error) {
        console.error('Error loading novel data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const filteredChapters = config?.chapters.filter(chapter => 
    chapter.id.toString().includes(searchQuery) || 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Novel detayları yükleniyor...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Novel bulunamadı.</p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">Kütüphaneye Dön</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link href="/" className="inline-flex items-center gap-2 text-[#8E8E93] hover:text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-64 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={getCoverUrl(slug)}
              alt={slug}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">{slug.replace(/-/g, ' ')}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>{config.total_chapters} Bölüm</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Light Novel</span>
              </div>
            </div>
          </div>

          {lastReadChapterId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={`/novel/${slug}/${lastReadChapterId}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Kaldığın Yerden Devam Et (Bölüm {lastReadChapterId})</span>
              </Link>
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Bölüm Listesi
              </h2>
              
              <div className="relative group max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Bölüm ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#1c1c1e] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChapters.map((chapter) => {
                const isRead = lastReadChapterId !== null && chapter.id <= lastReadChapterId;
                return (
                  <motion.div
                    key={chapter.id}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <Link
                      href={`/novel/${slug}/${chapter.id}`}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                        isRead 
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/10" 
                          : "bg-[#121212] border-white/10 hover:bg-[#1c1c1e]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "font-medium transition-colors",
                          isRead ? "text-primary" : "group-hover:text-primary"
                        )}>
                          Bölüm {chapter.id}
                        </span>
                        {isRead && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                            Okundu
                          </span>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-colors",
                        isRead ? "text-primary/60" : "text-[#8E8E93] group-hover:text-primary"
                      )} />
                    </Link>
                  </motion.div>
                );
              })}
              {filteredChapters.length === 0 && (
                <div className="text-center py-10 text-[#8E8E93]">
                  Aradığınız bölüm bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
