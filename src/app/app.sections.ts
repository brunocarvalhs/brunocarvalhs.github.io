import { HomeComponent } from './pages/home/home.component'

interface Section {
  id: String;
  name: String;
}

export const sections: Section[] = [
  { id: 'home-section', name: 'Home' },
  { id: 'about-section', name: 'Sobre' },
  { id: 'projects-section', name: 'Projetos' },
  { id: 'skills-section', name: 'Habilidades' },
  { id: 'contact-section', name: 'Contato' },
];
