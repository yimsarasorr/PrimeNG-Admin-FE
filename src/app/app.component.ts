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
  private refs: { [type: string]: DynamicDialogRef } = {}; 
  private basePath: string | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private chatService: ChatService,
    private videoService: VideoService
  ) {
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

    this.routeSub = this.route.queryParamMap.subscribe(paramMap => {
      if (!this.basePath && paramMap.keys.length > 0) {
        this.basePath = this.router.url.split('?')[0];
      }

      // Open only first chatId
      const chatIds = paramMap.getAll('chatId').map(x => +x);
      if (chatIds.length > 0 && !this.refs['chat']) {
        this.openChatModal(chatIds[0]);
      }

      // Open only first videoId
      const videoIds = paramMap.getAll('videoId').map(x => +x);
      if (videoIds.length > 0 && !this.refs['video']) {
        this.openVideoModal(videoIds[0]);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.closeAllModals();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  private openChatModal(id: number) {
    const customer = this.chatService.getUsers().find(c => c.id === id);
    if (!customer) return;

    const ref = this.dialogService.open(ChatDialogComponent, {
      data: { userId: customer.id, name: customer.name, avatar: customer.avatar },
      header: `${customer.name} - Chat`,
      style: { width: '60vw', height: '70vh' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000
    });

    this.refs['chat'] = ref;

    // Remove query param and ref on close
    ref.onClose.subscribe(() => {
      this.removeQueryParam('chatId');
      delete this.refs['chat'];
      this.checkReturnBasePath();
    });
  }

  private openVideoModal(id: number) {
    const video = this.videoService.getVideoById(id);
    if (!video) return;

    const ref = this.dialogService.open(VideoDialogComponent, {
      data: video,
      header: video.title,
      style: { width: '70vw', maxWidth: '800px', height: '60vh' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 11000
    });

    this.refs['video'] = ref;

    ref.onClose.subscribe(() => {
      this.removeQueryParam('videoId');
      delete this.refs['video'];
      this.checkReturnBasePath();
    });
  }

  private removeQueryParam(param: string) {
    const currentParams = { ...this.route.snapshot.queryParams };
    delete currentParams[param];
    this.router.navigate([], { queryParams: currentParams });
  }

  private closeAllModals() {
    Object.values(this.refs).forEach(r => r.close());
    this.refs = {};
  }

  private checkReturnBasePath() {
    if (Object.keys(this.refs).length === 0 && this.basePath) {
      this.router.navigate([this.basePath]);
      this.basePath = null;
    }
  }
}
