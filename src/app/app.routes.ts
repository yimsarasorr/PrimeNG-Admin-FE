import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { CustomerComponent } from './customer/customer.component';
import { CardComponent } from './card/card.component';
import { VideoComponent } from './video/video.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'card', component: CardComponent },
  { path: 'video', component: VideoComponent }
];

