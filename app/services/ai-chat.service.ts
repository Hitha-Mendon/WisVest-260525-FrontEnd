// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AiChatService {
//   private apiUrl = 'https://api.openai.com/v1/chat/completions';
//   private apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

//   constructor(private http: HttpClient) {}

//   getResponse(message: string): Observable<string> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.apiKey}`
//     });

//     const body = {
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: message }]
//     };

//     return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
//       map(res => res.choices?.[0]?.message?.content || 'Sorry, I could not find an answer.')
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiChatService {
    private apiUrl = 'http://localhost:5251/api/Chat/ask'; // Use your backend's actual URL and port
//   private apiUrl = '/api/Chat/ask'; // Your backend endpoint

  constructor(private http: HttpClient) {}

  getResponse(message: string): Observable<string> {
    return this.http.post<any>(this.apiUrl, { message }).pipe(
      map(res => res.reply || 'Sorry, I could not find an answer.')
    );
  }
}