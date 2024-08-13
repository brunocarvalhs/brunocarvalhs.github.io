import { Component, HostListener, OnInit } from '@angular/core';
import { sections } from '../../app.sections';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgFor,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  name: String = 'Brunocarvalhs';
  sections = sections;
  currentSection: string | null = null;

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.updateCurrentSection();
  }

  ngOnInit(): void {
    this.updateCurrentSection(); // Inicializa a seção ativa ao carregar
  }

  updateCurrentSection(): void {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 200; // Ajuste o valor conforme necessário

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionBottom = sectionTop + section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        this.currentSection = section.getAttribute('id');
      }
    });
  }
}

