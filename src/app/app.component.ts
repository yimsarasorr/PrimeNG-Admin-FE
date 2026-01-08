import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// PrimeNG Imports
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PrimeNG } from 'primeng/config';

// Services
import { ModalService } from './service/modal.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    AvatarModule,
    DividerModule,
    DynamicDialogModule,
    RippleModule,
    SidebarModule,
    ButtonModule,
    SelectButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PrimeNG Admin';
  
  // ✅ ADDED: This missing property caused the error
  activeRoute: string = ''; 
  
  sidebarVisible: boolean = false;
  
  // Toggle Configuration
  selectedSite: string = 'kmitl';
  siteOptions: any[] = [
    { label: 'KMITL', value: 'kmitl' },
    { label: 'KMUTT', value: 'kmutt' }
  ];

  topMenu: any[] = [];
  bottomMenu: any[] = [];

  constructor(
    public router: Router,
    private modalService: ModalService,
    private primeng: PrimeNG
  ) {
    // Subscribe to router events to update active state
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        this.sidebarVisible = false; // Close sidebar on mobile when navigating
      });
  }

  ngOnInit() {
    // Enable Ripple
    this.primeng.ripple.set(true);

    // Menu Items
    this.topMenu = [
      { label: 'หน้าหลัก', icon: 'pi pi-home', route: '/dashboard' },
      { label: 'อาคาร', icon: 'pi pi-building', route: '/buildings' },
      { label: 'จัดการการจอง', icon: 'pi pi-th-large', route: '/card' },
      { label: 'จัดการผู้ใช้งาน', icon: 'pi pi-user', route: '/customer' },
      { label: 'แจ้งเตือน', icon: 'pi pi-comment', route: '/chat' },
      { label: '...', icon: 'pi pi-video', route: '/video' }
    ];

    this.bottomMenu = [
      { label: 'Settings', icon: 'pi pi-cog', route: '/fp' },
      { label: 'Help', icon: 'pi pi-question-circle', route: '/help' }
    ];

    this.modalService.initListener();
  }

  ngOnDestroy() {
    this.modalService.ngOnDestroy();
  }

  // Check active route for styling
  isActive(path: string): boolean {
    return this.activeRoute === path || this.router.url === path;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}