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
      className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] p-6 md:p-8"
    >
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="relative w-24 h-36 md:w-28 md:h-40 shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-[#1c1c1e] border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={getCoverUrl(data.slug)}
              alt={data.novelTitle}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Okumaya Devam Et</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-tight">{data.novelTitle}</h2>
            <div className="flex items-center gap-3 text-sm text-[#8E8E93]">
              <span className="font-medium">Kaldığınız yer:</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs">
                Bölüm {data.chapterId}
              </span>
            </div>
          </div>
        </div>
        
        <Link
          href={`/novel/${data.slug}/${data.chapterId}`}
          onClick={handleClick}
          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center"
        >
          Okumaya Dön
        </Link>
      </div>
    </motion.div>
  );
}
