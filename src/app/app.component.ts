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
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PrimeNG } from 'primeng/config';

// Services
import { ModalService } from './service/modal.service';
import { UserService, User } from './service/user.service';
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
    DropdownModule,
    TooltipModule,
    OverlayPanelModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PrimeNG Admin';
  activeRoute: string = ''; 
  sidebarVisible: boolean = false;
  
  currentUser: User | null = null; 

  selectedSite: string = 'all'; 
  
  siteOptions: any[] = [
    { label: 'All Sites (ภาพรวม)', value: 'all' },
    { label: 'KMITL', value: 'kmitl' },
    { label: 'KMITL2', value: 'kmitl2' },
    { label: 'KMUTT', value: 'kmutt' },
    { label: 'KMUTT2', value: 'kmutt2' }
  ];

  topMenu: any[] = [];
  bottomMenu: any[] = [];

  constructor(
    public router: Router,
    private modalService: ModalService,
    private primeng: PrimeNG,
    private userService: UserService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        this.sidebarVisible = false; 
      });
  }

  ngOnInit() {
    this.primeng.ripple.set(true);

    this.topMenu = [
      { label: 'หน้าหลัก', icon: 'pi pi-home', route: '/dashboard' },
      { label: 'อาคาร', icon: 'pi pi-building', route: '/buildings' },
      { label: 'จัดการการจอง', icon: 'pi pi-th-large', route: '/reserve' },
      { label: 'จัดการผู้ใช้งาน', icon: 'pi pi-user', route: '/customer' },
      { label: 'แจ้งเตือน', icon: 'pi pi-comment', route: '/chat' },
      { label: 'Video', icon: 'pi pi-video', route: '/video' }
    ];

    this.bottomMenu = [
      { label: 'Settings', icon: 'pi pi-cog', route: '/fp' },
      { label: 'Help', icon: 'pi pi-question-circle', route: '/help' }
    ];

    this.modalService.initListener();

    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.userService.checkSession().subscribe({
      error: () => console.log('User not logged in')
    });
  }

  ngOnDestroy() {
    this.modalService.ngOnDestroy();
  }

  isActive(path: string): boolean {
    return this.activeRoute === path || this.router.url === path;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  get currentSiteLabel(): string {
    const site = this.siteOptions.find(s => s.value === this.selectedSite);
    return site ? site.label : 'Select Site';
  }

get userInitials(): string {
  if (!this.currentUser) return 'G';

  // ✅ อ่านทั้ง firstName และ first_name
  const f = this.currentUser.firstName || this.currentUser.first_name || '';
  const l = this.currentUser.lastName || this.currentUser.last_name || '';

  if (!f && !l) return 'U';

  return (f.charAt(0) + l.charAt(0)).toUpperCase();
}

  // ✅ เพิ่มฟังก์ชัน Logout ตรงนี้
  logout() {
    this.userService.logout().subscribe(() => {
      this.currentUser = null;       // ล้างค่า User ในตัวแปร
      this.sidebarVisible = false;   // ปิด Sidebar
      this.router.navigate(['/login']); // ดีดกลับไปหน้า Login
    });
  }
}