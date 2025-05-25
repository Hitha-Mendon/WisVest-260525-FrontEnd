import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor(private http: HttpClient) { }

  // Dynamically construct the API URL using environment configuration
  apiUrl = `${environment.apiBaseUrl}${environment.endpoints.productAllocation.calculate}`;

  calculateProductAllocations(targetAmount: number, investmentHorizon: number, response: any) {
    // Use the dynamically constructed apiUrl
    console.log('API URL:', this.apiUrl);
    return this.http.post(this.apiUrl, response, {
      params: {
        targetAmount: targetAmount.toString(),
        investmentHorizon: investmentHorizon.toString(),
      }
    });
  }
}