import React from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, Users, Code2, Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePortfolioData } from '@/hooks/use-portfolio-data';
import Reveal from '@/components/Reveal';
import { useGithubProfileStats } from '@/hooks/use-github-profile-stats';
import { useStrings } from '@/i18n/strings';

const GITHUB_USER = 'brunocarvalhs';

const ProjectsSection = () => {
  const { projects } = usePortfolioData();
  const { stats } = useGithubProfileStats();
  const t = useStrings();

  return (
    <section id="projects" className="min-h-screen bg-white py-20 dark:bg-black md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-12 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            {t.projects.eyebrow}
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {projects.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-gray-600 dark:text-neutral-300">
            {projects.description}
          </p>
        </Reveal>

        {/* Dashboard strip: live GitHub stat tiles + contribution heatmap */}
        {stats && (
          <Reveal className="mb-10">
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Code2, label: t.projects.statRepos, value: stats.publicRepos },
                { icon: Star, label: t.projects.statStars, value: stats.totalStars },
                { icon: Users, label: t.projects.statFollowers, value: stats.followers },
                { icon: GitFork, label: t.projects.statTopLanguage, value: stats.topLanguage ?? '—' },
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
                alt={t.projects.contributionMapAlt(GITHUB_USER)}
                className="mx-auto min-w-[640px]"
                loading="lazy"
              />
            </div>
          </Reveal>
        )}

        <div className="mt-12 text-center">
          <Link to="/loja">
            <Button size="lg" className="group bg-blue-600 text-white hover:bg-blue-500">
              <Store className="h-4 w-4" />
              {t.projects.storeCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
