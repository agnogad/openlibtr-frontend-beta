'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { LibraryView } from '@/components/views/LibraryView';
import { NovelDetailView } from '@/components/views/NovelDetailView';
import { ReaderView } from '@/components/views/ReaderView';
import { HistoryView } from '@/components/views/HistoryView';
import { ProfileView } from '@/components/views/ProfileView';
import { LoginView } from '@/components/views/LoginView';
import { SignupView } from '@/components/views/SignupView';
import { motion, AnimatePresence } from 'motion/react';
import { fetchLibrary, getHistory, Novel, ReadingHistory } from '@/lib/api';
import { cn } from '@/lib/utils';

type ViewType = 'LIBRARY' | 'NOVEL_DETAIL' | 'READER' | 'HISTORY' | 'PROFILE' | 'LOGIN' | 'SIGNUP';

interface ViewState {
  type: ViewType;
  params?: any;
}

export default function MainApp() {
  const [view, setView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialView = params.get('view') as ViewType;
      const slug = params.get('slug');
      const chapterId = params.get('chapterId');
      if (initialView) {
        return { 
          type: initialView, 
          params: { slug, chapterId: chapterId ? parseInt(chapterId) : undefined } 
        };
      }
    }
    return { type: 'LIBRARY' };
  });

  const [novels, setNovels] = useState<Novel[]>([]);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadGlobalData = async () => {
      try {
        const [libraryData, historyData] = await Promise.all([
          fetchLibrary(),
          getHistory()
        ]);
        if (isMounted) {
          setNovels(libraryData);
          setHistory(historyData);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading global data:', error);
      }
    };
    loadGlobalData();
    return () => { isMounted = false; };
  }, []);

  const handleNavigate = useCallback((type: string, params?: any) => {
    setView({ type: type as ViewType, params });
    window.scrollTo(0, 0);
    
    // Refresh history when navigating to certain views to keep it fresh
    if (type === 'LIBRARY' || type === 'HISTORY') {
      getHistory().then(setHistory);
    }

    // Update URL without full page reload to support back button
    const url = new URL(window.location.href);
    url.searchParams.set('view', type);
    if (params?.slug) url.searchParams.set('slug', params.slug);
    if (params?.chapterId) url.searchParams.set('chapterId', params.chapterId.toString());
    window.history.pushState({}, '', url);
  }, []);

  useEffect(() => {
    // Handle back button
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view') as ViewType || 'LIBRARY';
      const s = p.get('slug');
      const c = p.get('chapterId');
      setView({ type: v, params: { slug: s, chapterId: c ? parseInt(c) : undefined } });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderView = () => {
    if (!isDataLoaded && view.type === 'LIBRARY') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-xl font-black uppercase tracking-widest animate-pulse">Uygulama Hazırlanıyor</p>
            <p className="text-xs text-[#444] font-bold uppercase tracking-[0.3em]">Lütfen Bekleyin</p>
          </div>
        </div>
      );
    }

    switch (view.type) {
      case 'LIBRARY':
        return <LibraryView onNavigate={handleNavigate} novels={novels} history={history} searchQuery={searchQuery} />;
      case 'NOVEL_DETAIL':
        return <NovelDetailView slug={view.params.slug} onNavigate={handleNavigate} history={history} />;
      case 'READER':
        return <ReaderView slug={view.params.slug} chapterId={view.params.chapterId} onNavigate={handleNavigate} />;
      case 'HISTORY':
        return <HistoryView onNavigate={handleNavigate} initialHistory={history} />;
      case 'PROFILE':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'LOGIN':
        return <LoginView onNavigate={handleNavigate} />;
      case 'SIGNUP':
        return <SignupView onNavigate={handleNavigate} />;
      default:
        return <LibraryView onNavigate={handleNavigate} novels={novels} history={history} searchQuery={searchQuery} />;
    }
  };

  const isReaderView = view.type === 'READER';

  return (
    <div className="min-h-screen">
      {!isReaderView && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentView={view.type} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      <main className={cn(
        "mx-auto px-6 transition-all duration-500",
        isReaderView ? "max-w-3xl py-8 -mt-20" : 
        (view.type === 'LIBRARY' && !searchQuery) ? "max-w-5xl md:px-10 pt-2 pb-8" : "max-w-5xl md:px-10 py-8"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view.type + (view.params?.slug || '') + (view.params?.chapterId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
