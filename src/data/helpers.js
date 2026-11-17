import site from './site.json';

const preview = import.meta.env.PREVIEW === '1' || process.env.PREVIEW === '1';

/** Ссылка на страницу сайта: в предпросмотре — плоские .html-файлы. */
export function link(path = '') {
  const clean = path.replace(/^\/|\/$/g, '');
  if (!clean) return preview ? 'index.html' : '/';
  return preview ? `${clean}.html` : `/${clean}/`;
}

/** Ссылка в WhatsApp менеджеру с готовым текстом. */
export function wa(text = 'Здравствуйте! Хочу узнать про отдых в Гудаури.') {
  return `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(text)}`;
}
