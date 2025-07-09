import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FarmerIdForm {
  id?: number;
  userId: number;
  language: string;
  photoPath?: string;
  nameEnglish: string;
  nameMarathi: string;
  mobile: string;
  aadhar: string;
  farmerId: string;
  addressMarathi: string;
  dob: string;
  gender: string;
  landDetails: any[];
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private apiUrl = environment.apiUrl + '/farmer';

  constructor(private http: HttpClient) { }

  // Save farmer ID form
  saveFarmerIdForm(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, formData);
  }

  // Get farmer ID forms for a user
  getUserFarmerIdForms(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Get all farmer ID forms (for admin)
  getAllFarmerIdForms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Get specific farmer ID form by ID
  getFarmerIdForm(formId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${formId}`);
  }

  // Delete farmer ID form
  deleteFarmerIdForm(formId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${formId}`);
  }
} 