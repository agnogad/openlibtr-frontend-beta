'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Menu, Home, ArrowLeft } from 'lucide-react';
import { 
  fetchNovelConfig, 
  fetchChapterContent, 
  NovelConfig, 
  saveToHistory, 
  saveResume 
} from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { GiscusComments } from '@/components/GiscusComments';
import { motion, AnimatePresence } from 'motion/react';

export default function ReaderPage({ params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  const { slug, chapterId } = use(params);
  const id = parseInt(chapterId);
  
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const novelConfig = await fetchNovelConfig(slug);
        setConfig(novelConfig);
        
        const chapter = novelConfig.chapters.find(c => c.id === id);
        if (!chapter) throw new Error('Bölüm bulunamadı');
        
        const text = await fetchChapterContent(slug, chapter.path);
        setContent(text);
        
        // Save to history and resume
        const novelTitle = slug.replace(/-/g, ' ').toUpperCase();
        await saveToHistory({
          slug,
          novelTitle,
          chapterId: id,
          timestamp: Date.now()
        });
        saveResume({
          slug,
          novelTitle,
          chapterId: id
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error loading reader:', err);
        setError('Bölüm içeriği yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, id]);

  const nextChapter = config?.chapters.find(c => c.id === id + 1);
  const prevChapter = config?.chapters.find(c => c.id === id - 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Bölüm yükleniyor...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-destructive text-lg">{error || 'Bir hata oluştu.'}</p>
        <Link href={`/novel/${slug}`} className="text-primary hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Novel Sayfasına Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Reader Header */}
      <header className="space-y-6 text-center border-b border-white/10 pb-10">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/novel/${slug}`} className="p-2.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors border border-white/5">
            <Menu className="w-5 h-5" />
          </Link>
          <Link href="/" className="p-2.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] transition-colors border border-white/5">
            <Home className="w-5 h-5" />
          </Link>
        </div>
        <h1 className="text-xs font-bold text-primary tracking-[0.2em] uppercase opacity-80">
          {slug.replace(/-/g, ' ')}
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bölüm {id}</h2>
      </header>

      {/* Content */}
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="markdown-body prose prose-invert max-w-none text-white/90"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </motion.article>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-12 border-t border-white/10">
        {prevChapter ? (
          <Link
            href={`/novel/${slug}/${prevChapter.id}`}
            className="flex-1 flex items-center gap-4 p-5 rounded-2xl bg-[#121212] border border-white/10 hover:bg-[#1c1c1e] transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Önceki</p>
              <p className="font-bold">Bölüm {prevChapter.id}</p>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {nextChapter ? (
          <Link
            href={`/novel/${slug}/${nextChapter.id}`}
            className="flex-1 flex items-center justify-end gap-4 p-5 rounded-2xl bg-[#121212] border border-white/10 hover:bg-[#1c1c1e] transition-all group"
          >
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">Sonraki</p>
              <p className="font-bold">Bölüm {nextChapter.id}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : <div className="flex-1" />}
      </div>

      {/* Comments */}
      <GiscusComments />
    </div>
  );
}
