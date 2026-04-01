// This file defines all the URLs (routes) in our app

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default route — redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login page — anyone can access
  { path: 'login', component: LoginComponent },

  // Dashboard — only admins can access (protected by adminGuard)
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },

  // User Management — only admins can access
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },

  // Catch-all — if URL doesn't match, go to login
  { path: '**', redirectTo: 'login' },
];