import React from 'react';
import { useLocation } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

const Footer = () => {
  const { hero } = portfolioData;
  const year = new Date().getFullYear();
  const location = useLocation();

  // Home folds this content (copyright + socials) into the bottom of the
  // Contact panel/section instead — on the horizontal-panel desktop layout
  // there's no separate scrollable strip below everything to put a footer
  // in, and reusing the same ContactSection component for the mobile
  // vertical stack means it'd otherwise show up twice there. Every other
  // route (e.g. /legal) keeps this standalone footer as before.
  if (location.pathname === '/') return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github size={18} />;
      case 'Linkedin':
        return <Linkedin size={18} />;
      default:
        return null;
    }
  };

  return (
    <footer className="border-t border-white/5 bg-gray-900 py-10 text-white dark:bg-gray-950">
      <div className="container mx-auto flex flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © {year} {hero.name}. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-3">
          {hero.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors duration-300 hover:bg-white/10 hover:text-white"
            >
              {getIcon(link.icon)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
