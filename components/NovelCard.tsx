'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Novel, getCoverUrl } from '@/lib/api';
import { motion } from 'motion/react';

interface NovelCardProps {
  novel: Novel;
  onNavigate?: (view: string, params?: any) => void;
}

export function NovelCard({ novel, onNavigate }: NovelCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('NOVEL_DETAIL', { slug: novel.slug });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link 
        href={`/novel/${novel.slug}`} 
        onClick={handleClick}
        className="group block relative"
      >
        <div className="novel-cover-wrapper relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#121212] border border-white/10 shadow-xl transition-all duration-500 group-hover:shadow-primary/20 group-hover:border-primary/30">
          <Image
            src={getCoverUrl(novel.slug)}
            alt={novel.title}
            fill
            className="novel-cover object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
              Novel
            </div>
          </div>

          {/* Quick View Info (Mobile/Hover) */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              {novel.chapterCount} Bölüm
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-1.5 px-1">
          <h3 className="novel-title text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {novel.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-medium text-[#8E8E93] uppercase tracking-wider">
            <span>{novel.chapterCount} Bölüm</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="truncate">{new Date(novel.lastUpdated).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
