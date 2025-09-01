import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG modules
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AvatarModule,
    DividerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PrimeNG Admin';
  activeRoute: string = '';

  topMenu: any[] = [];
  bottomMenu: any[] = [];

  constructor(public router: Router) {
    // track route change
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.topMenu = [
      { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
      { label: 'Chat', icon: 'pi pi-comment', route: '/chat' },
      { label: 'Inbox', icon: 'pi pi-envelope', route: '/inbox' },
      { label: 'Card', icon: 'pi pi-th-large', route: '/card' },
      { label: 'Customer', icon: 'pi pi-user', route: '/customer' },
      { label: 'Video', icon: 'pi pi-video', route: '/video' }
    ];

    this.bottomMenu = [
      { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
      { label: 'Help', icon: 'pi pi-question-circle', route: '/help' }
    ];
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
