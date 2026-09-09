import React, { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';
import ProjectThumbnail from '@/components/ProjectThumbnail';

const maxDescriptionLength = 150;

const ProjectsSection = () => {
  const { projects } = portfolioData;
  const trackRef = useRef<HTMLDivElement>(null);

  // The projects panel is one full-page "screen" like every other panel,
  // but has 5 cards to show — rather than break the one-panel-per-section
  // model (or cram all 5 into a cramped grid), they live in their own
  // horizontally-scrolling sub-carousel within this single panel.
  //
  // That sub-scroller sits inside the page's own horizontal-scroll
  // container (on desktop), so a mouse wheel over it needs its own
  // vertical→horizontal translation *and* to stop the event from bubbling
  // up — otherwise the outer container's identical wheel handler would also
  // fire and page between panels instead of scrolling the cards.
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    e.stopPropagation();
    track.scrollLeft += e.deltaY;
  };

  return (
    <section id="projects" className="min-h-screen bg-black py-20 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-12 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Portfólio
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            {projects.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-neutral-300">
            {projects.description}
          </p>
        </Reveal>

        <div
          ref={trackRef}
          onWheel={handleWheel}
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
        >
          {projects.items.map((project, index) => (
            <Reveal
              key={index}
              delay={index * 80}
              className="w-[85vw] shrink-0 snap-start sm:w-[380px]"
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/30">
                <div className="relative aspect-video overflow-hidden bg-neutral-900 transition-transform duration-500 group-hover:scale-105">
                  <ProjectThumbnail title={project.title} technologies={project.technologies} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-3 text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mb-4 flex-grow leading-relaxed text-neutral-400">
                    {project.description.length > maxDescriptionLength
                      ? project.description.slice(0, maxDescriptionLength) + '...'
                      : project.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 transition-colors group-hover:border-blue-400/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Código
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 text-white ${
                        project.live
                          ? 'bg-blue-600 hover:bg-blue-500'
                          : 'cursor-not-allowed bg-neutral-700 hover:bg-neutral-700'
                      }`}
                      onClick={() => project.live && window.open(project.live, '_blank')}
                      disabled={!project.live}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-neutral-600">
          arraste para ver mais →
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
