import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {

  private readonly API_URL = 'https://api.linkedin.com/v2/';
  private readonly AUTHORIZATION_HEADER = 'Authorization';

  constructor(private readonly http: HttpClient) {}

  obterPerfil(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      [this.AUTHORIZATION_HEADER]: `Bearer ${accessToken}`
    });

    return this.http.get<any>(`${this.API_URL}me`, { headers });
  }
}
