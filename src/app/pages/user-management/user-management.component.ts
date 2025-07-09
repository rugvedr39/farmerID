import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  editUserIndex: number | null = null;
  editCoins: number = 0;
  message = '';
  resetUserIndex: number | null = null;
  newPassword: string = '';
  isResetting = false;
  page = 1;
  limit = 10;
  total = 0;

  constructor(private adminService: AdminAuthService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers(this.page, this.limit).subscribe({
      next: res => {
        this.users = res.users;
        this.total = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.fetchUsers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchUsers();
    }
  }

  startEdit(user: any, i: number) {
    this.editUserIndex = i;
    this.editCoins = user.coins;
    this.message = '';
  }

  cancelEdit() {
    this.editUserIndex = null;
    this.editCoins = 0;
    this.message = '';
  }

  saveCoins(user: any, i: number) {
    this.adminService.updateUserCoins(user.email, this.editCoins).subscribe({
      next: () => {
        user.coins = this.editCoins;
        this.editUserIndex = null;
        this.message = 'Coins updated!';
      },
      error: () => {
        this.message = 'Failed to update coins.';
      }
    });
  }

  deleteUser(user: any, i: number) {
    if (!confirm(`Delete user ${user.email}?`)) return;
    this.adminService.deleteUser(user.email).subscribe({
      next: () => {
        this.users.splice(i, 1);
        this.message = 'User deleted!';
        this.fetchUsers();
      },
      error: () => {
        this.message = 'Failed to delete user.';
      }
    });
  }

  startResetPassword(user: any, i: number) {
    this.resetUserIndex = i;
    this.newPassword = '';
    this.message = '';
  }

  cancelResetPassword() {
    this.resetUserIndex = null;
    this.newPassword = '';
    this.isResetting = false;
  }

  resetPassword(user: any, i: number) {
    if (!this.newPassword) {
      this.message = 'Please enter a new password.';
      return;
    }
    this.isResetting = true;
    this.adminService.resetUserPassword(user.email, this.newPassword).subscribe({
      next: () => {
        this.message = 'Password reset!';
        this.resetUserIndex = null;
        this.newPassword = '';
        this.isResetting = false;
      },
      error: () => {
        this.message = 'Failed to reset password.';
        this.isResetting = false;
      }
    });
  }

  get totalPages() {
    return this.total ? Math.ceil(this.total / this.limit) : 1;
  }
} 