import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions extends IntersectionObserverInit {
  /** Only trigger once, keep the element revealed afterwards. */
  once?: boolean;
}

/**
 * Tracks whether an element has scrolled into view, for subtle
 * "reveal on scroll" microinteractions. Falls back to always-visible
 * when IntersectionObserver isn't available or reduced motion is on.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: ScrollRevealOptions
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const { once = true, threshold = 0.15, rootMargin = '0px 0px -60px 0px', root = null } = options ?? {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}
