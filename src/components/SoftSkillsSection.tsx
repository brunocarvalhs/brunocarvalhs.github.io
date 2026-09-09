import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface SoftSkillCardProps {
  title: string;
  description: string;
  icon: string;
  level: number;
  delay: number;
}

const SoftSkillCard: React.FC<SoftSkillCardProps> = ({ title, description, icon, level, delay }) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <Reveal delay={delay}>
      <Card className="h-full border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/30">
        <CardHeader className="text-center">
          <div className="mb-4 text-4xl">{icon}</div>
          <CardTitle className="mb-2 text-xl text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 leading-relaxed text-neutral-400">{description}</p>

          <div ref={ref} className="mb-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-[width] duration-1000 ease-out"
              style={{ width: isVisible ? `${level}%` : '0%' }}
            />
          </div>
          <span className="text-sm tabular-nums text-neutral-500">{level}%</span>
        </CardContent>
      </Card>
    </Reveal>
  );
};

const SoftSkillsSection = () => {
  const { softSkills } = portfolioData;

  return (
    <section id="soft-skills" className="min-h-screen bg-black py-20 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Comportamental
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            {softSkills.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-neutral-300">
            {softSkills.description}
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {softSkills.skills.map((skill, index) => (
            <SoftSkillCard
              key={index}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
              level={skill.level}
              delay={index * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftSkillsSection;
