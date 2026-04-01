// This service makes HTTP calls to our backend API
// It automatically adds the JWT token to every request

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}


  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  getOverview() {
    return this.http.get<any>(`${this.apiUrl}/analytics/overview`, {
      headers: this.getHeaders(),
    });
  }

  getSignupTrend() {
    return this.http.get<any>(`${this.apiUrl}/analytics/signups`, {
      headers: this.getHeaders(),
    });
  }

  getRoleDistribution() {
    return this.http.get<any>(`${this.apiUrl}/analytics/roles`, {
      headers: this.getHeaders(),
    });
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  // Create a new user — calls the admin-protected /register route
  createUser(userData: { name: string; email: string; password: string; role: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData, {
      headers: this.getHeaders(),
    });
  }

  updateUser(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }
}