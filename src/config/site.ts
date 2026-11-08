// サイト全体で使う固定情報。値を変えると全ページに反映されます。

export const SITE = {
  url: 'https://nekoyashiki.life',
  name: 'nekoyashiki',
  nameKana: 'ねこやしき',
  tagline: '地域経済活性化のベストパートナー',
  taglineEn: 'Maximizing synergies in the City of Trees through the power of connection.',
  catchEn: 'Work, lighter.',
  representative: '齋藤 幸永',
  representativeKana: 'さいとう ゆきなが',
  nickname: 'ゆっきー',
  postalCode: '980-0822',
  address: '宮城県仙台市青葉区立町10-1',
  addressRegion: '宮城県',
  addressLocality: '仙台市青葉区',
  streetAddress: '立町10-1',
  tel: '080-2815-3758',
  email: 'yukky@nekoyashiki.life',
  hours: '平日 9:00〜19:00',
  area: '宮城県全域（県外はオンラインで対応）',
};

/**
 * 公式LINEの友だち追加URL（例: https://lin.ee/xxxxxxx）。
 * 空のあいだは、LINEボタンが「フォーム」「電話」のボタンに置き換わります。
 * URLを入れるだけで、全ページのボタンがLINEに切り替わります。
 */
export const LINE_URL = '';

/**
 * お問い合わせフォームの送信先（Formspree などのエンドポイント。例: https://formspree.io/f/xxxxxxx）。
 * 空のあいだは、送信ボタンでメールアプリが開き、入力内容がメール本文に入ります。
 */
export const FORM_ENDPOINT = '';

export const LINKS = {
  bouhan: 'https://bouhan.news/',
  kikuta: 'https://kikuta.group/',
  instagram: '', // 決まったら URL を入れる。空のあいだはフッターに表示しません
};

export const hasLine = LINE_URL !== '';

export const PATHS = {
  home: '/',
  business: '/business/',
  personal: '/personal/',
  services: '/services/',
  works: '/works/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
  recruit: '/recruit/',
};

// ヘッダー・フッター・スマホメニュー共通（採用情報は載せない）
export const NAV = [
  { href: PATHS.business, label: '事業者様', en: 'FOR BUSINESS' },
  { href: PATHS.personal, label: '個人様', en: 'FOR PERSONAL' },
  { href: PATHS.services, label: 'できること' },
  { href: PATHS.works, label: '実績' },
  { href: PATHS.about, label: 'わたしたち' },
  { href: PATHS.contact, label: 'お問い合わせ' },
];

export const telHref = `tel:${SITE.tel.replace(/-/g, '')}`;
export const mailHref = (subject?: string) =>
  `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
