import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_NAMES } from './config/blog';

// コラム（ブログ）記事：src/content/blog/ に .md を置くと公開されます。
// ファイル名がURLになります（例 dx-nippo.md → /blog/dx-nippo/）。先頭が _ のファイルは無視します。
const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(140),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // 使えるカテゴリと、それぞれの系統（しごとの話／ていねいな暮らし）は src/config/blog.ts
    category: z.enum(CATEGORY_NAMES),
    tags: z.array(z.string()).default([]),
    // 広告料・紹介料をいただいた記事は true（「PR」表記が自動で入ります。景品表示法のステマ規制への対応）
    pr: z.boolean().default(false),
    sponsor: z.string().optional(), // 広告主の名前（任意。記事冒頭の表記に入ります）
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
