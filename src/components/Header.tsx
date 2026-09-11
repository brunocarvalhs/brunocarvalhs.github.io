import React, { useState, useEffect } from 'react';
import { Menu, X, Scale } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useStrings } from '@/i18n/strings';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const t = useStrings();

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = t.nav.items;
  const sectionIds = ['hero', 'about', 'projects', 'skills', 'testimonials', 'contact'];

  const baseLinkClass = `transition-colors duration-300 font-medium`;

  // Both states need a `dark:` pair — at the top of the page (`!isScrolled`)
  // this sits directly over the Hero, whose background now follows the
  // site's light/dark toggle instead of always being dark, so a fixed
  // `text-white` here goes invisible in light mode.
  const linkClass = isScrolled
    ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    : 'text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 pb-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 shadow-md backdrop-blur-md dark:bg-gray-900/85'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          {isHomePage ? (
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="gradient-text text-xl font-extrabold tracking-tight sm:text-2xl"
            >
              Bruno Carvalho
            </button>
          ) : (
            <Link to="/#hero" className="gradient-text text-xl font-extrabold tracking-tight sm:text-2xl">
              Bruno Carvalho
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item, index) =>
              isHomePage ? (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionIds[index])}
                  className={`relative ${linkClass} ${baseLinkClass} after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {item}
                </button>
              ) : (
                <Link
                  key={item}
                  to={`/#${sectionIds[index]}`}
                  className={`relative ${linkClass} ${baseLinkClass} after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {item}
                </Link>
              )
            )}

            <Link to="/legal">
              <Button variant="outline" size="sm">
                <Scale className="mr-2 h-4 w-4" />
                {t.nav.legal}
              </Button>
            </Link>

            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className={`${linkClass}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mt-4 rounded-lg bg-white/95 py-4 shadow-lg backdrop-blur-md dark:bg-gray-800/95 md:hidden">
            {navItems.map((item, index) =>
              isHomePage ? (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionIds[index])}
                  className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 ${baseLinkClass}`}
                >
                  {item}
                </button>
              ) : (
                <Link
                  key={item}
                  to={`/#${sectionIds[index]}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 ${baseLinkClass}`}
                >
                  {item}
                </Link>
              )
            )}
            <Link
              to="/legal"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 ${baseLinkClass}`}
            >
              <Scale className="h-4 w-4" />
              {t.nav.legal}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
