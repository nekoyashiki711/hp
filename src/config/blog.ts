// コラムの「系統」と「カテゴリ」
// 記事の .md には category だけを書きます。系統はカテゴリから自動で決まるので、1つの記事が2つの系統に混ざることはありません。

export const SERIES = {
  shigoto: {
    label: 'しごとの話',
    en: 'WORK',
    path: '/blog/shigoto/',
    title: 'しごとの話｜宮城の運送・建築・事務を軽くするコラム｜nekoyashiki',
    description:
      '宮城県仙台市の nekoyashiki のコラム「しごとの話」。運送・建築の現場のIT・DX化、事務や経理の負担を減らす工夫、新規事業や売上の柱を増やすヒントをお届けします。',
    lead: '運送・建築の現場や事務の仕事を軽くするやり方と、売上の柱を増やすヒントを書いています。',
  },
  kurashi: {
    label: 'ていねいな暮らし',
    en: 'LOCAL LIFE',
    path: '/blog/kurashi/',
    title: 'ていねいな暮らし｜宮城・東北の山、温泉、食、祭りのコラム｜nekoyashiki',
    description:
      'nekoyashiki のコラム「ていねいな暮らし」。宮城・東北の山と温泉、日本酒や名物、祭りと歴史、移住や開業の情報を、地元で暮らす目線でお届けします。',
    lead: '宮城・東北の山や温泉、食べもの、祭りと歴史を、地元で暮らす目線で紹介しています。',
  },
} as const;

export type SeriesKey = keyof typeof SERIES;

// name は .md の category に書く文字、slug はカテゴリページのURL（/blog/category/<slug>/）
export const CATEGORIES = [
  { name: '運送・建築', slug: 'unso-kenchiku', series: 'shigoto' },
  { name: '業務のIT・DX化', slug: 'dx', series: 'shigoto' },
  { name: '事務・経理', slug: 'jimu-keiri', series: 'shigoto' },
  { name: '新規事業・副業', slug: 'shinki-jigyo', series: 'shigoto' },
  { name: 'HP・集客', slug: 'hp-shukyaku', series: 'shigoto' },
  { name: 'デザイン', slug: 'design', series: 'shigoto' },
  { name: '暮らしのサービス', slug: 'kurashi-service', series: 'shigoto' },
  { name: '食べる・飲む', slug: 'taberu-nomu', series: 'kurashi' },
  { name: '山・自転車・スキー', slug: 'outdoor', series: 'kurashi' },
  { name: '温泉・旅', slug: 'onsen-tabi', series: 'kurashi' },
  { name: '祭り・歴史', slug: 'matsuri-rekishi', series: 'kurashi' },
  { name: '移住・開業', slug: 'iju-kaigyo', series: 'kurashi' },
  { name: 'お知らせ', slug: 'oshirase', series: null },
] as const satisfies readonly { name: string; slug: string; series: SeriesKey | null }[];

export type Category = (typeof CATEGORIES)[number];
export type CategoryName = Category['name'];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name) as [CategoryName, ...CategoryName[]];

export const categoryOf = (name: string): Category => {
  const c = CATEGORIES.find((x) => x.name === name);
  if (!c) throw new Error(`未登録のカテゴリ: ${name}`);
  return c;
};
export const categoryPath = (name: string) => `/blog/category/${categoryOf(name).slug}/`;

// 記事のファイル名に使えない名前（一覧ページのURLと重なるため）
export const RESERVED_SLUGS = ['shigoto', 'kurashi', 'category'];
