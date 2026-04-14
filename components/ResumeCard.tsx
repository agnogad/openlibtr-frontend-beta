'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ResumeData, getCoverUrl } from '@/lib/api';
import { motion } from 'motion/react';

interface ResumeCardProps {
  data: ResumeData;
}

export function ResumeCard({ data }: ResumeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="resume-glow rounded-2xl border border-white/10 p-6 mb-8"
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow-2xl bg-[#2c2c2e] border border-white/5">
            <Image
              src={getCoverUrl(data.slug)}
              alt={data.novelTitle}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="resume-info">
            <h2 className="text-xl font-bold tracking-tight mb-1">{data.novelTitle}</h2>
            <p className="text-sm text-[#8E8E93]">
              Kaldığınız yer: <strong className="text-white">Bölüm {data.chapterId}</strong>
            </p>
          </div>
        </div>
        <Link
          href={`/novel/${data.slug}/${data.chapterId}`}
          className="resume-button px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Okumaya Dön
        </Link>
      </div>
    </motion.div>
  );
}
