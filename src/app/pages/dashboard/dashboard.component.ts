import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  coins = 0;
  rate = 50;
  isLoading = true;
  minCoins = 200;
  minFirstRechargeCoins = 250;
  balanceError: string = '';

  // Wallet top-up modal state
  showTopupModal = false;
  topupCoins: number = 0;
  topupAmount: number = 0;
  upiId: string = '';
  qrUrl: string = '';
  utr: string = '';
  topupMessage: string = '';
  isSubmitting = false;
  topups: any[] = [];
  isTopupLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getWalletInfo().subscribe({
      next: (data) => {
        this.coins = data.coins;
        this.rate = data.rate;
        this.isLoading = false;
        this.checkMinBalance();
      },
      error: () => {
        this.isLoading = false;
      }
    });
    this.fetchTopups();
  }

  checkMinBalance() {
    if (this.coins === 0) {
      this.balanceError = `First time recharge: Minimum coin balance should be ${this.minFirstRechargeCoins}.`;
    } else if (this.coins < this.minCoins) {
      this.balanceError = `Minimum coin balance should be ${this.minCoins}. Your current balance is ${this.coins}.`;
    } else {
      this.balanceError = '';
    }
  }

  openTopupModal() {
    this.checkMinBalance();
    this.showTopupModal = true;
    this.topupCoins = 0;
    this.topupAmount = 0;
    this.utr = '';
    if (this.coins === 0) {
      this.topupMessage = `First time recharge: Minimum top-up is ${this.minFirstRechargeCoins} coins.`;
    } else if (this.coins < this.minCoins) {
      this.topupMessage = `Minimum coin balance should be ${this.minCoins}. Your current balance is ${this.coins}.`;
    } else {
      this.topupMessage = '';
    }
    this.qrUrl = '';
    this.fetchUpiId();
  }

  closeTopupModal() {
    this.showTopupModal = false;
  }

  fetchUpiId() {
    this.authService.getUpiId().subscribe({
      next: res => {
        this.upiId = res.upi_id;
      }
    });
  }

  onCoinsInput() {
    this.topupAmount = this.topupCoins/2;
    if (this.upiId && this.topupAmount > 0) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(this.upiId)}&am=${this.topupAmount}&cu=INR`;
      this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUrl)}&size=200x200`;
    } else {
      this.qrUrl = '';
    }
  }

  submitTopup() {
    if (!this.topupCoins || !this.utr) {
      this.topupMessage = 'Please enter coins and UTR.';
      return;
    }
    if (this.coins === 0 && this.topupCoins < this.minFirstRechargeCoins) {
      this.topupMessage = `First time recharge: Minimum top-up is ${this.minFirstRechargeCoins} coins.`;
      return;
    }
    if (this.coins > 0 && this.topupCoins < this.minCoins) {
      this.topupMessage = `Minimum top-up is ${this.minCoins} coins.`;
      return;
    }
    this.isSubmitting = true;
    this.authService.createTopup(this.topupCoins, this.utr).subscribe({
      next: () => {
        this.topupMessage = 'Top-up request submitted!';
        this.isSubmitting = false;
        this.fetchTopups();
        this.showTopupModal = false;
        alert('Request Submit Successful');
      },
      error: () => {
        this.topupMessage = 'Failed to submit top-up.';
        this.isSubmitting = false;
      }
    });
  }

  fetchTopups() {
    this.isTopupLoading = true;
    this.authService.getTopups().subscribe({
      next: (data) => {
        this.topups = data;
        this.isTopupLoading = false;
      },
      error: () => {
        this.isTopupLoading = false;
      }
    });
  }
}
