import { Injectable, OnDestroy, Type } from '@angular/core';
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

interface ModalEntry {
  type: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {
  private refs: { [key: string]: DynamicDialogRef } = {};
  private routeSub!: Subscription;
  private basePath: string | null = null;
  private currentZIndex = 10000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private chatService: ChatService,
    private videoService: VideoService,
    private userInfoService: UserInfoService
  ) {}

  /** Call this in AppComponent ngOnInit */
  initListener() {
    // Subscribe to query param changes
    this.routeSub = this.route.queryParamMap.subscribe(paramMap => {
      if (!this.basePath && paramMap.keys.length > 0) {
        this.basePath = this.router.url.split('?')[0];
      }

      // Get all modal params
      const modals = paramMap.getAll('modal'); // e.g. ["chatmodal,1", "userinfo,2"]
      const parsed: ModalEntry[] = modals
        .map(m => {
          const [type, idStr] = m.split(',');
          const id = parseInt(idStr, 10);
          if (!type || isNaN(id)) return null;
          return { type, id };
        })
        .filter((x): x is ModalEntry => x !== null);

      // Close removed modals
      Object.keys(this.refs).forEach(key => {
        if (!parsed.some(m => `${m.type}-${m.id}` === key)) {
          this.refs[key]?.close();
          delete this.refs[key];
        }
      });

      // Open new modals in real time
      parsed.forEach(m => {
        const key = `${m.type}-${m.id}`;
        if (!this.refs[key]) {
          this.openModal(m.type, m.id);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.closeAllModals();
  }

  /** Add a modal via query param and open immediately */
  addModal(type: string, id: number) {
    const params = { ...this.route.snapshot.queryParams };
    const existing: string[] = this.route.snapshot.queryParamMap.getAll('modal');
    const newModal = `${type},${id}`;
    if (!existing.includes(newModal)) existing.push(newModal);

    // Navigate to update URL
    this.router.navigate([], { queryParams: { ...params, modal: existing }, queryParamsHandling: 'merge' });
  }

  /** Close a modal */
  closeModal(type: string, id: number) {
    const params = { ...this.route.snapshot.queryParams };
    const existing: string[] = this.route.snapshot.queryParamMap.getAll('modal');
    const filtered = existing.filter(m => m !== `${type},${id}`);
    this.router.navigate([], { queryParams: { ...params, modal: filtered.length ? filtered : null }, queryParamsHandling: 'merge' });
  }

  /** Open modal dynamically */
  private openModal(type: string, id: number) {
    let ref: DynamicDialogRef | null = null;
    const zIndex = ++this.currentZIndex;
    let component: any;
    let data: any = null;

    switch (type.toLowerCase()) {
      case 'chatmodal':
        component = ChatDialogComponent;
        const customer = this.chatService.getUsers().find(c => c.id === id);
        if (!customer) return;
        data = { userId: customer.id, name: customer.name, avatar: customer.avatar };
        break;

      case 'videomodal':
        component = VideoDialogComponent;
        const video = this.videoService.getVideoById(id);
        if (!video) return;
        data = video;
        break;

      case 'infomodal':
      case 'userinfo':
        component = UserInfoModalComponent;
        const user = this.userInfoService.getCustomers().find(c => c.id === id);
        if (!user) return;
        data = { customer: user };
        break;

      default:
        return;
    }

    ref = this.dialogService.open(component, {
      data,
      header: data?.name || data?.title || '',
      style: { width: '60vw', maxWidth: '1200px', height: '70vh' },
      modal: true,
      dismissableMask: true,
      baseZIndex: zIndex,
      closable: true
    });

    this.refs[`${type}-${id}`] = ref;

    ref.onClose.subscribe(() => {
      delete this.refs[`${type}-${id}`];
      this.closeModal(type, id);
      if (Object.keys(this.refs).length === 0) this.checkReturnBasePath();
    });
  }

  private closeAllModals() {
    Object.values(this.refs).forEach(r => r.close());
    this.refs = {};
    this.currentZIndex = 10000;
  }

  private checkReturnBasePath() {
    if (Object.keys(this.refs).length === 0 && this.basePath) {
      this.router.navigate([this.basePath]);
      this.basePath = null;
    }
  }
}
