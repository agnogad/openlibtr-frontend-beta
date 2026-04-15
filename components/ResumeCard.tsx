'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ResumeData, getCoverUrl } from '@/lib/api';
import { motion } from 'motion/react';

interface ResumeCardProps {
  data: ResumeData;
  onNavigate?: (view: string, params?: any) => void;
}

export function ResumeCard({ data, onNavigate }: ResumeCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('READER', { slug: data.slug, chapterId: data.chapterId });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-4 md:p-5"
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-18 shrink-0 rounded-lg overflow-hidden shadow-lg bg-[#1c1c1e] border border-white/5 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={getCoverUrl(data.slug)}
              alt={data.novelTitle}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[9px] uppercase tracking-[0.2em]">
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <span>Okumaya Devam Et</span>
            </div>
            <h2 className="text-base md:text-lg font-black tracking-tight uppercase leading-tight line-clamp-1">{data.novelTitle}</h2>
            <div className="flex items-center gap-2 text-[11px] text-[#8E8E93]">
              <span className="font-medium">Kaldığınız:</span>
              <span className="text-white font-bold">Bölüm {data.chapterId}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="shrink-0 px-6 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          Dön
        </button>
      </div>
    </motion.div>
  );
}
