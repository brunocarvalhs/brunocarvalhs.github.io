import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import Terminal from '@/components/Terminal';
import Reveal from '@/components/Reveal';
import { useTypewriter } from '@/hooks/use-typewriter';

// The terminal window that "types out" the name — the primary visual of the
// Hero, per the brief ("meu nome escrito como se fosse no terminal"). It's
// also the trigger for the full interactive terminal (Terminal.tsx handles
// the dialog; this just supplies the trigger UI via its `trigger` prop).
const TerminalNameCard: React.FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => {
  const { output, done } = useTypewriter(name, 90, 500);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir terminal interativo"
      className="group w-full max-w-xl overflow-hidden rounded-xl border border-slate-700/50 bg-[#0b1120] text-left shadow-2xl shadow-black/40 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      <div className="flex items-center gap-2 border-b border-slate-700/50 bg-[#111827] px-4 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <p className="flex-1 text-center font-mono text-xs text-slate-400">bruno@carvalho: ~</p>
      </div>
      <div className="px-6 py-8 font-mono sm:px-8 sm:py-10">
        <p className="text-sm text-emerald-400/90">visitante@site:~$ whoami</p>
        <p className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          {output}
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-8 w-[10px] translate-y-1 bg-slate-300 animate-caret-blink group-hover:bg-emerald-400 sm:h-10"
          />
        </p>
        {done && (
          <p className="mt-3 font-mono text-xs text-slate-500 opacity-0 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:forwards]">
            clique para abrir o terminal →
          </p>
        )}
      </div>
    </button>
  );
};

const HeroSection = () => {
  const { hero } = portfolioData;

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github size={20} />;
      case 'Linkedin':
        return <Linkedin size={20} />;
      case 'Mail':
        return <Mail size={20} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-6 py-24 text-center md:py-28">
        <Reveal>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-blue-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Disponível para novos projetos
          </span>
        </Reveal>

        {/* Name, typed like a terminal — the main identity moment of the Hero */}
        <Reveal delay={80} className="flex w-full justify-center">
          <Terminal
            trigger={({ onClick }) => <TerminalNameCard name={hero.name} onClick={onClick} />}
          />
        </Reveal>

        {/* Info below the terminal: role + bio, as befits a mobile engineer */}
        <Reveal delay={200} className="mt-10 max-w-2xl">
          <p className="text-xl font-light text-blue-300 md:text-2xl">{hero.title}</p>
          <p className="mt-4 text-balance text-lg leading-relaxed text-slate-300">
            {hero.description}
          </p>
        </Reveal>

        <Reveal delay={280} className="mt-8 flex space-x-4">
          {hero.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15"
            >
              {getIcon(link.icon)}
            </a>
          ))}
        </Reveal>

        <Reveal delay={340} className="mt-8">
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="rounded-full border-0 bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Ver Projetos
          </Button>
        </Reveal>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce motion-reduce:animate-none">
          <ArrowDown className="text-white/60" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
