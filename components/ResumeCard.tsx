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
      whileHover={{ scale: 1.01 }}
      className="resume-glow rounded-[2.5rem] p-6 md:p-8 relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative w-16 h-24 md:w-20 md:h-28 shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-[#1c1c1e] border border-white/10 group-hover:rotate-2 transition-transform duration-500">
            <Image
              src={getCoverUrl(data.slug)}
              alt={data.novelTitle}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-3 text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em]">
              <span>Kaldığın Seri</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl md:text-3xl font-display font-black tracking-tight uppercase leading-[0.9] line-clamp-1">{data.novelTitle}</h2>
              <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#8E8E93]">
                <span className="text-white">Bölüm {data.chapterId}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
                <span className="opacity-50">Son Okuma</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="hidden sm:flex shrink-0 px-10 py-5 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group-hover:shadow-[0_0_30px_rgba(255,100,0,0.4)]"
        >
          Devam Et
        </button>
      </div>
    </motion.div>
  );
}
