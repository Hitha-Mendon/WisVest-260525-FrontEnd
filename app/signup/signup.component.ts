import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ValidationService } from '../services/validation.service';
import { environment } from '../../environments/environment';
import { SignupResponse,SignupPayload } from '../models/signup';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})

export class SignupComponent {
  signupForm: FormGroup;
  isSubmitting = false;
  emailExists = false;
  logoPath: string;
  apiUrl: string;

  constructor(
    private configService: ConfigService,
    private ValidationService: ValidationService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {
    this.logoPath = this.configService.getLogoPath();
    this.apiUrl = environment.apiBaseUrl + environment.endpoints.auth.register;
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.pattern(this.ValidationService.nameRegex)]],
        lastName: ['', [Validators.required, Validators.pattern(this.ValidationService.nameRegex)]],
        email: ['', [Validators.required, 
        Validators.pattern(this.ValidationService.emailRegex),
        this.ValidationService.domainValidator(environment.allowedEmailDomains) ]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(this.ValidationService.passwordRegex),
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.ValidationService.passwordsMatchValidator }
    );

    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      this.emailExists = false;
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.signupForm.value;

    const payload:SignupPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };

    this.http.post<SignupResponse>(this.apiUrl, payload).subscribe({
      next: () => {
        this.translate.get('SIGNUP.SUCCESS').subscribe((res) => {
          Swal.fire({
            title: res.TITLE,
            text: res.TEXT,
            icon: 'success',
            confirmButtonText: res.CONFIRM_BUTTON,
            confirmButtonColor: '#2d6a4f',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      });
      },
      error: (error) => {
        this.isSubmitting = false;

        console.error('Error response:', error);

        if (error.status === 400 && error.error.message?.toLowerCase().includes('email already exists')) {
          this.emailExists = true;
          this.translate.get('SIGNUP.EMAIL_EXIST').subscribe((res) => {
            Swal.fire({
              title: res.TITLE,
              text: res.TEXT,
              icon: 'warning',
              confirmButtonText: res.CONFIRM_BUTTON,
              confirmButtonColor: '#2d6a4f',
            });
          });
        } else {
          this.translate.get('SIGNUP.FAILED').subscribe((res) => {
            Swal.fire({
              title: res.TITLE,
              text: res.TEXT,
              icon: 'error',
              confirmButtonText: res.CONFIRM_BUTTON,
              confirmButtonColor: '#2d6a4f',
            });
          });
        }
      }
    });
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
}

