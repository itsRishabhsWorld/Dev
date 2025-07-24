import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <div class="login-header">
              <h1>Bhatt Pharma</h1>
              <p>Pharmaceutical Products Management</p>
            </div>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              class="w-full login-button"
              [disabled]="loginForm.invalid || isLoading"
            >
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div class="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div class="credentials-grid">
              <div class="credential-item">
                <strong>Admin:</strong>
                <span>admin@bhattpharma.com / admin123</span>
              </div>
              <div class="credential-item">
                <strong>Manager:</strong>
                <span>manager@bhattpharma.com / manager123</span>
              </div>
              <div class="credential-item">
                <strong>Pharmacist:</strong>
                <span>pharmacist@bhattpharma.com / pharmacist123</span>
              </div>
            </div>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .login-header h1 {
      color: #1976d2;
      margin: 0;
      font-size: 28px;
      font-weight: 500;
    }

    .login-header p {
      color: #666;
      margin: 5px 0 0 0;
      font-size: 14px;
    }

    .login-button {
      height: 48px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .demo-credentials {
      width: 100%;
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .demo-credentials h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 14px;
    }

    .credentials-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .credential-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .credential-item strong {
      color: #1976d2;
      min-width: 80px;
    }

    .credential-item span {
      color: #666;
      font-family: monospace;
      background: white;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
    }

    .credential-item span:hover {
      background: #e3f2fd;
    }

    mat-form-field {
      margin-bottom: 16px;
    }

    @media (max-width: 480px) {
      .login-card {
        margin: 10px;
      }
      
      .credentials-grid {
        gap: 12px;
      }
      
      .credential-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  // Helper method to quickly fill demo credentials
  fillCredentials(email: string, password: string) {
    this.loginForm.patchValue({ email, password });
  }
}