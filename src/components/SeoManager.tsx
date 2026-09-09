import { useEffect } from 'react';
import { useStrings } from '@/i18n/strings';

/**
 * index.html ships the pt-BR title/meta as the build-time default (so the
 * very first paint and any crawler that skips JS still get real content).
 * This keeps the visible tab title and meta description in sync with the
 * detected/selected language for everyone else. It can't localize what
 * static social-card scrapers see (they don't run JS), only what the
 * visitor's own browser shows.
 */
const SeoManager = () => {
  const t = useStrings();

  useEffect(() => {
    document.title = t.seo.title;

    const setMeta = (selector: string, content: string) => {
      document.querySelector(selector)?.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', t.seo.description);
    setMeta('meta[property="og:title"]', t.seo.title);
    setMeta('meta[property="og:description"]', t.seo.description);
    setMeta('meta[property="og:locale"]', t.seo.ogLocale);
    setMeta('meta[name="twitter:title"]', t.seo.title);
    setMeta('meta[name="twitter:description"]', t.seo.description);
  }, [t]);

  return null;
};

export default SeoManager;
