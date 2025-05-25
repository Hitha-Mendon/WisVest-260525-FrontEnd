import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInputService {
  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiBaseUrl+environment.endpoints.allocation.getAllocations;
  }

  submitUserInput(data: UserInput): Observable<any> {
    console.log('API URL:', this.apiUrl);
    return this.http.post<any>(this.apiUrl, data);
  }
}

export interface UserInput {
  riskTolerance: string;
  investmentHorizon: number;
  age: number;
  goal: string;
  targetAmount: number;
}