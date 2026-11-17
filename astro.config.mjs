import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// RU — язык по умолчанию в демо. EN и UK подключаются добавлением
// переводов в src/data и страниц в src/pages/en, src/pages/uk.
// PREVIEW=1 собирает плоские .html-файлы для предпросмотра без сервера.
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  site: 'https://snowtime.ge',
  trailingSlash: preview ? 'ignore' : 'always',
  build: { format: preview ? 'file' : 'directory' },
  i18n: { defaultLocale: 'ru', locales: ['ru', 'en', 'uk'], routing: { prefixDefaultLocale: false } },
  integrations: [sitemap()],
});
