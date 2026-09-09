import { useEffect, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import SoftSkillsSection from '@/components/SoftSkillsSection';
import ContactSection from '@/components/ContactSection';
import HomePanel from '@/components/HomePanel';
import PanelNav, { PanelNavSection } from '@/components/PanelNav';
import { useMediaQuery } from '@/hooks/use-media-query';

const PANELS: PanelNavSection[] = [
  { id: 'hero', label: 'Início' },
  { id: 'about', label: 'Sobre' },
  { id: 'projects', label: 'Projetos' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'soft-skills', label: 'Perfil' },
  { id: 'contact', label: 'Contato' },
];

const DESKTOP_QUERY = '(min-width: 768px)';

/**
 * Home. Desktop (md+, matching Tailwind's `md` breakpoint) renders the six
 * sections as full-page horizontal panels with scroll-snap, wheel/keyboard
 * paging and a dot nav. Below that breakpoint, true horizontal-scroll-
 * hijacking fights the browser's native back/forward swipe gesture and
 * feels bad on touch — so mobile instead gets a normal vertical stack of
 * the same sections/components, closer to the original layout.
 *
 * The two layouts are rendered mutually exclusively (not both-in-DOM with
 * one CSS-hidden) because the section components contain element `id`s
 * (panel anchors, form field ids/labels) that would otherwise collide as
 * duplicates in the DOM. That's safe to do with a plain `useMediaQuery`
 * check here — this app is a pure client-rendered SPA with no SSR markup to
 * flash against on first paint.
 */
const Index = () => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Wheel → horizontal scroll: the standard "translate vertical wheel delta
  // into horizontal scroll" pattern for this kind of layout.
  useEffect(() => {
    if (!isDesktop) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal (trackpad), let it through
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isDesktop]);

  // Left/right arrow keys page between panels. Ignored while the user is
  // typing in a form field (including the terminal's command input).
  useEffect(() => {
    if (!isDesktop) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;

      e.preventDefault();
      const width = container.clientWidth || 1;
      const currentIndex = Math.round(container.scrollLeft / width);
      const nextIndex =
        e.key === 'ArrowRight'
          ? Math.min(PANELS.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);

      document
        .getElementById(PANELS[nextIndex].id)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesktop]);

  if (isDesktop) {
    return (
      <>
        <div
          ref={scrollRef}
          data-panel-scroll-root
          className="flex h-screen w-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth motion-reduce:scroll-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <HomePanel>
            <HeroSection />
          </HomePanel>
          <HomePanel>
            <AboutSection />
          </HomePanel>
          <HomePanel>
            <ProjectsSection />
          </HomePanel>
          <HomePanel>
            <SkillsSection />
          </HomePanel>
          <HomePanel>
            <SoftSkillsSection />
          </HomePanel>
          <HomePanel>
            <ContactSection />
          </HomePanel>
        </div>

        <PanelNav sections={PANELS} containerRef={scrollRef} />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <SoftSkillsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
