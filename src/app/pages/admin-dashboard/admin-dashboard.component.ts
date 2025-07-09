import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  editUserId: number | null = null;
  editCoins: number = 0;
  message = '';
  upiId = '';
  upiMessage = '';
  isUpiLoading = false;

  constructor(private adminService: AdminAuthService, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchUpiId();
  }

  fetchUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  fetchUpiId() {
    this.isUpiLoading = true;
    this.adminService.getUpiId().subscribe({
      next: res => {
        this.upiId = res.upi_id || '';
        this.isUpiLoading = false;
      },
      error: () => {
        this.isUpiLoading = false;
      }
    });
  }

  updateUpiId() {
    if (!this.upiId) {
      this.upiMessage = 'UPI ID cannot be empty.';
      return;
    }
    this.isUpiLoading = true;
    this.adminService.updateUpiId(this.upiId).subscribe({
      next: res => {
        this.upiMessage = 'UPI ID updated!';
        this.isUpiLoading = false;
      },
      error: () => {
        this.upiMessage = 'Failed to update UPI ID.';
        this.isUpiLoading = false;
      }
    });
  }

  startEdit(user: any) {
    this.editUserId = user.id;
    this.editCoins = user.coins;
    this.message = '';
  }

  cancelEdit() {
    this.editUserId = null;
    this.editCoins = 0;
    this.message = '';
  }

  saveCoins(user: any) {
    this.adminService.updateUserCoins(user.id, this.editCoins).subscribe({
      next: () => {
        user.coins = this.editCoins;
        this.editUserId = null;
        this.message = 'Coins updated!';
      },
      error: () => {
        this.message = 'Failed to update coins.';
      }
    });
  }

  deleteUser(user: any) {
    if (!confirm(`Delete user ${user.email}?`)) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.message = 'User deleted!';
      },
      error: () => {
        this.message = 'Failed to delete user.';
      }
    });
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
} 