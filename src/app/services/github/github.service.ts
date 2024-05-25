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
            }),
            catchError(this.handleError<UserProfileModel>('getUserProfile'))
          );
  }

  getUserRepos(): Observable<RepoUserModel[]> {
    return this.cachedUserRepos
      ? of(this.cachedUserRepos) // Return from cache if available
      : this.http
          .get<any[]>(`${this.baseUrl}/users/${environment.github_username}/repos`)
          .pipe(
            map((data) => data.map((repoData) => new RepoUserModel(repoData))),
            catchError(this.handleError<RepoUserModel[]>('getUserRepos')),
            tap((repos) => {
              this.cachedUserRepos = repos; // Cache the result
            })
          );
  }

  // Handle Http operation that failed
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
