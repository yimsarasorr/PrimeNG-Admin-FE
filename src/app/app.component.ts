import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    CommonModule,
    MenubarModule,
    MenuModule,
    SidebarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PrimeNG Admin';
  items: MenuItem[] = [];
  sidebarVisible: boolean = false;

  constructor(public router: Router) {}

  ngOnInit() {
    this.items = [
      { icon: 'pi pi-home', label: 'Dashboard', routerLink: '/dashboard' },
      { icon: 'pi pi-comment', label: 'Chat', routerLink: '/chat' },
      { icon: 'pi pi-envelope', label: 'Inbox', routerLink: '/inbox' },
      { icon: 'pi pi-th-large', label: 'Customer', routerLink: '/customer' },
      { icon: 'pi pi-user', label: 'Profile', routerLink: '/profile' },
      { icon: 'pi pi-video', label: 'Video', routerLink: '/video' }
    ];
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}