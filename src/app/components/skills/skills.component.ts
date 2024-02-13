import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Skills {
  tecnology: string,
  date: string
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  skills: Skills[] = [
    {
      tecnology: 'PHP',
      date: '2017'
    },
    {
      tecnology: 'Kotlin',
      date: '2021'
    },
  ]

  minDate: number = Math.min(...this.skills.map(skill => this.calculateTimeExperience(skill.date)));
  maxDate: number = Math.max(...this.skills.map(skill => this.calculateTimeExperience(skill.date)));

  calculateTimeExperience(date: string): number {
    const dateNow: number = new Date().getFullYear();
    const dateParsed: number = parseInt(date);
    return dateNow - dateParsed;
  }
}
