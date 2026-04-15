import { fetchLibrary, fetchNovelConfig } from '@/lib/api';
import ReaderClient from '@/components/ReaderClient';

export async function generateStaticParams() {
  const novels = await fetchLibrary();
  const params = [];

  for (const novel of novels) {
    try {
      const config = await fetchNovelConfig(novel.slug);
      for (const chapter of config.chapters) {
        params.push({
          slug: novel.slug,
          chapterId: chapter.id.toString(),
        });
      }
    } catch (error) {
      console.error(`Error generating static params for ${novel.slug}:`, error);
    }
  }

  return params;
}

export default async function ReaderPage({ params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  const { slug, chapterId } = await params;
  return <ReaderClient slug={slug} chapterId={chapterId} />;
}
