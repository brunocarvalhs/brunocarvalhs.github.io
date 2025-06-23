import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import portfolioData from '@/data/portfolio.json';
import { SiAndroid, SiReact, SiKotlin } from 'react-icons/si';

const HeroSection = () => {
  const { hero } = portfolioData;

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-left animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {hero.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-300 mb-4 font-light">
              {hero.title}
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {hero.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-6 mb-12">
              {hero.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20"
                >
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-full border-0"
            >
              Ver Projetos
            </Button>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="relative w-100 h-100 lg:w-100 lg:h-100 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 overflow-hidden shadow-2xl">
                <img
                  src={hero.profileImage}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-full bg-white/30 rounded-2xl flex items-center justify-center text-white text-6xl font-bold hidden">
                  {hero.fallbackInitials}
                </div>

                <div className="absolute top-8 left-8 w-14 h-14 bg-green-600 rounded-2xl animate-float flex items-center justify-center">
                  <SiAndroid className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-12 right-14 w-16 h-16 bg-sky-400 rounded-2xl animate-float-delay-1 flex items-center justify-center">
                  <SiReact className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-20 right-6 w-12 h-12 bg-purple-600 rounded-2xl animate-float-delay-2 flex items-center justify-center">
                  <SiKotlin className="w-6 h-6 text-white" />
                </div>
              </div>

              
              {/* Decorative elements around the image */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-white/60" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
