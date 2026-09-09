import React from 'react';
import { ExternalLink, Github, Star, RefreshCw, GitFork, Users, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';
import ProjectThumbnail from '@/components/ProjectThumbnail';
import { useGithubProjects } from '@/hooks/use-github-projects';
import { useGithubProfileStats } from '@/hooks/use-github-profile-stats';

const maxDescriptionLength = 150;
const GITHUB_USER = 'brunocarvalhs';

type CardData = {
  title: string;
  description: string;
  technologies: string[];
  github: string;
  live: string | null;
  stars?: number;
};

const ProjectsSection = () => {
  const { projects } = portfolioData;
  const { projects: githubProjects, loading, error } = useGithubProjects(6);
  const { stats } = useGithubProfileStats();

  // Live GitHub repos (recent + starred, deduped) are the primary source —
  // real, always current, no manual upkeep. If the fetch fails or the
  // account has nothing eligible yet, fall back to the curated list in
  // portfolio.json so the section never renders empty or broken.
  const useLive = !loading && !error && githubProjects.length > 0;

  const cards: CardData[] = useLive
    ? githubProjects.map((repo) => ({
        title: repo.name,
        description: repo.description ?? 'Sem descrição no GitHub ainda.',
        technologies: [repo.language, ...repo.topics].filter((t): t is string => Boolean(t)).slice(0, 4),
        github: repo.htmlUrl,
        live: repo.homepage || null,
        stars: repo.stars,
      }))
    : projects.items.map((p) => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        github: p.github,
        live: p.live,
      }));

  return (
    <section id="projects" className="min-h-screen bg-white py-20 dark:bg-black md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-12 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Portfólio
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {projects.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-gray-600 dark:text-neutral-300">
            {projects.description}
          </p>
          {useLive && (
            <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-gray-400 dark:text-neutral-500">
              <RefreshCw className="h-3 w-3" />
              repositórios mais recentes e populares, direto do GitHub
            </p>
          )}
        </Reveal>

        {/* Dashboard strip: live GitHub stat tiles + contribution heatmap */}
        {stats && (
          <Reveal className="mb-10">
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Code2, label: 'Repositórios', value: stats.publicRepos },
                { icon: Star, label: 'Estrelas', value: stats.totalStars },
                { icon: Users, label: 'Seguidores', value: stats.followers },
                { icon: GitFork, label: 'Linguagem principal', value: stats.topLanguage ?? '—' },
              ].map((tile) => (
                <div
                  key={tile.label}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-sm"
                >
                  <tile.icon className="mx-auto mb-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="font-mono text-xl font-bold tabular-nums text-gray-900 dark:text-white sm:text-2xl">
                    {tile.value}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">{tile.label}</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 sm:p-6">
              <img
                src={`https://ghchart.rshah.org/2563eb/${GITHUB_USER}`}
                alt={`Mapa de contribuições de ${GITHUB_USER} no GitHub`}
                className="mx-auto min-w-[640px]"
                loading="lazy"
              />
            </div>
          </Reveal>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((project, index) => (
            <Reveal key={project.title + index} delay={index * 80} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-sm dark:hover:border-blue-400/30">
                <div className="relative aspect-video overflow-hidden bg-gray-100 transition-transform duration-500 group-hover:scale-105 dark:bg-neutral-900">
                  <ProjectThumbnail title={project.title} technologies={project.technologies} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {typeof project.stars === 'number' && project.stars > 0 && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs text-amber-300 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-current" />
                      {project.stars}
                    </span>
                  )}
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="mb-4 flex-grow leading-relaxed text-gray-600 dark:text-neutral-400">
                    {project.description.length > maxDescriptionLength
                      ? project.description.slice(0, maxDescriptionLength) + '...'
                      : project.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors group-hover:border-blue-300 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:group-hover:border-blue-400/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
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
                          : 'cursor-not-allowed bg-gray-300 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-700'
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
      </div>
    </section>
  );
};

export default ProjectsSection;
