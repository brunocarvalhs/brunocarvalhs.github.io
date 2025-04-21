import { Component } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { GithubService } from '../../../../services/github/github.service';
import { RepoUserModel } from '../../../../services/github/model/repo-user.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgFor,
    NgStyle
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  constructor(private githubService: GithubService) {}

  list: RepoUserModel[] = []

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    this.githubService.getUserRepos().subscribe((githubRepos) => {
      this.list = githubRepos;
    });
  }
}
