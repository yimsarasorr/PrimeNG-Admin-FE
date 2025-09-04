import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { DockModule } from 'primeng/dock';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { MenuItem } from 'primeng/api';
import { VideoService, Video } from '../service/video.service';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DockModule,
    InputTextModule,
    CarouselModule,
    CardModule,
    TabMenuModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {
  keepWatching: Video[] = [];
  popular: Video[] = [];
  categories: MenuItem[] = [
    { label: 'Popular' },
    { label: 'New Releases' },
    { label: 'Recently Added' },
    { label: 'For you' }
  ];
  activeCategory: MenuItem = this.categories[0];

  private routeSub!: Subscription;
  ref: DynamicDialogRef | undefined;

  constructor(
    private videoService: VideoService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.keepWatching = this.videoService.getKeepWatching();
    this.popular = this.videoService.getPopular();

    // ✅ Check direct URL entry
    const initialVideoId = this.route.snapshot.queryParams['videoId'];
    if (initialVideoId) {
      const video = this.videoService.getVideoById(+initialVideoId);
      if (video) this.openVideo(video, false);
    }

    // ✅ Subscribe for query param changes
    this.routeSub = this.route.queryParams.subscribe(params => {
      const videoId = params['videoId'];
      if (videoId) {
        const video = this.videoService.getVideoById(+videoId);
        if (video) this.openVideo(video, false);
      } else if (!videoId && this.ref) {
        this.ref.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.ref) this.ref.close();
  }

  openVideo(video: Video, updateUrl: boolean = true) {
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { videoId: video.id },
        queryParamsHandling: 'merge'
      });
    }

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
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { videoId: null },
        queryParamsHandling: 'merge'
      });
    });
  }
}
