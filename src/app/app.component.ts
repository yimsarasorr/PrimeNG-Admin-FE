import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

// Components
import { ChatDialogComponent } from './customer/chat-dialog/chat-dialog.component';
import { VideoDialogComponent } from './video/video-dialog/video-dialog.component';

// Services
import { ChatService } from './service/chat.service';
import { VideoService } from './service/video.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AvatarModule,
    DividerModule,
    DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PrimeNG Admin';
  activeRoute: string = '';

  topMenu: any[] = [];
  bottomMenu: any[] = [];

  private routeSub!: Subscription;
  private ref?: DynamicDialogRef;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private chatService: ChatService,
    private videoService: VideoService
  ) {
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

    // subscribe to query params (global modal handler)
    this.routeSub = this.route.queryParams.subscribe(params => {
      const chatId = params['chatId'];
      const videoId = params['videoId'];

      // Close existing modal if any
      if (this.ref) {
        this.ref.close();
        this.ref = undefined;
      }

      if (chatId) {
        const customer = this.chatService.getUsers().find(c => c.id === +chatId);
        if (customer) this.openChatModal(customer);
      } else if (videoId) {
        const video = this.videoService.getVideoById(+videoId);
        if (video) this.openVideoModal(video);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.ref) this.ref.close();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  private openChatModal(customer: any) {
    this.ref = this.dialogService.open(ChatDialogComponent, {
      data: { userId: customer.id, name: customer.name, avatar: customer.avatar },
      header: `${customer.name} - Chat`,
      style: { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }, // Full screen
      contentStyle: { height: '100%', padding: '0' }, // Full height content
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe(() => {
      this.clearQueryParam('chatId');
    });
  }

  private openVideoModal(video: any) {
    this.ref = this.dialogService.open(VideoDialogComponent, {
      data: video,
      header: video.title,
      style: { width: '70vw', maxWidth: '800px' },
      contentStyle: { height: 'auto' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe(() => {
      this.clearQueryParam('videoId');
      this.ref = undefined;
    });
  }

  private clearQueryParam(param: string) {
    this.router.navigate([], {
      queryParams: { [param]: null },
      queryParamsHandling: 'merge'
    });
  }
}
