import { Component } from '@angular/core';


import { AboutComponent } from './section/about/about.component';
import { BlogComponent } from '../../components/blog/blog.component';
import { ContactComponent } from './section/contact/contact.component';
import { PresentationComponent } from './section/presentation/presentation.component';
import { ProjectsComponent } from './section/projects/projects.component';
import { ResumeComponent } from './section/resume/resume.component';
import { ServicesComponent } from '../../components/services/services.component';
import { SkillsComponent } from './section/skills/skills.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AboutComponent,
    BlogComponent,
    ContactComponent,
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
