import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// コラム（ブログ）記事：src/content/blog/ に .md を置くと公開されます。
// ファイル名がURLになります（例 dx-nippo.md → /blog/dx-nippo/）。先頭が _ のファイルは無視します。
const blog = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(140),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['業務のIT・DX化', 'HP・集客', 'デザイン', '暮らしのサービス', 'お知らせ']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
