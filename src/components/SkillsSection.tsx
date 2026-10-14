import React, { useMemo } from 'react';
import { usePortfolioData } from '@/hooks/use-portfolio-data';
import { useGithubProjects } from '@/hooks/use-github-projects';
import Reveal from '@/components/Reveal';
import { pickIcon, slugifyTitle } from '@/components/ProjectThumbnail';
import { useStrings } from '@/i18n/strings';

export type HardSkill = { name: string; count: number };

/**
 * Hard skills = technologies actually present in my projects, ranked by how
 * many projects use each. Each project is `{ url, technologies }`; entries
 * with the same url (a curated portfolio.json project that is also a live
 * GitHub repo) are merged so a project is never counted twice. Names are
 * deduped by slug ("Jetpack Compose" == "jetpack-compose"), keeping the first
 * spelling seen — pass curated/language sources before raw GitHub topics so
 * the nicer casing wins.
 */
export function collectHardSkills(projects: { url: string; technologies: string[] }[]): HardSkill[] {
  const byProject = new Map<string, Set<string>>();
  const label = new Map<string, string>();
  for (const { url, technologies } of projects) {
    const key = url.toLowerCase();
    const set = byProject.get(key) ?? new Set<string>();
    for (const tech of technologies) {
      const slug = slugifyTitle(tech);
      if (!slug) continue;
      if (!label.has(slug)) label.set(slug, tech);
      set.add(slug);
    }
    byProject.set(key, set);
  }
  const counts = new Map<string, number>();
  for (const set of byProject.values()) for (const slug of set) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  return [...counts.entries()]
    .map(([slug, count]) => ({ name: label.get(slug), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const SkillsSection = () => {
  const { skills, projects } = usePortfolioData();
  const { projects: repos } = useGithubProjects(100);
  const t = useStrings();

  const hardSkills = useMemo(
    () =>
      collectHardSkills([
        ...projects.items.map((p) => ({ url: p.github, technologies: p.technologies })),
        ...repos.map((r) => ({ url: r.htmlUrl, technologies: [r.language, ...r.topics].filter(Boolean) as string[] })),
      ]),
    [projects, repos]
  );
  const maxCount = hardSkills[0]?.count ?? 1;

  return (
    <section id="skills" className="min-h-screen bg-gray-50 py-20 dark:bg-neutral-950 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            {t.skills.eyebrow}
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {skills.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-gray-600 dark:text-neutral-300">
            {skills.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {hardSkills.map((skill, index) => {
            const Icon = pickIcon([skill.name]);
            return (
              <Reveal key={skill.name} delay={Math.min(index, 12) * 40}>
                <div className="h-full rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-400/30">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span className="truncate font-medium text-gray-900 dark:text-white">{skill.name}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${(skill.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 font-mono text-xs text-gray-500 dark:text-neutral-500">
                    {t.skills.projectCount(skill.count)}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Additional Info */}
        <Reveal delay={150} className="mt-16 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-sm md:p-12">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{skills.additionalInfo.title}</h3>
            <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-gray-600 dark:text-neutral-300">
              {skills.additionalInfo.description}
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {skills.additionalInfo.highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${
                      index === 0
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-500/10'
                        : index === 1
                          ? 'border-purple-200 bg-purple-50 dark:border-purple-400/30 dark:bg-purple-500/10'
                          : 'border-green-200 bg-green-50 dark:border-green-400/30 dark:bg-green-500/10'
                    }`}
                  >
                    <span className="text-2xl">{highlight.icon}</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{highlight.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SkillsSection;
