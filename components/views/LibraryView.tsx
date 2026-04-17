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
        <section className="relative h-[480px] md:h-[600px] -mx-6 md:mx-0 group overflow-hidden md:rounded-[3rem] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {/* Immersive Background Image */}
              <motion.div 
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
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

              {/* Dynamic Overlay Layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent hidden md:block" />
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
              
              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 pb-20 md:pb-24">
                <div className="max-w-4xl space-y-6 md:space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-xl">
                      <Sparkles className="w-3 h-3 text-[#8E8E93]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8E93]">Öne Çıkan Seri</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      {featuredNovels[currentSlide].title}
                    </h1>

                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                      <div className="flex items-center gap-2">
                        <Library className="w-4 h-4 text-primary" />
                        <span>{featuredNovels[currentSlide].chapterCount} Bölüm</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div>Popüler Seri</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-wrap items-center gap-4 md:gap-6"
                  >
                    <button 
                      onClick={() => onNavigate('NOVEL_DETAIL', { slug: featuredNovels[currentSlide].slug })}
                      className="group relative px-10 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,100,0,0.3)] active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        Hemen Oku <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>

                    {resumeData && resumeData.slug === featuredNovels[currentSlide].slug && (
                      <button 
                        onClick={() => onNavigate('READER', { slug: resumeData.slug, chapterId: resumeData.chapterId })}
                        className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all border-b-primary/50"
                      >
                        Bölüm {resumeData.chapterId}&apos;den Devam Et
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-2xl p-2 rounded-2xl border border-white/5">
              {featuredNovels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="p-1"
                >
                  <div className={cn(
                    "h-1.5 rounded-full transition-all duration-700",
                    currentSlide === i ? "w-10 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                  )} />
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={prevSlide}
                className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-white group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-white group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Side Indicator Labels - Desktop Only */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 z-20">
            <div className="rotate-90 origin-left text-[10px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">
              OpenLibTR Premium Reader
            </div>
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
