import { Component } from '@angular/core';
import { GithubService } from '../../services/github/github.service';
import { UserInfoModel } from '../../models/user-info.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(private githubService: GithubService, ) {}

  userInfo: UserInfoModel | null = null;

  ngOnInit(): void {
    this.getUserInfo(this.githubService);
  }

  getUserInfo(userInfoService: GithubService): void {
    userInfoService.getUserProfile().subscribe((githubProfile) => {
      this.userInfo = new UserInfoModel({
        fullName: githubProfile.name,
        profession: 'Engenheiro Mobile',
        birthDate: '08-1998',
        address: githubProfile.location,
        email: githubProfile.email ?? 'brunocarvalhs@outlook.com.br',
        projectCompleted: githubProfile.public_repos,
      });
    });
  }

  calculateAge(): number {
    if (this.userInfo?.birthDate != null) {
      const [birthMonth, birthYear] = this.userInfo.birthDate.split('-').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      let age = currentYear - birthYear;
      if (currentMonth < birthMonth) {
        age--;
      }

      return age;
    } else {
      return 0;
    }
  }
}
