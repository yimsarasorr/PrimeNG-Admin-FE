import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message'; // Import Message Module

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    RouterModule, 
    CardModule, 
    InputTextModule, 
    ButtonModule,
    DropdownModule,
    MessageModule
  ],
  template: `
    <div class="flex justify-content-center align-items-center min-h-screen surface-ground">
      <p-card header="Register (Passwordless)" [style]="{ width: '500px' }">
        
        <p class="text-gray-600 mb-4 text-sm">
            Fill in your details. We will send a secure login link to your email.
        </p>

        <div class="formgrid grid">
          <div class="field col-6">
            <label>First Name</label>
            <input type="text" pInputText [(ngModel)]="firstName" class="w-full" />
          </div>
          <div class="field col-6">
            <label>Last Name</label>
            <input type="text" pInputText [(ngModel)]="lastName" class="w-full" />
          </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-6">
                <label>Email</label>
                <input type="email" pInputText [(ngModel)]="email" class="w-full" />
            </div>
            <div class="field col-6">
                <label>Phone Number</label>
                <input type="text" pInputText [(ngModel)]="phone" class="w-full" placeholder="08x-xxx-xxxx" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-6">
                <label>User Type</label>
                <p-dropdown [options]="typeOptions" [(ngModel)]="category" optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
            </div>
            <div class="field col-6">
                <label>Company / Org</label>
                <input type="text" pInputText [(ngModel)]="company" class="w-full" />
            </div>
        </div>

        <div class="field mt-2">
            <label>Role</label>
            <p-dropdown [options]="roleOptions" [(ngModel)]="role" optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
        </div>

        <div *ngIf="errorMessage" class="p-message p-message-error w-full mb-3">
            <div class="p-message-wrapper p-2">
                <i class="pi pi-times-circle mr-2"></i>
                <span>{{ errorMessage }}</span>
            </div>
        </div>

        <div *ngIf="successMessage" class="p-message p-message-success w-full mb-3">
            <div class="p-message-wrapper p-2">
                <i class="pi pi-check-circle mr-2"></i>
                <span>{{ successMessage }}</span>
            </div>
        </div>

        <div class="flex flex-column gap-2 mt-4">
          <p-button 
            [label]="loading ? 'Processing...' : 'Register & Send Link'" 
            [icon]="loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'"
            (onClick)="onRegister()"
            [disabled]="loading">
          </p-button>
          
          <a routerLink="/login" class="text-center text-sm mt-2">Already have an account? Login</a>
        </div>
      </p-card>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  company = '';
  category = 'Internal';
  role = 'User';
  
  // UI States
  loading = false;
  errorMessage = '';
  successMessage = '';

  typeOptions = [
    { label: 'Internal (Employee)', value: 'Internal' },
    { label: 'External (Visitor/Partner)', value: 'External' }
  ];

  roleOptions = [
    { label: 'General User', value: 'User' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Admin', value: 'Admin' }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // 1. Validation (No Password Check anymore)
    if (!this.firstName || !this.lastName || !this.email) {
        this.errorMessage = 'Please fill in Name and Email.';
        return;
    }

    this.loading = true;

    // 2. Prepare Payload (No Password)
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      category: this.category,
      company: this.company,
      role: this.role
    };

    // 3. Send to Backend
    this.http.post('http://localhost:3000/api/register', payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Show success and maybe redirect after a few seconds
        this.successMessage = 'Account created! Please check your email for the magic link.';
        
        // Optional: Redirect to login after 3 seconds
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 5000);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Cannot register account.';
      }
    });
  }
}