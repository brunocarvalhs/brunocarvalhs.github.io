import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { sections } from '../../app.sections';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  sections = sections;
  date: String = new Date().getFullYear().toString()
}
