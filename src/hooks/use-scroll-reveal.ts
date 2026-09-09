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

    const { once = true, threshold = 0.15, rootMargin = '0px 0px -60px 0px', root } = options ?? {};

    // On the horizontal-panel desktop layout, sections live inside a
    // horizontally-scrolling container instead of the vertical document
    // viewport. IntersectionObserver only reports "in view" relative to its
    // `root` — the default (null) is the viewport, which never scrolls
    // horizontally, so entries would incorrectly report visible immediately.
    // Using the nearest `[data-panel-scroll-root]` ancestor as root makes
    // "becomes visible" mean "panel becomes active" in that layout, while
    // falling back to the normal viewport root on the vertical mobile stack
    // (where no such ancestor exists).
    const panelRoot = root ?? (node.closest('[data-panel-scroll-root]') as Element | null);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin, root: panelRoot }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}
