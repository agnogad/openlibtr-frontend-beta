'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Calendar, BookOpen, Search, Play } from 'lucide-react';
import { NovelConfig, fetchNovelConfig, getCoverUrl, getHistory, ReadingHistory } from '@/lib/api';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface NovelDetailViewProps {
  slug: string;
  onNavigate: (view: string, params?: any) => void;
  history: ReadingHistory[];
}

export function NovelDetailView({ slug, onNavigate, history }: NovelDetailViewProps) {
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastReadChapterId, setLastReadChapterId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const novelConfig = await fetchNovelConfig(slug);
        setConfig(novelConfig);
        
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
  }, [slug, history]);

  const filteredChapters = config?.chapters.filter(chapter => 
    chapter.id.toString().includes(searchQuery) || 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Novel detayları yükleniyor...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Novel bulunamadı.</p>
        <button onClick={() => onNavigate('LIBRARY')} className="text-primary hover:underline mt-4 inline-block">Kütüphaneye Dön</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <button 
        onClick={() => onNavigate('LIBRARY')} 
        className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8E8E93] hover:text-white transition-all group"
      >
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
        <span>Kütüphaneye Dön</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-80 shrink-0 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group"
          >
            <Image
              src={getCoverUrl(slug)}
              alt={slug}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {lastReadChapterId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => onNavigate('READER', { slug, chapterId: lastReadChapterId })}
                className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Kaldığın Yerden Devam Et</span>
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                <BookOpen className="w-4 h-4" />
                <span>Light Novel</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                {slug.replace(/-/g, ' ')}
              </h1>
              <div className="flex flex-wrap gap-6 text-[11px] font-bold uppercase tracking-widest text-[#8E8E93]">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  <span>{config.total_chapters} Bölüm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Güncel</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <List className="w-6 h-6 text-primary" />
                Bölüm Listesi
              </h2>
              
              <div className="relative group max-w-xs w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Bölüm ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-[#121212] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold placeholder:text-[#444]"
                />
              </div>
            </div>

            <div className="grid gap-3 max-h-[800px] overflow-y-auto pr-4 no-scrollbar">
              {filteredChapters.map((chapter, index) => {
                const isRead = lastReadChapterId !== null && chapter.id <= lastReadChapterId;
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <button
                      onClick={() => onNavigate('READER', { slug, chapterId: chapter.id })}
                      className={cn(
                        "w-full flex items-center justify-between p-5 rounded-2xl border transition-all group",
                        isRead 
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/10" 
                          : "bg-[#121212] border-white/5 hover:bg-[#1c1c1e] hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all",
                          isRead ? "bg-primary text-white" : "bg-white/5 text-[#8E8E93] group-hover:bg-primary group-hover:text-white"
                        )}>
                          {chapter.id}
                        </div>
                        <div className="space-y-0.5 text-left">
                          <span className={cn(
                            "text-sm font-bold transition-colors",
                            isRead ? "text-primary" : "text-white group-hover:text-primary"
                          )}>
                            Bölüm {chapter.id}
                          </span>
                          {isRead && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">Okundu</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 transition-all group-hover:translate-x-1",
                        isRead ? "text-primary/60" : "text-[#444] group-hover:text-primary"
                      )} />
                    </button>
                  </motion.div>
                );
              })}
              {filteredChapters.length === 0 && (
                <div className="text-center py-20 space-y-4">
                  <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mx-auto border border-white/5">
                    <Search className="w-6 h-6 text-[#444]" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#444]">Bölüm bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
