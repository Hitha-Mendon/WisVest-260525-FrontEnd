import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiBaseUrl;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${environment.endpoints.auth.login}`, { email, password }).pipe(tap(response => {localStorage.setItem('token',response.token)}));
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${environment.endpoints.auth.register}`, { email, password });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}