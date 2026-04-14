'use client';

import { useState, useEffect } from 'react';
import { Search, Library } from 'lucide-react';
import { Novel, fetchLibrary, getResume, ResumeData } from '@/lib/api';
import { NovelCard } from '@/components/NovelCard';
import { ResumeCard } from '@/components/ResumeCard';
import { motion, AnimatePresence } from 'motion/react';

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [libraryData] = await Promise.all([
          fetchLibrary(),
        ]);
        setNovels(libraryData);
        setResumeData(getResume());
      } catch (error) {
        console.error('Error loading library:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Kütüphane yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Kütüphane</h1>
          </div>
        </div>
        
        <div className="search-container relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full h-11 pl-11 pr-4 bg-[#1c1c1e] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {resumeData && !searchQuery && (
          <section className="resume-section">
            <div className="section-title text-lg font-semibold mb-4 flex items-center gap-2">
              Okumaya Devam Et
            </div>
            <ResumeCard data={resumeData} />
          </section>
        )}
      </AnimatePresence>

      <section className="library-section">
        <div className="section-title text-lg font-semibold mb-6">
          Tüm Noveller
        </div>
        <div className="library-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredNovels.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} />
          ))}
        </div>
      </section>

      {filteredNovels.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Aradığınız kriterlere uygun novel bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
