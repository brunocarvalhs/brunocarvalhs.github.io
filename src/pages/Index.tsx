import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import SoftSkillsSection from '@/components/SoftSkillsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';

/**
 * Home: a plain vertical stack of full-screen (`min-h-screen`) sections.
 * Each section reveals its content on scroll via `Reveal` /
 * `use-scroll-reveal` (viewport IntersectionObserver — no custom scroll
 * container needed here). Order is the narrative: who I am → my story →
 * what I've built → what I know → what people say → how to reach me.
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <SoftSkillsSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
