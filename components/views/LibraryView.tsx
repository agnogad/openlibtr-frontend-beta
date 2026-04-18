'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Clock, Library, ChevronLeft, ChevronRight } from 'lucide-react';
import { Novel, ReadingHistory, getCoverUrl } from '@/lib/api';
import { NovelCard } from '@/components/NovelCard';
import { ResumeCard } from '@/components/ResumeCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LibraryViewProps {
  onNavigate: (view: string, params?: any) => void;
  novels: Novel[];
  history: ReadingHistory[];
  searchQuery: string;
}

export function LibraryView({ onNavigate, novels, history, searchQuery }: LibraryViewProps) {
  const sortedNovels = useMemo(() => {
    return [...novels].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }, [novels]);

  const featuredNovels = useMemo(() => sortedNovels.slice(0, 3), [sortedNovels]);
  
  const resumeData = useMemo(() => {
    if (history.length === 0) return null;
    const item = history[0];
    const novel = sortedNovels.find(n => n.slug === item.slug);
    return {
      ...item,
      novelTitle: novel?.title || item.novelTitle
    };
  }, [history, sortedNovels]);

  const filteredNovels = useMemo(() => {
    return sortedNovels.filter(novel => 
      novel.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedNovels, searchQuery]);

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Spotlight Grid */}
      {!searchQuery && featuredNovels.length >= 3 && (
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mt-16 md:mt-20">
          {/* Main Hero Spotlight */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3 h-[240px] md:h-[450px] relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl"
          >
            <Image 
              src={getCoverUrl(featuredNovels[0].slug)} 
              alt={featuredNovels[0].title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                  <Sparkles className="w-2.5 h-2.5 text-[#8E8E93]" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#8E8E93]">Haftanın Favorisi</span>
                </div>
                <h1 className="text-2xl md:text-5xl font-display font-black tracking-tight uppercase leading-[0.9] line-clamp-1 md:line-clamp-2">
                  {featuredNovels[0].title}
                </h1>
              </div>
              <button 
                onClick={() => onNavigate('NOVEL_DETAIL', { slug: featuredNovels[0].slug })}
                className="w-fit px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                Hemen Oku
              </button>
            </div>
          </motion.div>

          {/* Secondary Spotlight Stack */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-6">
            {[featuredNovels[1], featuredNovels[2]].map((novel, idx) => (
              <motion.div
                key={novel.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
                className="relative h-[120px] md:h-auto rounded-2xl md:rounded-[2rem] overflow-hidden group shadow-xl border border-white/5"
              >
                <Image 
                  src={getCoverUrl(novel.slug)} 
                  alt={novel.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end gap-2 md:gap-3">
                  <h3 className="text-sm md:text-xl font-display font-black tracking-tight uppercase leading-none line-clamp-1">
                    {novel.title}
                  </h3>
                  <button 
                    onClick={() => onNavigate('NOVEL_DETAIL', { slug: novel.slug })}
                    className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors text-left"
                  >
                    Detay →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Resume Section */}
      {!searchQuery && resumeData && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center gap-4">
              Okumaya Devam Et
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ResumeCard data={resumeData} onNavigate={onNavigate} />
          </motion.div>
        </section>
      )}


      {/* Novels Grid */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center gap-4">
            {searchQuery ? 'Arama Sonuçları' : 'Tüm Kütüphane'}
          </h2>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#444]">
            {filteredNovels.length} Seri Bulundu
          </div>
        </div>

        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
            {filteredNovels.map((novel, index) => (
              <motion.div
                key={novel.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: (index % 5) * 0.05 }}
              >
                <NovelCard novel={novel} onNavigate={onNavigate} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-[#121212] rounded-full flex items-center justify-center mx-auto border border-white/5">
              <Search className="w-8 h-8 text-[#444]" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black uppercase tracking-widest">Sonuç Bulunamadı</p>
              <p className="text-xs text-[#444] font-bold uppercase tracking-[0.2em]">Farklı bir arama yapmayı deneyin</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
