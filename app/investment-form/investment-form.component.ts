import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInputService, UserInput } from '../services/user-input.service';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfoliodata.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../services/config.service';
import { environment } from '../../environments/environment';
import { CalculateService } from '../services/calculate.service';
@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.css'],
})
export class InvestmentFormComponent implements OnInit {
  logoPath: string;
  goalPath: string;
  agePath: string;
  riskPath: string;
  targetPath: string;
  horizonPath: string;
  workPath: string;
  investmentForm!: FormGroup;
  isWeb2SpeechEnabled: boolean = true; // Flag to toggle Web2Speech
 
  riskLowSelected!: string;
  riskMediumSelected!: string;
  riskHighSelected!: string;
 
  // Variables to hold translated text for Target Amount
  targetAmountLabel!: string;
  targetAmountEntered!: string;
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userInputService: UserInputService,
    private portfolioDataService: PortfolioDataService,
    private http: HttpClient,
    private translate: TranslateService, // Inject TranslateService
    private configService: ConfigService,
    private calculateService: CalculateService
  ) {
    this.logoPath = this.configService.getLogoPath();
    this.goalPath = this.configService.getGoalPath();
    this.agePath = this.configService.getAgePath();
    this.riskPath = this.configService.getRiskPath();
    this.targetPath = this.configService.getTargetPath();
    this.horizonPath = this.configService.getHorizonPath();
    this.workPath = this.configService.getWorkPath();
    
  }
 
  ngOnInit(): void {
    this.investmentForm = this.fb.group({
      goal: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      targetAmount: ['', [Validators.required, Validators.min(10000), Validators.max(100000000)]],
      riskTolerance: ['', Validators.required],
      investmentHorizon: ['',[Validators.required, Validators.min(1), Validators.max(30)]],
    });
 
    // Fetch translations for Investment Horizon
 
        // Fetch translations for Risk Tolerance
        this.translate.get('INVESTMENT.RISK_LOW_SELECTED').subscribe((res) => {
          this.riskLowSelected = res;
        });
        this.translate.get('INVESTMENT.RISK_MEDIUM_SELECTED').subscribe((res) => {
          this.riskMediumSelected = res;
        });
        this.translate.get('INVESTMENT.RISK_HIGH_SELECTED').subscribe((res) => {
          this.riskHighSelected = res;
        });


          // Fetch translations for Target Amount
  this.translate.get('INVESTMENT.TARGET_AMOUNT_LABEL').subscribe((res) => {
    this.targetAmountLabel = res;
  });
  this.translate.get('INVESTMENT.TARGET_AMOUNT_ENTERED').subscribe((res) => {
    this.targetAmountEntered = res;
  });
 
        
  }
 
  onInvestmentHorizonFocus(): void {
    if (this.isWeb2SpeechEnabled) {
      this.translate.get('INVESTMENT.HORIZON_LABEL').subscribe(text => this.speakText(text));
    }
  }
   
  onInvestmentHorizonInput(): void {
    if (this.isWeb2SpeechEnabled) {
      const value = this.investmentForm.get('investmentHorizon')?.value;
      this.translate.get('INVESTMENT.HORIZON_INPUT_SPEAK', { value }).subscribe(text => this.speakText(text));
    }
  }

  toggleWeb2Speech(): void {
    // this.isWeb2SpeechEnabled = !this.isWeb2SpeechEnabled;
  }
  selectHorizon(horizon: string): void {
    this.investmentForm.get('investmentHorizon')?.setValue(horizon);
  }
 
 
  selectRisk(risk: string): void {
    this.investmentForm.get('riskTolerance')?.setValue(risk);
  }
 
  onSubmit(): void {
    if (this.investmentForm.valid) {
      const userInput: UserInput = this.investmentForm.value;
 
      this.userInputService.submitUserInput(userInput).subscribe({
        next: (response) => {
          console.log('Submission successful:', response);
            const targetAmount = this.investmentForm.get('targetAmount')?.value;
            const investmentHorizon = this.investmentForm.get('investmentHorizon')?.value;
 
            this.calculateService.calculateProductAllocations(targetAmount,investmentHorizon,response).subscribe({
            next: (data) => {
              console.log('API Response:', data);
              this.router.navigate(['/portfolio']);
            },
            error: (error) => {
              console.error('API Error:', error);
            }
            });
         
         
        },
        error: (error) => {
          console.error('Submission failed:', error);
        },
      });
    } else {
      console.log('Form is invalid');
      this.investmentForm.markAllAsTouched();
    }
  }
 
  home(): void {
    this.router.navigate(['/landing']);
  }
 
  products(): void {
    this.router.navigate(['/products']);
  }
 
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
 
  // speakText(text: string): void {
  //   if (!this.isWeb2SpeechEnabled) {
  //     return; // ⛔ Skip speaking if toggle is off
  //   }
  speakText(text: string): void {
    if (!this.isWeb2SpeechEnabled) {
      return; // ⛔ Skip speaking if toggle is off
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }
}