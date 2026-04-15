import { supabase } from './supabase';

export interface Novel {
  title: string;
  slug: string;
  chapterCount: number;
  lastUpdated: string;
}

export interface Chapter {
  id: number;
  title: string;
  path: string;
}

export interface NovelConfig {
  slug: string;
  total_chapters: number;
  chapters: Chapter[];
}

export interface ReadingHistory {
  slug: string;
  novelTitle: string;
  chapterId: number;
  timestamp: number;
}

export interface ResumeData {
  slug: string;
  novelTitle: string;
  chapterId: number;
}

export type ProxyProvider = 'fastgit.cc' | 'gh.llkk.cc' | 'gh-proxy.com' | 'ghproxy.net' | 'none';

const PROXY_CONFIG_KEY = 'openlibtr_proxy_config';

export interface ProxyConfig {
  enabled: boolean;
  provider: ProxyProvider;
}

const BASE_URL = 'https://raw.githubusercontent.com/agnogad/openlibtr/main';

function getProxiedUrl(url: string): string {
  if (typeof window === 'undefined') return url;
  
  const configRaw = localStorage.getItem(PROXY_CONFIG_KEY);
  if (!configRaw) return url;
  
  const config: ProxyConfig = JSON.parse(configRaw);
  if (!config.enabled || config.provider === 'none') return url;

  switch (config.provider) {
    case 'fastgit.cc':
      return `https://fastgit.cc/${url}`;
    case 'gh.llkk.cc':
      return `https://gh.llkk.cc/${url}`;
    case 'gh-proxy.com':
      return `https://gh-proxy.com/${url}`;
    case 'ghproxy.net':
      return `https://ghproxy.net/${url}`;
    default:
      return url;
  }
}

export async function fetchLibrary(): Promise<Novel[]> {
  const url = getProxiedUrl(`${BASE_URL}/library.json`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch library');
  return response.json();
}

export async function fetchNovelConfig(slug: string): Promise<NovelConfig> {
  const url = getProxiedUrl(`${BASE_URL}/books/${slug}/config.json`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch novel config');
  return response.json();
}

export async function fetchChapterContent(slug: string, path: string): Promise<string> {
  const url = getProxiedUrl(`${BASE_URL}/books/${slug}/${path}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch chapter content');
  return response.text();
}

export function getCoverUrl(slug: string): string {
  return getProxiedUrl(`${BASE_URL}/books/${slug}/cover.jpg`);
}

// LocalStorage Helpers
const HISTORY_KEY = 'openlibtr_history';
const RESUME_KEY = 'openlibtr_resume';

export async function saveToHistory(historyItem: ReadingHistory) {
  if (typeof window === 'undefined') return;
  
  // Local Save
  const history = getLocalHistory();
  const filteredHistory = history.filter(item => item.slug !== historyItem.slug);
  const newHistory = [historyItem, ...filteredHistory].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

  // Supabase Save if logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    try {
      // Upsert to Supabase
      await supabase.from('reading_history').upsert({
        user_id: user.id,
        slug: historyItem.slug,
        novel_title: historyItem.novelTitle,
        chapter_id: historyItem.chapterId,
        timestamp: new Date(historyItem.timestamp).toISOString()
      }, { onConflict: 'user_id,slug' });
    } catch (error) {
      console.error('Error saving to Supabase history:', error);
    }
  }
}

export function getLocalHistory(): ReadingHistory[] {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export async function getHistory(): Promise<ReadingHistory[]> {
  if (typeof window === 'undefined') return [];
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(item => ({
          slug: item.slug,
          novelTitle: item.novel_title,
          chapterId: item.chapter_id,
          timestamp: new Date(item.timestamp).getTime()
        }));
      }
    } catch (error) {
      console.error('Error fetching Supabase history:', error);
    }
  }
  
  return getLocalHistory();
}

export function saveResume(resumeData: ResumeData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESUME_KEY, JSON.stringify(resumeData));
}

export function getResume(): ResumeData | null {
  if (typeof window === 'undefined') return null;
  const resume = localStorage.getItem(RESUME_KEY);
  return resume ? JSON.parse(resume) : null;
}

export async function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('reading_history').delete().eq('user_id', user.id);
  }
}
