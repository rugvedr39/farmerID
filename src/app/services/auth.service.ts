import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  sendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email });
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  register(email: string, password: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, otp });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  setAuthenticated(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getWalletInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUpiId(): Observable<{ upi_id: string }> {
    return this.http.get<{ upi_id: string }>(`${this.apiUrl}/settings/upi`);
  }

  createTopup(coins: number, utr: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/wallet/topup`, { coins, utr }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getTopups(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/wallet/topups`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Method to fetch and store current user data from token
  fetchAndStoreCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(subscriber => {
        subscriber.error('No token found');
      });
    }

    return this.http.get(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  googleSignIn(idToken: string): Observable<any> {
    return this.http.post('/api/auth/google', { idToken });
  }
} 