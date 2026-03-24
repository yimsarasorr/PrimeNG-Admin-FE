import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    RouterModule, 
    CardModule, 
    InputTextModule, 
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="flex justify-content-center align-items-center min-h-screen surface-ground">
      <p-card header="Login via Magic Link" [style]="{ width: '400px' }">
        
        <p class="text-gray-600 mb-4">
            Enter your email and we'll send you a secure link to sign in. 
            No password required.
        </p>

        <div class="field">
          <label>Email</label>
          <input type="email" pInputText [(ngModel)]="email" class="w-full" placeholder="you@company.com" />
        </div>

        <div *ngIf="successMessage" class="p-message p-message-success w-full mb-3">
            <div class="p-message-wrapper p-2">
                <i class="pi pi-check-circle mr-2"></i>
                <span>{{ successMessage }}</span>
            </div>
        </div>

        <div *ngIf="errorMessage" class="p-message p-message-error w-full mb-3">
            <div class="p-message-wrapper p-2">
                <i class="pi pi-times-circle mr-2"></i>
                <span>{{ errorMessage }}</span>
            </div>
        </div>

        <div class="flex flex-column gap-2 mt-4">
          <p-button 
            [label]="loading ? 'Sending...' : 'Send Magic Link'" 
            [icon]="loading ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'" 
            (onClick)="onLogin()"
            [disabled]="loading">
          </p-button>
          
          <a routerLink="/register" class="text-center text-sm mt-2">Create new account</a>
        </div>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    if (!this.email) return;

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // ✅ เพิ่ม .trim() และ .toLowerCase() เพื่อตัดช่องว่างและแปลงเป็นตัวเล็ก
  const cleanEmail = this.email.trim().toLowerCase();

  this.http.post(environment.apiUrl + '/login', { email: cleanEmail }).subscribe({
      next: (res: any) => {
        this.loading = false;
        // ✅ Show success message
        this.successMessage = 'Link sent! Please check your inbox.';
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Failed to send link.';
      }
    });
  }
}