'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, BookOpen } from 'lucide-react';
import { NovelConfig, fetchNovelConfig, getCoverUrl } from '@/lib/api';
import { motion } from 'motion/react';

export default function NovelDetailClient({ slug }: { slug: string }) {
  const [config, setConfig] = useState<NovelConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await fetchNovelConfig(slug);
        setConfig(data);
      } catch (error) {
        console.error('Error loading novel config:', error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Novel detayları yükleniyor...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Novel bulunamadı.</p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">Kütüphaneye Dön</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link href="/" className="inline-flex items-center gap-2 text-[#8E8E93] hover:text-white transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-64 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={getCoverUrl(slug)}
              alt={slug}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">{slug.replace(/-/g, ' ')}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>{config.total_chapters} Bölüm</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Light Novel</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Bölüm Listesi
            </h2>
            <div className="grid gap-2">
              {config.chapters.map((chapter) => (
                <motion.div
                  key={chapter.id}
                  whileHover={{ x: 4 }}
                  className="group"
                >
                  <Link
                    href={`/novel/${slug}/${chapter.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-white/10 hover:bg-[#1c1c1e] transition-all"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      Bölüm {chapter.id}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
