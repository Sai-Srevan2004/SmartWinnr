// This service handles login, logout, and stores user data in localStorage

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Available throughout the entire app
})
export class AuthService {
  // Our backend URL
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

 
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  saveUser(userData: any) {
    // Store the full user object as a JSON string
    localStorage.setItem('user', JSON.stringify(userData));
    // Store the token separately for easy access
    localStorage.setItem('token', userData.token);
  }

 
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }


  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}