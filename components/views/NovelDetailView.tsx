'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Calendar, BookOpen, Search, Play } from 'lucide-react';
import { NovelConfig, fetchNovelConfig, getCoverUrl, getHistory, ReadingHistory } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60;

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

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredChapters = config?.chapters.filter(chapter => 
    chapter.id.toString().includes(searchQuery) || 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  const currentChapters = filteredChapters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="space-y-12 pb-20 relative min-h-screen">
      {/* Background - Simplified to strictly black */}
      <div className="fixed inset-0 -z-10 bg-black pointer-events-none" />

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
                className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Bölüm {lastReadChapterId}&apos;den Devam Et</span>
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex-1 space-y-12 pt-4">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-3 text-primary font-black text-[9px] uppercase tracking-[0.4em]">
                  <span>Light Novel</span>
                </div>
                {lastReadChapterId && (
                  <button 
                    onClick={() => onNavigate('READER', { slug, chapterId: lastReadChapterId })}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bölüm {lastReadChapterId}&apos;de Kaldın</span>
                  </button>
                )}
              </div>
              <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
                {slug.replace(/-/g, ' ')}
              </h1>
              <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  <span>{config.total_chapters} Bölüm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Güncel Seri</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div id="chapter-list-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-10">
              <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center gap-4">
                Bölüm Listesi
              </h2>
              
              <div className="relative group max-w-xs w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Bölüm ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-14 pr-6 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-black placeholder:text-[#444]"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
              {currentChapters.map((chapter, index) => {
                const isRead = lastReadChapterId !== null && chapter.id <= lastReadChapterId;
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index % 20) * 0.01 }}
                  >
                    <button
                      onClick={() => onNavigate('READER', { slug, chapterId: chapter.id })}
                      className={cn(
                        "w-full aspect-square flex flex-col items-center justify-center rounded-xl md:rounded-2xl border transition-all group relative overflow-hidden",
                        isRead 
                          ? "bg-primary/10 border-primary/30 hover:bg-primary/20" 
                          : "bg-[#121212] border-white/5 hover:bg-[#1c1c1e] hover:border-primary/40 hover:scale-105"
                      )}
                      title={`Bölüm ${chapter.id}${chapter.title ? ': ' + chapter.title : ''}`}
                    >
                      <span className={cn(
                        "text-sm md:text-base font-black transition-colors",
                        isRead ? "text-primary" : "text-white group-hover:text-primary"
                      )}>
                        {chapter.id}
                      </span>
                      {isRead && (
                        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 py-1 bg-primary/0 group-hover:bg-primary/10 transition-colors">
                        <p className={cn(
                          "text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all",
                          isRead ? "text-primary/70" : "text-primary"
                        )}>
                          OKU
                        </p>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {filteredChapters.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <Search className="w-6 h-6 text-[#444]" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#444]">Bölüm bulunamadı</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-10 border-t border-white/5">
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    document.getElementById('chapter-list-header')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          document.getElementById('chapter-list-header')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={cn(
                          "w-10 h-10 rounded-xl font-bold text-xs transition-all border",
                          currentPage === pageNum 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white/5 border-white/5 text-[#8E8E93] hover:bg-white/10"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    document.getElementById('chapter-list-header')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
