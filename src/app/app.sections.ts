import { HomeComponent } from './pages/home/home.component'

interface Section {
  id: String;
  name: String;
}

export const sections: Section[] = [
  { id: 'home-section', name: 'Home' },
  { id: 'about-section', name: 'About' },
  { id: 'projects-section', name: 'Projects' },
  { id: 'skills-section', name: 'Skills' },
  { id: 'contact-section', name: 'Contact' },
];
