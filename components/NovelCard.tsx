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
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link 
        href={`/novel/${novel.slug}`} 
        onClick={handleClick}
        className="group block relative"
      >
        <div className="novel-cover-wrapper relative aspect-[2/3] overflow-hidden rounded-[2rem] bg-[#141416] border border-white/5 shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-primary/30 group-hover:ring-4 group-hover:ring-primary/10">
          <Image
            src={getCoverUrl(novel.slug)}
            alt={novel.title}
            fill
            className="novel-cover object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge */}
          <div className="absolute top-4 left-4">
            <div className="glass px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] text-white/90 shadow-xl">
              Nvl
            </div>
          </div>

          {/* Quick Info */}
          <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Detayları Gör
            </p>
          </div>
        </div>
        
        <div className="mt-5 space-y-2.5 px-2">
          <h3 className="novel-title text-sm md:text-base font-display font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
            {novel.title}
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#444]">
            <span className="text-primary">{novel.chapterCount} Bölüm</span>
            {new Date(novel.lastUpdated).toDateString() === new Date().toDateString() && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-500">Güncel</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
