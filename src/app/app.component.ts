import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DashboardComponent,
    ChatComponent,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    CommonModule,
    MenubarModule,
    MenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  items: MenuItem[] = [];
  title = 'PrimeNG Admin';
  ngOnInit() {
    this.items = [
      { icon: 'pi pi-home', routerLink: '/dashboard',name: 'Dashboard' },
      { icon: 'pi pi-comment', routerLink: '/chat', name: 'Chat' },
      { icon: 'pi pi-envelope', routerLink: '/mail' , name: 'Mail' },
      { icon: 'pi pi-th-large', routerLink: '/grid', name: 'Grid' },
      { icon: 'pi pi-user', routerLink: '/profile', name: 'Profile' },
      { icon: 'pi pi-video', routerLink: '/video', name: 'Video' }
    ];
  }
}
