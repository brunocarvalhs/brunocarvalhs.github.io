import React from 'react';
import { Code, Lightbulb, Users, Zap } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';

const AboutSection = () => {
  const { about } = portfolioData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="h-7 w-7" />;
      case 'Lightbulb':
        return <Lightbulb className="h-7 w-7" />;
      case 'Users':
        return <Users className="h-7 w-7" />;
      case 'Zap':
        return <Zap className="h-7 w-7" />;
      default:
        return null;
    }
  };

  const statColors = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-orange-400'];

  return (
    <section id="about" className="min-h-screen bg-neutral-950 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Sobre mim
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            {about.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg leading-relaxed text-neutral-300">
            {about.description}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {about.features.map((feature, index) => (
            <Reveal key={index} delay={index * 90}>
              <div className="group h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/30 hover:bg-white/[0.06]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400 transition-transform duration-300 group-hover:scale-110">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-neutral-400">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={120}
          className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-12"
        >
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold text-white">{about.journey.title}</h3>
              <p className="mb-6 leading-relaxed text-neutral-300">{about.journey.description1}</p>
              <p className="leading-relaxed text-neutral-300">{about.journey.description2}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-8">
              <div className="grid grid-cols-2 gap-6">
                {about.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`mb-2 text-3xl font-bold tabular-nums ${statColors[index % statColors.length]}`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
