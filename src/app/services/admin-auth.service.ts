import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private apiUrl = `${environment.apiUrl}/admin`
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('admin_token');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.isAuthenticatedSubject.next(false);
  }

  setAuthenticated(token: string) {
    localStorage.setItem('admin_token', token);
    this.isAuthenticatedSubject.next(true);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getAllUsers(page: number = 1, limit: number = 10): Observable<any> {
    const token = localStorage.getItem('admin_token');
    return this.http.get<any>(`${this.apiUrl}/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteUser(id: number) {
    const token = localStorage.getItem('admin_token');
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateUserCoins(id: number, coins: number) {
    const token = localStorage.getItem('admin_token');
    return this.http.put(`${this.apiUrl}/users/${id}/coins`, { coins }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  resetUserPassword(id: number, newPassword: string) {
    const token = localStorage.getItem('admin_token');
    return this.http.put(`${this.apiUrl}/users/${id}/password`, { password: newPassword }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUpiId() {
    const token = localStorage.getItem('admin_token');
    return this.http.get<{ upi_id: string }>(`${this.apiUrl}/settings/upi`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateUpiId(upi_id: string) {
    const token = localStorage.getItem('admin_token');
    return this.http.put(`${this.apiUrl}/settings/upi`, { upi_id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getPendingTopups() {
    const token = localStorage.getItem('admin_token');
    return this.http.get<any[]>(`${this.apiUrl}/topups`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  approveTopup(id: number, approve: boolean) {
    const token = localStorage.getItem('admin_token');
    return this.http.put(`${this.apiUrl}/topups/${id}/approve`, { approve }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAllTopupRecords(page: number = 1, limit: number = 10): Observable<any> {
    const token = localStorage.getItem('admin_token');
    return this.http.get<any>(`${this.apiUrl}/topups/all?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
} 