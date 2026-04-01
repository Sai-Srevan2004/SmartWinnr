import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For [(ngModel)] in the create user form
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  message = '';
  isError = false;

  showForm = false;

  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'user',
  };

  isCreating = false;

  
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  // ← inject this
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load all users from backend
  loadUsers() {
    this.isLoading = true;
    this.api.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage(err.error?.message || 'Failed to load users.', true);
        this.cdr.detectChanges(); 
      },
    });
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.showMessage('Please fill in all fields.', true);
      return;
    }

    this.isCreating = true;

    this.api.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        this.users.unshift(createdUser);
        this.showMessage(`User "${createdUser.name}" created successfully!`, false);
        this.newUser = { name: '', email: '', password: '', role: 'user' };
        this.showForm = false;
        this.isCreating = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to create user.', true);
        this.isCreating = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleRole(user: any) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.api.updateUser(user._id, { role: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        this.showMessage(`Role updated to "${newRole}"`, false);
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Failed to update role.', true),
    });
  }

  toggleStatus(user: any) {
    const newStatus = !user.isActive;
    this.api.updateUser(user._id, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.showMessage(`User ${newStatus ? 'activated' : 'deactivated'}`, false);
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Failed to update status.', true),
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.api.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u._id !== id);
        this.showMessage('User deleted successfully.', false);
        this.cdr.detectChanges();
      },
      error: () => this.showMessage('Failed to delete user.', true),
    });
  }

  showMessage(text: string, isError: boolean) {
    this.message = text;
    this.isError = isError;
    this.cdr.detectChanges(); 
    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges(); 
    }, 4000);
  }

  logout() {
    this.authService.logout();
  }
}