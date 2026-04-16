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
        <section className="relative h-[380px] md:h-[480px] -mx-6 md:mx-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 rounded-none md:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
            >
              {/* Background Image with Parallax-like Zoom */}
              <motion.div 
                initial={{ scale: 1.15 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 8, ease: "linear" }}
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

              {/* Refined Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
              
              {/* Content - More Compact & Modern */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
                <div className="max-w-3xl space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/90">Editörün Seçimi</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[0.95] drop-shadow-xl">
                      {featuredNovels[currentSlide].title}
                    </h1>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <button 
                      onClick={() => onNavigate('NOVEL_DETAIL', { slug: featuredNovels[currentSlide].slug })}
                      className="group relative px-8 py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,100,0,0.3)] active:scale-95"
                    >
                      <span className="relative z-10">Keşfet</span>
                    </button>

                    {resumeData && resumeData.slug === featuredNovels[currentSlide].slug && (
                      <button 
                        onClick={() => onNavigate('READER', { slug: resumeData.slug, chapterId: resumeData.chapterId })}
                        className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                      >
                        Bölüm {resumeData.chapterId}&apos;den Devam Et
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimalist Controls */}
          <div className="absolute bottom-8 right-8 md:right-12 flex items-center gap-6 z-10">
            <div className="flex gap-2">
              {featuredNovels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="group py-2"
                >
                  <div className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    currentSlide === i ? "w-10 bg-primary" : "w-4 bg-white/20 group-hover:bg-white/40"
                  )} />
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <ChevronRight className="w-5 h-5" />
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
