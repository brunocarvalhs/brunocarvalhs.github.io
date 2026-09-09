import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import { SiAndroid, SiReact, SiKotlin } from 'react-icons/si';
import Terminal from '@/components/Terminal';
import Reveal from '@/components/Reveal';

const HeroSection = () => {
  const { hero } = portfolioData;

  // "Bruno Carvalho" → light "BRUNO" + bold "CARVALHO", the mixed-weight
  // display treatment this redesign borrows from brunocarvalho.me. Falls
  // back to the plain name if it's ever just a single word.
  const [firstName, ...restName] = hero.name.split(' ');
  const lastName = restName.join(' ');

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
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

      <div className="container relative z-10 mx-auto px-6 py-20 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Side - Content */}
          <div className="text-left">
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-blue-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Disponível para novos projetos
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-balance leading-[0.95] tracking-tight text-white">
                <span className="block text-5xl font-light md:text-6xl lg:text-7xl">
                  {firstName}
                </span>
                {lastName && (
                  <span className="block text-5xl font-black md:text-6xl lg:text-7xl">
                    {lastName.toUpperCase()}
                  </span>
                )}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mb-4 mt-4 text-xl font-light text-blue-300 md:text-2xl">
                {hero.title}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <p className="mb-6 max-w-xl text-balance text-lg leading-relaxed text-slate-300">
                {hero.description}
              </p>
            </Reveal>

            {/* Terminal easter-egg trigger */}
            <Reveal delay={300}>
              <Terminal className="mb-8" />
            </Reveal>

            <Reveal delay={360}>
              <div className="mb-10 flex space-x-4">
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
              </div>

              <Button
                onClick={scrollToProjects}
                size="lg"
                className="rounded-full border-0 bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Ver Projetos
              </Button>
            </Reveal>
          </div>

          {/* Right Side - Profile Image */}
          <Reveal delay={200} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/40 via-purple-500/20 to-transparent blur-2xl" />
              <div className="relative h-[420px] w-[320px] overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm sm:h-[480px] sm:w-[380px]">
                <img
                  src={hero.profileImage}
                  alt={hero.name}
                  className="mx-auto h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center rounded-2xl bg-white/30 text-6xl font-bold text-white">
                  {hero.fallbackInitials}
                </div>

                <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-lg animate-float">
                  <SiAndroid className="h-8 w-8 text-white" />
                </div>
                <div
                  className="absolute bottom-10 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400 shadow-lg animate-float-delay-1"
                >
                  <SiReact className="h-7 w-7 text-white" />
                </div>
                <div
                  className="absolute right-2 top-16 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 shadow-lg animate-float-delay-2"
                >
                  <SiKotlin className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Decorative elements around the image */}
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-500/20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-purple-500/20 blur-xl" />
            </div>
          </Reveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce motion-reduce:animate-none">
          <ArrowDown className="text-white/60" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
