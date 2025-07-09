import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-transaction-history',
  templateUrl: './user-transaction-history.component.html',
  styleUrls: ['./user-transaction-history.component.css']
})
export class UserTransactionHistoryComponent implements OnInit {
  topups: any[] = [];
  isLoading = true;
  message = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchTopups();
  }

  fetchTopups() {
    this.isLoading = true;
    this.authService.getTopups().subscribe({
      next: (data) => {
        this.topups = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to load transactions.';
      }
    });
  }
} 