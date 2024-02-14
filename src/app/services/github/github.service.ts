import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfileModel } from './model/user-profile.model';
import { RepoUserModel } from './model/repo-user.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private baseUrl = 'https://api.github.com';

  private cachedUserProfile: UserProfileModel | null = null;
  private cachedUserRepos: RepoUserModel[] | null = null;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfileModel> {
    return this.cachedUserProfile
      ? of(this.cachedUserProfile) // Return from cache if available
      : this.http
          .get<any>(`${this.baseUrl}/users/${environment.github_username}`)
          .pipe(
            map((data) => new UserProfileModel(data)),
            tap((profile) => {
              this.cachedUserProfile = profile; // Cache the result
            })
          );
  }

  getUserRepos(): Observable<RepoUserModel[]> {
    return this.cachedUserRepos
      ? of(this.cachedUserRepos) // Return from cache if available
      : this.http
          .get<any[]>(`${this.baseUrl}/users/${environment.github_username}/repos`)
          .pipe(
            map((data) => data.map((repoData) => new RepoUserModel(repoData))),
            catchError((error) => {
              console.error('Error fetching user repos:', error);
              return of([]); // Return empty array on error
            }),
            tap((repos) => {
              this.cachedUserRepos = repos; // Cache the result
            })
          );
  }
}
