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
        <div className="novel-cover-wrapper relative aspect-[2/3] overflow-hidden rounded-[1.5rem] bg-[#141416] border border-white/5 shadow-xl transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:border-primary/20">
          <Image
            src={getCoverUrl(novel.slug)}
            alt={novel.title}
            fill
            className="novel-cover object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="glass px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] text-white/90">
              Novel
            </div>
          </div>

          {/* Quick View Info (Mobile/Hover) */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="h-0.5 w-8 bg-primary rounded-full mb-2" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              Göz At
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2 px-1">
          <h3 className="novel-title text-sm md:text-[15px] font-display font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {novel.title}
          </h3>
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="text-primary">{novel.chapterCount} Bölüm</span>
            <span className="w-1 h-1 rounded-full bg-white/5" />
            <span>Güncellendi</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
