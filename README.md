# nekoyashiki 公式サイト

宮城県仙台市の nekoyashiki（ねこやしき）の公式サイトです。静的サイトジェネレーター [Astro](https://astro.build/) で作っています。

- デザインの元データ：`design/`（Claude Design の `.dc.html` と制作指示書 `HANDOFF.md`）
- 画像：`public/assets/`（ロゴ・背景の猫）、`public/og.png`（SNSで共有したときの画像）

## ページ

| ページ | URL | ファイル |
|---|---|---|
| トップ | `/` | `src/pages/index.astro` |
| 事業者様 | `/business/` | `src/pages/business.astro` |
| 個人様 | `/personal/` | `src/pages/personal.astro` |
| できること・料金 | `/services/` | `src/pages/services.astro` |
| 実績 | `/works/` | `src/pages/works.astro` |
| わたしたち | `/about/` | `src/pages/about.astro` |
| お問い合わせ | `/contact/` | `src/pages/contact.astro` |
| プライバシーポリシー | `/privacy/` | `src/pages/privacy.astro` |
| 採用情報（非公開） | `/recruit/` | `src/pages/recruit.astro` |

採用情報は `noindex` で、どのページからもリンクしておらず、サイトマップにも載せていません。

## よく変える設定（`src/config/site.ts`）

| 項目 | 説明 |
|---|---|
| `LINE_URL` | 公式LINEの友だち追加URL。空のあいだは「LINEで相談」ボタンが「フォーム」「電話」のボタンになります。URLを入れると全ページのボタンがLINEに切り替わります。 |
| `FORM_ENDPOINT` | お問い合わせフォームの送信先（Formspree などのURL）。空のあいだは、送信ボタンでメールアプリが開き、入力内容が本文に入ります。 |
| `LINKS.instagram` | Instagram のURL。空のあいだはフッターに表示しません。 |
| `SITE` | 屋号・代表・住所・電話・メール・営業時間など。 |

## 開発

```sh
npm install
npm run dev      # http://localhost:4321 で確認
npm run build    # dist/ に書き出し
npm run preview  # 書き出したサイトを確認
```

ファビコンPNGとOGP画像を作り直すときは `node scripts/make-images.cjs`（Playwright が必要）。

## 公開

`npm run build` で `dist/` にできたファイルを、そのまま静的ホスティングに置けば動きます。
Cloudflare Pages / Netlify / Vercel の場合は、このリポジトリをつなぎ、ビルドコマンド `npm run build`、公開フォルダ `dist` を指定します。

## 背景の猫

`src/components/Cat.astro`（配置）、`src/styles/global.css` の「背景の猫」（動き）、`src/scripts/cats.ts`（CSS のスクロール連動アニメーションに対応していないブラウザ向けの代替）。
`prefers-reduced-motion: reduce` のときは動かず、定位置に止まります。

## 差し替え待ち

- 写真：`Dummy` コンポーネントの枠（薄いグレー）。写真が届いたら `<img>` に置き換えます。
- 採用情報の【】の項目。
- 公式LINEのURL、フォームの送信先、Instagram のURL。
