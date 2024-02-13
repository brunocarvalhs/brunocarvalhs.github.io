import { HomeComponent } from './pages/home/home.component'

interface Section {
  id: String;
  name: String;
}

export const sections: Section[] = [
  { id: 'home-section', name: 'Home' },
  { id: 'about-section', name: 'About' },
  { id: 'resume-section', name: 'Resume' },
  { id: 'services-section', name: 'Services' },
  { id: 'skills-section', name: 'Skills' },
  { id: 'projects-section', name: 'Projects' },
  { id: 'blog-section', name: 'My Blog' },
  { id: 'contact-section', name: 'Contact' },
];
