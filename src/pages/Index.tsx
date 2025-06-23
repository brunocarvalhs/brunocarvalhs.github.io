import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import SwotSection from '@/components/SwotSection';
import SoftSkillsSection from '@/components/SoftSkillsSection';
import HardSkillsSection from '@/components/HardSkillsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <SoftSkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
