import React, { useState, useEffect } from 'react';
import { Menu, X, Scale } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = ['Início', 'Sobre', 'Projetos', 'Habilidades', 'Contato'];
  const sectionIds = ['hero', 'about', 'projects', 'skills', 'contact'];

  const baseLinkClass = `transition-colors duration-300 font-medium`;
  const linkClass = isScrolled
    ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    : 'text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <header
      className={`pb-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className={`text-2xl font-bold gradient-text`}>
            Bruno Carvalho
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) =>
              isHomePage ? (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionIds[index])}
                  className={`${linkClass} ${baseLinkClass}`}
                >
                  {item}
                </button>
              ) : (
                <Link
                  key={item}
                  to={`/#${sectionIds[index]}`}
                  className={`${linkClass} ${baseLinkClass}`}
                >
                  {item}
                </Link>
              )
            )}

            <Link to="/legal">
              <Button variant="outline" size="sm">
                <Scale className="h-4 w-4 mr-2" />
                Legal
              </Button>
            </Link>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className={`${linkClass}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {navItems.map((item, index) =>
              isHomePage ? (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionIds[index])}
                  className={`${linkClass} block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${baseLinkClass}`}
                >
                  {item}
                </button>
              ) : (
                <Link
                  key={item}
                  to={`/#${sectionIds[index]}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${linkClass} block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${baseLinkClass}`}
                >
                  {item}
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
