import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { InboxListComponent } from './inbox/inboxlist/inboxlist.component';
import { CustomerComponent } from './customer/customer.component';
import { CardComponent } from './card/card.component';
import { VideoComponent } from './video/video.component';
import { StarComponent } from './inbox/star/star.component';
import { FloorPlanViewerComponent } from './floor-plan-viewer.componentfloor-plan-viewer/floor-plan-viewer/floor-plan-viewer.component';
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
    path: 'chat', 
    component: ChatComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'buildings', 
    component: InboxComponent,
    canActivate: [authGuard], // Protecting the parent protects all children automatically
    children: [
      { path: '', component: InboxListComponent },
      { path: 'list', component: InboxListComponent },
      { path: 'star', component: StarComponent }
    ]
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
  { 
    path: 'video', 
    component: VideoComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'fp', 
    component: FloorPlanViewerComponent, 
    canActivate: [authGuard] 
  }
];