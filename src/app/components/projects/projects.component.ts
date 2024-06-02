import { Component } from '@angular/core';
import { GithubService } from '../../services/github/github.service';
import { RepoUserModel } from '../../services/github/model/repo-user.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgFor
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
    this.githubService.getUserRepos().subscribe((githubRepo) => {
      this.list = githubRepo.filter((item) => {
        return item.language != null
      })
    });
  }
}
