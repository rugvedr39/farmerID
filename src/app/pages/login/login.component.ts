import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  email = '';
  password = '';
  message = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.login();
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        this.message = 'Login successful!';
        // Store the JWT token using AuthService
        this.authService.setAuthenticated(res.token);
        // Store user data
        if (res.user) {
          this.authService.setCurrentUser(res.user);
        }
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: err => this.message = err.error.message || 'Login failed'
    });
  }
}
