import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface PanelNavSection {
  id: string;
  label: string;
}

interface PanelNavProps {
  sections: PanelNavSection[];
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Slim dot navigation for the desktop horizontal-panel layout — the visible
 * affordance for "which panel am I on" / "how many are there" that pure
 * wheel/keyboard navigation lacks on its own. Desktop-only (md and up);
 * the mobile vertical stack doesn't need it.
 */
const PanelNav: React.FC<PanelNavProps> = ({ sections, containerRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActive = () => {
      const width = container.clientWidth || 1;
      const index = Math.round(container.scrollLeft / width);
      setActiveIndex(Math.min(sections.length - 1, Math.max(0, index)));
    };

    updateActive();
    container.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      container.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [containerRef, sections.length]);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
  }, []);

  return (
    <nav
      aria-label="Navegação entre seções"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => goTo(section.id)}
          aria-label={`Ir para ${section.label}`}
          aria-current={activeIndex === index ? 'true' : undefined}
          className="group flex items-center gap-3"
        >
          <span
            className={cn(
              'pointer-events-none whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100',
              activeIndex === index && 'opacity-100 text-white'
            )}
          >
            {section.label}
          </span>
          <span
            className={cn(
              'h-2.5 w-2.5 shrink-0 rounded-full border border-white/40 transition-all duration-300 motion-reduce:transition-none',
              activeIndex === index ? 'scale-125 bg-white' : 'bg-transparent group-hover:border-white/80'
            )}
          />
        </button>
      ))}
    </nav>
  );
};

export default PanelNav;
