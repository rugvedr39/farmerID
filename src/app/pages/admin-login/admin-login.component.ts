import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.message = '';
    this.adminAuth.login(this.username, this.password).subscribe({
      next: res => {
        this.adminAuth.setAuthenticated(res.token);
        this.message = 'Login successful!';
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1000);
        this.isLoading = false;
      },
      error: err => {
        this.message = err.error.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }
} 