import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { GithubService } from '../../services/github/github.service';
import { RepoUserModel } from '../../services/github/model/repo-user.model';

interface Skills {
  technology: string,
  projects: number
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

  constructor(private githubService: GithubService) {}

  skills: Skills[] = []

  minProjects: number = 0;
  maxProjects: number = 0;

  calculateTimeExperience(date: string): number {
    const dateNow: number = new Date().getFullYear();
    const dateParsed: number = parseInt(date);
    return dateNow - dateParsed;
  }

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    this.githubService.getUserRepos().subscribe((githubRepos) => {
      this.maxProjects = githubRepos.length

      for (const repo of githubRepos) {
        const language = repo.language;

        let existingSkill = this.skills.find(skill => skill.technology === language);
        if (!existingSkill) {
          existingSkill = {
            technology: language,
            projects: 0
          };
          this.skills.push(existingSkill);
        }

        existingSkill.projects++;
      }
    });
  }
}
