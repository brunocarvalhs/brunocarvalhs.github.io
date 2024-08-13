import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { sections } from '../../../../app.sections';
import Typed from 'typed.js';
import { GithubService } from '../../../../services/github/github.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [MatSlideToggleModule, NgIf],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.scss',
})
export class PresentationComponent {

  sections = sections
  greeting = 'Hello!';
  fullName = 'Bruno Carvalho';
  image = ""
  professions = ['Mobile Android', 'Full Stack'];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.featchData()
  }

  featchData() {
    const options = {
      strings: this.professions.flatMap((value) => {
        return '<h2 class="fw-bold text-yellow">' + value + '</h2>';
      }),
      typeSpeed: 50,
      loop: true,
      smartBackspace: false,
      showCursor: false,
      backSpeed: 50,
    };

    new Typed('.typed-text', options);

    this.githubService.getUserProfile().subscribe((githubProfile) => {
      this.fullName = githubProfile.name
      this.image = githubProfile.avatar_url
    })
    }
}
