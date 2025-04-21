import { Component, OnInit } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { GithubService } from '../../../../services/github/github.service';
import { RepoUserModel } from '../../../../services/github/model/repo-user.model';

interface Skills {
  technology: string,
  projects: number
}

interface KnowledgeArea {
  name: string,
  icon: string
}

interface Tool {
  name: string,
  icon: string
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    NgFor,
    NgStyle
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {

  constructor(private githubService: GithubService) {}

  skills: Skills[] = [];
  knowledgeAreas: KnowledgeArea[] = [
    { name: 'Desenvolvimento Mobile', icon: 'bi-phone-fill' },
    { name: 'Desenvolvimento Web', icon: 'bi-globe' },
    { name: 'Arquitetura de Software', icon: 'bi-diagram-3-fill' },
    { name: 'UI/UX Design', icon: 'bi-palette-fill' },
    { name: 'Banco de Dados', icon: 'bi-database-fill' },
    { name: 'DevOps', icon: 'bi-gear-fill' }
  ];
  
  tools: Tool[] = [
    { name: 'Android Studio', icon: 'android-plain' },
    { name: 'Git', icon: 'git-plain' },
    { name: 'Firebase', icon: 'firebase-plain' },
    { name: 'VS Code', icon: 'vscode-plain' },
    { name: 'Docker', icon: 'docker-plain' },
    { name: 'Angular', icon: 'angularjs-plain' },
    { name: 'Node.js', icon: 'nodejs-plain' },
    { name: 'PostgreSQL', icon: 'postgresql-plain' }
  ];

  minProjects: number = 0;
  maxProjects: number = 0;

  calculateTimeExperience(date: string): number {
    const dateNow: number = new Date().getFullYear();
    const dateParsed: number = parseInt(date);
    return dateNow - dateParsed;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.githubService.getUserRepos().subscribe((githubRepos) => {
      this.maxProjects = githubRepos.length;

      const filteredRepos = githubRepos.filter(repo => repo.language); // Filter out repos with empty language

      for (const repo of filteredRepos) {
        var existingSkill = this.skills.find(skill => skill.technology === repo.language);
        if (!existingSkill) {
          existingSkill = {
            technology: repo.language,
            projects: 0
          };
          this.skills.push(existingSkill);
        }

        existingSkill.projects++;
      }
      
      // Ordenar habilidades por numero de projetos (decrescente)
      this.skills.sort((a, b) => b.projects - a.projects);
    });
  }
}
