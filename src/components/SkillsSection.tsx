import React from 'react';
import { Layers, Palette, Server, Database } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const categoryIcons = [Layers, Palette, Server, Database];

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
}

// Thresholds borrowed from observability dashboards (green/blue/amber
// health bands) — a deliberate nod to Bruno's real day job (performance &
// observability), not just decoration.
function threshold(level: number) {
  if (level >= 85) return { label: 'avançado', text: 'text-emerald-400', bar: 'bg-emerald-500', dot: 'bg-emerald-400' };
  if (level >= 70) return { label: 'sólido', text: 'text-blue-400', bar: 'bg-blue-500', dot: 'bg-blue-400' };
  return { label: 'em evolução', text: 'text-amber-400', bar: 'bg-amber-500', dot: 'bg-amber-400' };
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, delay }) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const t = threshold(level);

  return (
    <div ref={ref} className="rounded-lg border border-white/5 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium text-neutral-300">
          <span className={`h-1.5 w-1.5 rounded-full ${t.dot} animate-pulse-slow`} />
          {name}
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-white">
          {isVisible ? level : 0}
          <span className="text-neutral-500">%</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-1.5 rounded-full ${t.bar} transition-[width] duration-1000 ease-out`}
          style={{ width: isVisible ? `${level}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
      <div className={`mt-1.5 text-right font-mono text-[10px] uppercase tracking-wide ${t.text}`}>
        {t.label}
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="min-h-screen bg-neutral-950 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Performance dashboard
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            {skills.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-neutral-300">
            {skills.description}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skills.categories.map((category, categoryIndex) => {
            const Icon = categoryIcons[categoryIndex % categoryIcons.length];
            return (
              <Reveal key={categoryIndex} delay={categoryIndex * 100}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skillIndex}
                        name={skill.name}
                        level={skill.level}
                        delay={skillIndex * 80}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Additional Info */}
        <Reveal delay={150} className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-12">
            <h3 className="mb-6 text-2xl font-bold text-white">{skills.additionalInfo.title}</h3>
            <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-neutral-300">
              {skills.additionalInfo.description}
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {skills.additionalInfo.highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${
                      index === 0
                        ? 'border-blue-400/30 bg-blue-500/10'
                        : index === 1
                          ? 'border-purple-400/30 bg-purple-500/10'
                          : 'border-green-400/30 bg-green-500/10'
                    }`}
                  >
                    <span className="text-2xl">{highlight.icon}</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-white">{highlight.title}</h4>
                  <p className="text-sm text-neutral-400">{highlight.description}</p>
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
