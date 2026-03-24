import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { CustomerComponent } from './customer/customer.component';
import { CardComponent } from './card/card.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// ✅ 1. Import the Guard
import { authGuard } from './auth.guard'; 

export const routes: Routes = [
  // If user goes to root, try to go to dashboard (Guard will catch them if not logged in)
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // ✅ PUBLIC ROUTES (No Guard)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔒 PROTECTED ROUTES (Add canActivate: [authGuard])
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'buildings', 
    component: InboxComponent,
    canActivate: [authGuard], // Protecting the parent protects all children automatically
  },
  { 
    path: 'customer', 
    component: CustomerComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'reserve', 
    component: CardComponent, 
    canActivate: [authGuard] 
  },
 
];