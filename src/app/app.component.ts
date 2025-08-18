import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG modules
import { DockModule } from 'primeng/dock';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    DockModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PrimeNG Admin';
  dockItems: MenuItem[] = [];
  activeRoute: string = '';

  constructor(public router: Router) {
    // track route change
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.dockItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Chat',
        icon: 'pi pi-comment',
        routerLink: '/chat'
      },
      {
        label: 'Inbox',
        icon: 'pi pi-envelope',
        routerLink: '/inbox'
      },
      {
        label: 'Card',
        icon: 'pi pi-th-large',
        routerLink: '/card'
      },
      {
        label: 'Customer',
        icon: 'pi pi-user',
        routerLink: '/customer'
      },
      {
        label: 'Video',
        icon: 'pi pi-video',
        routerLink: '/video'
      }
    ];
  }

  isActive(path: string): boolean {
  return this.router.url === path;
}

}
