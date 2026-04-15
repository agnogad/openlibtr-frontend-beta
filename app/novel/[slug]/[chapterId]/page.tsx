'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Menu, Home, ArrowLeft, Settings, ArrowUp, Clock, List } from 'lucide-react';
import { 
  fetchNovelConfig, 
  fetchChapterContent, 
  NovelConfig, 
  saveToHistory, 
  saveResume 
} from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { GiscusComments } from '@/components/GiscusComments';
import { ReaderSettings } from '@/components/ReaderSettings';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

export default function ReaderPage({ params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  const { slug, chapterId } = use(params);
  const id = parseInt(chapterId);
  const router = useRouter();
  
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Reader Settings State
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('var(--font-sans)');

  useEffect(() => {
    // Load saved settings
    const savedSize = localStorage.getItem('reader-font-size');
    const savedFamily = localStorage.getItem('reader-font-family');
    if (savedSize) setFontSize(parseInt(savedSize));
    if (savedFamily) setFontFamily(savedFamily);

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
        
        // Calculate reading time (avg 200 words per minute)
        const words = text.split(/\s+/).length;
        setReadingTime(Math.ceil(words / 200));

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide scroll to top button
      setShowScrollTop(currentScrollY > 500);

      // Show/hide header on scroll
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevChapter) {
        router.push(`/novel/${slug}/${prevChapter.id}`);
      } else if (e.key === 'ArrowRight' && nextChapter) {
        router.push(`/novel/${slug}/${nextChapter.id}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slug, prevChapter, nextChapter, router]);

  const handleSetFontSize = (size: number) => {
    setFontSize(size);
    localStorage.setItem('reader-font-size', size.toString());
  };

  const handleSetFontFamily = (family: string) => {
    setFontFamily(family);
    localStorage.setItem('reader-font-family', family);
  };

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
      {/* Immersive Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 h-16"
      >
        <div className="max-w-3xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/novel/${slug}`} className="p-2 rounded-xl hover:bg-white/5 transition-colors" title="Bölüm Listesi">
              <List className="w-5 h-5 text-[#8E8E93]" />
            </Link>
            <Link href="/" className="p-2 rounded-xl hover:bg-white/5 transition-colors" title="Ana Sayfa">
              <Home className="w-5 h-5 text-[#8E8E93]" />
            </Link>
          </div>

          <div className="flex-1 text-center px-4 truncate">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest truncate">
              {slug.replace(/-/g, ' ')}
            </p>
            <p className="text-xs font-bold truncate">Bölüm {id}</p>
          </div>

          <ReaderSettings 
            fontSize={fontSize} 
            setFontSize={handleSetFontSize} 
            fontFamily={fontFamily} 
            setFontFamily={handleSetFontFamily} 
          />
        </div>

        {/* Reading Progress Bar (Integrated at the bottom of header) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 pointer-events-none">
          <motion.div
            className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ 
              scaleX,
              transformOrigin: "0%"
            }}
          />
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Reader Title Section */}
      <div className="text-center space-y-4 pt-10 pb-6 border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Bölüm {id}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-[#8E8E93]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{readingTime} dk okuma</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5">
            <List className="w-4 h-4" />
            <span>{config.total_chapters} Bölüm</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="markdown-body prose prose-invert max-w-none text-white/90 leading-relaxed"
        style={{ 
          fontSize: `${fontSize}px`, 
          fontFamily: fontFamily,
          lineHeight: 1.8 
        }}
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

      {/* Floating Buttons */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 p-4 rounded-full bg-primary text-white shadow-2xl shadow-primary/20 z-50 hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Comments */}
      <div className="pt-10">
        <GiscusComments />
      </div>
    </div>
  );
}
