import { useEffect } from 'react';
import { site } from '../content/site';

/** Per-route <title> and meta description; restores the defaults on unmount. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    if (!title) return;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevTitle = document.title;
    const prevDesc = desc?.content;
    document.title = title;
    if (desc && description) desc.content = description;
    return () => {
      document.title = prevTitle || site.title;
      if (desc && prevDesc) desc.content = prevDesc;
    };
  }, [title, description]);
}
