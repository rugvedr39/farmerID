import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  otp = '';
  message = '';
  step: 'email' | 'otp' | 'register' = 'email';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    alert("For Testing Purpose Use 123456 As OTP")
  }

  sendOTP() {
    if (!this.email) {
      this.message = 'Please enter your email';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.sendOTP(this.email).subscribe({
      next: res => {
        this.message = 'OTP sent successfully! Check your email.';
        this.step = 'otp';
        this.isLoading = false;
      },
      error: err => {
        this.message = err.error.message || 'Failed to send OTP';
        this.isLoading = false;
      }
    });
  }

  verifyOTP() {
    if (!this.otp) {
      this.message = 'Please enter the OTP';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.verifyOTP(this.email, this.otp).subscribe({
      next: res => {
        this.message = 'OTP verified successfully!';
        this.step = 'register';
        this.isLoading = false;
      },
      error: err => {
        this.message = err.error.message || 'Invalid OTP';
        this.isLoading = false;
      }
    });
  }

  register() {
    if (!this.password) {
      this.message = 'Please enter a password';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.register(this.email, this.password, this.otp).subscribe({
      next: res => {
        this.message = 'Registration successful!';
        if (res.token) {
          this.authService.setAuthenticated(res.token);
        }
        // Store user data
        if (res.user) {
          this.authService.setCurrentUser(res.user);
        }
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: err => {
        this.message = err.error.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    if (this.step === 'otp') {
      this.step = 'email';
      this.otp = '';
      this.message = '';
    } else if (this.step === 'register') {
      this.step = 'otp';
      this.password = '';
      this.message = '';
    }
  }

  signInWithGoogle(): void {
    console.log("signInWithGoogle");
    
  }
}
