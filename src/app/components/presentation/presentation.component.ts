import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { sections } from '../../app.sections';
import Typed from 'typed.js';
import { GithubService } from '../../services/github/github.service';
import { throws } from 'assert';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.scss',
})
export class PresentationComponent {

  sections = sections
  greeting = 'Hello!';
  fullName = 'Bruno Carvalho';
  image = "/assets/images/presentation/presentation.png"
  professions = ['Mobile Android', 'Full Stack'];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    
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

    const typed = new Typed('.typed-text', options);

    this.githubService.getUserProfile().subscribe((githubProfile) => {
      this.fullName = githubProfile.name
      this.image = githubProfile.avatar_url
    })
    }
}
