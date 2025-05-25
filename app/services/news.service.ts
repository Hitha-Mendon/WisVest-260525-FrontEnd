import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:5251/api/news/financial';  // Adjust if using proxy

  constructor(private http: HttpClient) {}

  getFinancialNews(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
