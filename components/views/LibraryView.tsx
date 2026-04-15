'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles, Clock, Library } from 'lucide-react';
import { Novel, ReadingHistory, getCoverUrl } from '@/lib/api';
import { NovelCard } from '@/components/NovelCard';
import { ResumeCard } from '@/components/ResumeCard';
import { motion } from 'motion/react';
import Image from 'next/image';

interface LibraryViewProps {
  onNavigate: (view: string, params?: any) => void;
  novels: Novel[];
  history: ReadingHistory[];
}

export function LibraryView({ onNavigate, novels, history }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const resumeData = useMemo(() => {
    return history.length > 0 ? history[0] : null;
  }, [history]);

  const filteredNovels = novels.filter(novel => 
    novel.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      {!searchQuery && novels.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden group"
        >
          <div className="absolute inset-0">
            <Image 
              src={getCoverUrl(novels[0].slug)} 
              alt="Featured" 
              fill
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.4em]">
              <Sparkles className="w-4 h-4" />
              <span>Öne Çıkan Seri</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none max-w-2xl">
              {novels[0].title}
            </h1>
            <p className="text-[#8E8E93] max-w-xl text-sm md:text-base line-clamp-2 font-medium">
              Bu haftanın en çok okunan serisiyle maceraya atılın. Sürükleyici hikaye ve unutulmaz karakterler sizi bekliyor.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => onNavigate('NOVEL_DETAIL', { slug: novels[0].slug })}
                className="px-10 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Şimdi Oku
              </button>
              {resumeData && resumeData.slug === novels[0].slug && (
                <button 
                  onClick={() => onNavigate('READER', { slug: resumeData.slug, chapterId: resumeData.chapterId })}
                  className="px-10 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  Kaldığın Yerden Devam Et
                </button>
              )}
            </div>
          </div>
        </motion.section>
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
