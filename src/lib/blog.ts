import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryOf, RESERVED_SLUGS, SERIES, type SeriesKey } from '../config/blog';

export type Post = CollectionEntry<'blog'>;

/** 公開する記事（draft: true は開発中だけ表示）を新しい順に */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft);
  for (const p of posts) {
    if (RESERVED_SLUGS.includes(p.id)) throw new Error(`記事のファイル名「${p.id}」は一覧ページのURLと重なるので使えません`);
  }
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 記事の系統（お知らせは null） */
export const seriesOf = (p: Post): SeriesKey | null => categoryOf(p.data.category).series;
export const seriesLabel = (p: Post) => {
  const s = seriesOf(p);
  return s ? SERIES[s].label : null;
};

/** 同じカテゴリの記事を優先し、足りなければ同じ系統から（最大 n 本） */
export function relatedPosts(post: Post, all: Post[], n = 3): Post[] {
  const others = all.filter((p) => p.id !== post.id && !p.data.draft);
  const sameCat = others.filter((p) => p.data.category === post.data.category);
  const s = seriesOf(post);
  const sameSeries = s ? others.filter((p) => p.data.category !== post.data.category && seriesOf(p) === s) : [];
  return [...sameCat, ...sameSeries].slice(0, n);
}

export const fmtDate = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
