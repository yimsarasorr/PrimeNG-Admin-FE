import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

// Components
import { ChatDialogComponent } from '../customer/chat-dialog/chat-dialog.component';
import { VideoDialogComponent } from '../video/video-dialog/video-dialog.component';
import { UserInfoModalComponent } from '../customer/user-info-modal/user-info-modal.component';

// Services
import { ChatService } from './chat.service';
import { VideoService } from './video.service';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  private refs: { [type: string]: DynamicDialogRef } = {};
  private routeSub!: Subscription;
  private basePath: string | null = null;
  private currentZIndex = 10000; // starting z-index

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private chatService: ChatService,
    private videoService: VideoService,
    private userInfoService: UserInfoService
  ) {}

  initListener() {
    this.routeSub = this.route.queryParamMap.subscribe(paramMap => {
      if (!this.basePath && paramMap.keys.length > 0) {
        this.basePath = this.router.url.split('?')[0];
      }

      // Chat modal
      const chatIds = paramMap.getAll('chatId').map(x => +x);
      if (chatIds.length > 0 && !this.refs['chat']) {
        this.openChatModal(chatIds[0]);
      }

      // Video modal
      const videoIds = paramMap.getAll('videoId').map(x => +x);
      if (videoIds.length > 0 && !this.refs['video']) {
        this.openVideoModal(videoIds[0]);
      }

      // User Info modal
      const userIds = paramMap.getAll('userId').map(x => +x);
      if (userIds.length > 0 && !this.refs['user']) {
        this.openUserInfoModal(userIds[0]);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.closeAllModals();
  }

  // ----------------------------
  // Open modals
  // ----------------------------

  private openChatModal(id: number) {
    const customer = this.chatService.getUsers().find(c => c.id === id);
    if (!customer) return;

    const zIndex = ++this.currentZIndex;

    this.router.navigate([], {
      queryParams: { ...this.route.snapshot.queryParams, chatId: id },
      queryParamsHandling: 'merge'
    });

    const ref = this.dialogService.open(ChatDialogComponent, {
      data: { userId: customer.id, name: customer.name, avatar: customer.avatar },
      header: `${customer.name} - Chat`,
      style: { width: '60vw', height: '70vh' },
      modal: true,
      dismissableMask: true,
      baseZIndex: zIndex
    });

    this.refs['chat'] = ref;

    ref.onClose.subscribe(() => {
      this.removeQueryParam('chatId');
      delete this.refs['chat'];

      // Close user modal if chat closes
      if (this.refs['user']) {
        this.refs['user'].close();
        delete this.refs['user'];
        this.removeQueryParam('userId');
      }

      this.checkReturnBasePath();
    });
  }

  private openVideoModal(id: number) {
    const video = this.videoService.getVideoById(id);
    if (!video) return;

    const zIndex = ++this.currentZIndex;

    this.router.navigate([], {
      queryParams: { ...this.route.snapshot.queryParams, videoId: id },
      queryParamsHandling: 'merge'
    });

    const ref = this.dialogService.open(VideoDialogComponent, {
      data: video,
      header: video.title,
      style: { width: '70vw', maxWidth: '800px', height: '60vh' },
      modal: true,
      dismissableMask: true,
      baseZIndex: zIndex
    });

    this.refs['video'] = ref;

    ref.onClose.subscribe(() => {
      this.removeQueryParam('videoId');
      delete this.refs['video'];
      this.checkReturnBasePath();
    });
  }

  private openUserInfoModal(id: number) {
    const customer = this.userInfoService.getCustomers().find(c => c.id === id);
    if (!customer) return;

    const zIndex = ++this.currentZIndex;

    this.router.navigate([], {
      queryParams: { ...this.route.snapshot.queryParams, userId: id },
      queryParamsHandling: 'merge'
    });

    const ref = this.dialogService.open(UserInfoModalComponent, {
      data: { customer },
      header: `${customer.name} - Info`,
      style: { width: '80vw', maxWidth: '1200px' },
      modal: true,
      dismissableMask: true,
      baseZIndex: zIndex,
      closable: false
    });

    this.refs['user'] = ref;

    ref.onClose.subscribe(() => {
      this.removeQueryParam('userId');
      delete this.refs['user'];

      if (!this.refs['chat'] && !this.refs['video']) {
        this.checkReturnBasePath();
      }
    });
  }

  // ----------------------------
  // Helpers
  // ----------------------------

  private removeQueryParam(param: string) {
    const currentParams = { ...this.route.snapshot.queryParams };
    delete currentParams[param];
    this.router.navigate([], { queryParams: currentParams });
  }

  private closeAllModals() {
    Object.values(this.refs).forEach(r => r.close());
    this.refs = {};
    this.currentZIndex = 10000; // reset z-index
  }

  private checkReturnBasePath() {
    if (Object.keys(this.refs).length === 0 && this.basePath) {
      this.router.navigate([this.basePath]);
      this.basePath = null;
    }
  }
}
