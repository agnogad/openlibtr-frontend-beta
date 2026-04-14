'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Novel, getCoverUrl } from '@/lib/api';
import { motion } from 'motion/react';

interface NovelCardProps {
  novel: Novel;
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/novel/${novel.slug}`} className="group block">
        <div className="novel-cover-wrapper relative aspect-[2/3] overflow-hidden rounded-xl bg-[#121212] border border-white/10 shadow-xl transition-transform duration-200 group-hover:scale-[1.02]">
          <Image
            src={getCoverUrl(novel.slug)}
            alt={novel.title}
            fill
            className="novel-cover object-cover"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          <div className="novel-badge absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Novel
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="novel-title text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {novel.title}
          </h3>
          <p className="novel-meta text-xs text-[#8E8E93]">
            {novel.chapterCount} Bölüm
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
