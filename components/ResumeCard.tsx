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
      className="resume-glow rounded-[2rem] p-5 md:p-6"
    >
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-14 h-20 shrink-0 rounded-xl overflow-hidden shadow-2xl bg-[#1c1c1e] border border-white/5 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={getCoverUrl(data.slug)}
              alt={data.novelTitle}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2.5 text-primary font-black text-[8px] md:text-[9px] uppercase tracking-[0.3em]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,100,0,0.8)]" />
              <span>Okumaya Devam Et</span>
            </div>
            <h2 className="text-lg md:text-xl font-display font-black tracking-tight uppercase leading-none line-clamp-1">{data.novelTitle}</h2>
            <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Bölüm {data.chapterId}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <button 
                onClick={handleClick}
                className="text-primary hover:underline underline-offset-4"
              >
                Hemen Dön
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="hidden md:flex shrink-0 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all active:scale-95"
        >
          Devam Et
        </button>
      </div>
    </motion.div>
  );
}
