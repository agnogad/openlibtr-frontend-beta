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
}

export function LibraryView({ onNavigate, novels, history }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredNovels = useMemo(() => novels.slice(0, 5), [novels]);
  
  const resumeData = useMemo(() => {
    return history.length > 0 ? history[0] : null;
  }, [history]);

  const filteredNovels = novels.filter(novel => 
    novel.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (featuredNovels.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNovels.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredNovels.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredNovels.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredNovels.length) % featuredNovels.length);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Slider Section */}
      {!searchQuery && featuredNovels.length > 0 && (
        <section className="relative h-[500px] md:h-[650px] -mx-6 md:mx-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 rounded-none md:rounded-[3.5rem] overflow-hidden"
            >
              {/* Background Image with Zoom */}
              <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0"
              >
                <Image 
                  src={getCoverUrl(featuredNovels[currentSlide].slug)} 
                  alt={featuredNovels[currentSlide].title} 
                  fill
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
              </motion.div>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
                <div className="max-w-4xl space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Haftanın Favorisi</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
                      {featuredNovels[currentSlide].title}
                    </h1>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center gap-6"
                  >
                    <button 
                      onClick={() => onNavigate('NOVEL_DETAIL', { slug: featuredNovels[currentSlide].slug })}
                      className="group relative px-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10">Hemen Oku</span>
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    {resumeData && resumeData.slug === featuredNovels[currentSlide].slug && (
                      <button 
                        onClick={() => onNavigate('READER', { slug: resumeData.slug, chapterId: resumeData.chapterId })}
                        className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all"
                      >
                        Devam Et: Bölüm {resumeData.chapterId}
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls - Minimalist Glass */}
          <div className="absolute bottom-10 right-10 md:right-20 flex items-center gap-8 z-10">
            <div className="flex gap-3">
              {featuredNovels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="group relative py-4"
                >
                  <div className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    currentSlide === i ? "w-12 bg-primary" : "w-6 bg-white/20 group-hover:bg-white/40"
                  )} />
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={prevSlide}
                className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Resume Section */}
      {!searchQuery && resumeData && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Okumaya Devam Et
            </h2>
          </div>
          <ResumeCard data={resumeData} onNavigate={onNavigate} />
        </section>
      )}

      {/* Search Bar */}
      <header className="sticky top-20 z-40 py-4 bg-[#050505]/80 backdrop-blur-xl -mx-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative group flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Binlerce bölüm arasında ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-[#121212] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base font-medium placeholder:text-[#444]"
            />
          </div>
        </div>
      </header>

      {/* Novels Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Library className="w-6 h-6 text-primary" />
            {searchQuery ? 'Arama Sonuçları' : 'Tüm Kütüphane'}
          </h2>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444]">
            {filteredNovels.length} Seri Bulundu
          </span>
        </div>

        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {filteredNovels.map((novel) => (
              <NovelCard key={novel.slug} novel={novel} onNavigate={onNavigate} />
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
