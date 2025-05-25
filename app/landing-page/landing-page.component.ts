// // // // import { Component } from '@angular/core';
// // // // import { Router } from '@angular/router';
// // // // import { TranslateModule} from '@ngx-translate/core';
// // // // import { ConfigService } from '../services/config.service';

 
// // // // @Component({
// // // //   selector: 'app-landing-page',
// // // //   standalone:true,
// // // //   imports: [TranslateModule],
// // // //   templateUrl: './landing-page.component.html',
// // // //   styleUrl: './landing-page.component.css'
// // // // })
// // // // export class LandingPageComponent {
// // // //   logoPath: string;
// // // //   heroPath: string;
// // // //   workPath: string;
// // // //   constructor(private router: Router,private configService: ConfigService) {
// // // //     this.logoPath = this.configService.getLogoPath();
// // // //     this.heroPath = this.configService.getHeroPath();
// // // //     this.workPath = this.configService.getWorkPath();


// // // //   }
// /
// // // //   logout() {
// // // //     localStorage.clear();
// // // //     this.router.navigate(['/login']);
// // // //   }
// // // //   products() {
// // // //     this.router.navigate(['/products']);
// // // //   }
// // // //   input() {
// // // //     this.router.navigate(['/input']);
// // // //   }
// //  getFinancialNews() {
// //     this.http.get<any>('http://localhost:5251/api/news/financial').subscribe({
// //       next: (data) => {
// //         this.financialNews = data.articles; // FIXED LINE: access articles
// //       },
// //       error: (err) => {
// //         console.error('Failed to load news:', err);
// //       },
// //     });
// //   }
 
// // // }
// // // import { Component } from '@angular/core';
// // import { Router } from '@angular/router';
// // import { CommonModule } from '@angular/common'; // <-- Add this import
// // import { TranslateModule } from '@ngx-translate/core';
// // import { ChatbotComponent } from './chatbot/chatbot.component';

// // // @Component({
// // //   selector: 'app-landing-page',
// // //   standalone: true,
// // //   imports: [CommonModule, TranslateModule, ChatbotComponent], // <-- Add CommonModule here
// // //   templateUrl: './landing-page.component.html',
// // //   styleUrls: ['./landing-page.component.css'],
// // // })
// // // export class LandingPageComponent {
// // //   logoPath = 'assets/logo.png';
// // //   heroPath = 'assets/hero.png';
// // //   workPath = 'assets/work.png';
// // //   showChatbot = false;

// // //   constructor(private router: Router) {}

// // //   logout() {
// // //     localStorage.clear();
// // //     this.router.navigate(['/login']);
// // //   }
// // //   products() {
// // //     this.router.navigate(['/products']);
// // //   }
// // //   input() {
// // //     this.router.navigate(['/input']);
// // //   }
// // // }
// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http'; // <-- Add this import

// // @Component({
// //   selector: 'app-landing-page',
// //   standalone: true,
// //   imports: [CommonModule, TranslateModule, ChatbotComponent],
// //   templateUrl: './landing-page.component.html',
// //   styleUrls: ['./landing-page.component.css'],
// // })
// // export class LandingPageComponent implements OnInit {
// //   logoPath = 'assets/logo.png';
// //   heroPath = 'assets/hero.png';
// //   workPath = 'assets/work.png';
// //   showChatbot = false;

// //   financialNews: any[] = [];

// //   constructor(private router: Router, private http: HttpClient) {}

// //   ngOnInit() {
// //     this.getFinancialNews();
// //   }

// //   logout() {
// //     localStorage.clear();
// //     this.router.navigate(['/login']);
// //   }

// //   products() {
// //     this.router.navigate(['/products']);
// //   }

// //   input() {
// //     this.router.navigate(['/input']);
// //   }

// //   getFinancialNews() {
// //     this.http.get<any[]>('http://localhost:5251/api/news/financial').subscribe({
// //       next: (data) => (this.financialNews = data),
// //       error: (err) => console.error('Failed to load news:', err),
// //     });
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';
// import { ChatbotComponent } from './chatbot/chatbot.component';
// import { HttpClientModule, HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-landing-page',
//   standalone: true,
//   imports: [CommonModule, TranslateModule, ChatbotComponent, HttpClientModule],
//   templateUrl: './landing-page.component.html',
//   styleUrls: ['./landing-page.component.css'],
// })
// export class LandingPageComponent implements OnInit {
//   // logoPath = 'assets/logo.png';
//   // heroPath = 'assets/hero.png';
//   // workPath = 'assets/work.png';
//   logoPath: string;
// heroPath: string;
// workPath: string;
// this.workPath = this.configService.getWorkPath();
// //  financialNews: any[] = [];
//  constructor(private router: Router,private configService: ConfigService) {
//  this.logoPath = this.configService.getLogoPath();
//     this.heroPath = this.configService.getHeroPath();
//  this.workPath = this.configService.getWorkPath();
//   }

//   showChatbot = false;
//   financialNews: any[] = [];

//   constructor(private router: Router, private http: HttpClient) {}

//   ngOnInit() {
//     this.getFinancialNews();
//   }

//   logout() {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }

//   products() {
//     this.router.navigate(['/products']);
//   }

//   input() {
//     this.router.navigate(['/input']);
//   }

//   getFinancialNews() {
//     this.http.get<any>('http://localhost:5251/api/news/financial').subscribe({
//       next: (data) => {
//         this.financialNews = data.articles; // FIXED LINE: access articles
//       },
//       error: (err) => {
//         console.error('Failed to load news:', err);
//       },
//     });
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslateModule, CommonModule,HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  logoPath: string;
  heroPath: string;
  workPath: string;
  financialNews: any[] = [];

  constructor(
    private router: Router,
    private configService: ConfigService,
    private http: HttpClient
  ) {
    this.logoPath = this.configService.getLogoPath();
    this.heroPath = this.configService.getHeroPath();
    this.workPath = this.configService.getWorkPath();

    this.getFinancialNews();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  products() {
    this.router.navigate(['/products']);
  }

  input() {
    this.router.navigate(['/input']);
  }

  // getFinancialNews() {
  //   this.http.get<any>('http://localhost:5251/api/news/financial').subscribe({
  //     next: (data) => {
  //       this.financialNews = data.articles;  // access articles array from response
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch news:', err);
  //     }
  //   });
  // }
 getFinancialNews() {
  this.http.get('http://localhost:5251/api/news/financial', { responseType: 'text' }).subscribe({
    next: (data) => {
      this.financialNews = JSON.parse(data) || [];
    },
    error: (err) => {
      console.error('Failed to fetch news:', err);
    }
  });
}
}
