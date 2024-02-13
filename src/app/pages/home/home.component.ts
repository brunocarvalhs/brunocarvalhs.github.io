import { Component } from '@angular/core';


import { AboutComponent } from '../../components/about/about.component';
import { BlogComponent } from '../../components/blog/blog.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { CounterComponent } from '../../components/counter/counter.component';
import { PresentationComponent } from '../../components/presentation/presentation.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ResumeComponent } from '../../components/resume/resume.component';
import { ServicesComponent } from '../../components/services/services.component';
import { SkillsComponent } from '../../components/skills/skills.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AboutComponent,
    BlogComponent,
    ContactComponent,
    CounterComponent,
    PresentationComponent,
    ProjectsComponent,
    ResumeComponent,
    ServicesComponent,
    SkillsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
