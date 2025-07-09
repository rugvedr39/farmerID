import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-transaction-records',
  templateUrl: './transaction-records.component.html',
  styleUrls: ['./transaction-records.component.css']
})
export class TransactionRecordsComponent implements OnInit {
  records: any[] = [];
  isLoading = true;
  message = '';
  page = 1;
  limit = 10;
  total = 0;

  constructor(private adminService: AdminAuthService) {}

  ngOnInit() {
    this.fetchRecords();
  }

  fetchRecords() {
    this.isLoading = true;
    this.adminService.getAllTopupRecords(this.page, this.limit).subscribe({
      next: (res) => {
        this.records = res.records;
        this.total = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to load records.';
      }
    });
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.fetchRecords();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchRecords();
    }
  }

  get totalPages() {
    return this.total ? Math.ceil(this.total / this.limit) : 1;
  }
} 