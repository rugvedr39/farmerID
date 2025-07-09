import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-topup-approval',
  templateUrl: './topup-approval.component.html',
  styleUrls: ['./topup-approval.component.css']
})
export class TopupApprovalComponent implements OnInit {
  topups: any[] = [];
  isLoading = true;
  message = '';
  actionLoading: number | null = null;

  constructor(private adminService: AdminAuthService) {}

  ngOnInit() {
    this.fetchTopups();
  }

  fetchTopups() {
    this.isLoading = true;
    this.adminService.getPendingTopups().subscribe({
      next: (data) => {
        this.topups = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  approveTopup(topup: any, approve: boolean) {
    if (!confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this top-up?`)) return;
    this.actionLoading = topup.id;
    this.adminService.approveTopup(topup.id, approve).subscribe({
      next: () => {
        this.message = approve ? 'Top-up approved and coins credited!' : 'Top-up rejected!';
        this.topups = this.topups.filter(t => t.id !== topup.id);
        this.actionLoading = null;
      },
      error: () => {
        this.message = 'Failed to process top-up.';
        this.actionLoading = null;
      }
    });
  }
} 