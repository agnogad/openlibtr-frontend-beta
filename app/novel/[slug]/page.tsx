import { fetchLibrary } from '@/lib/api';
import NovelDetailClient from '@/components/NovelDetailClient';

export async function generateStaticParams() {
  const novels = await fetchLibrary();
  return novels.map((novel) => ({
    slug: novel.slug,
  }));
}

export default async function NovelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NovelDetailClient slug={slug} />;
}
