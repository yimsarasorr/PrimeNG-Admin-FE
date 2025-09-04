import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Video } from '../../service/video.service';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card *ngIf="video" [subheader]="video.genres">
      <img [src]="video.image" alt="{{ video.title }}" class="w-full mb-3" />
      <p>{{ video.description }}</p>
      <p><strong>Category:</strong> {{ video.category }}</p>
      <p><strong>Rating:</strong> ⭐ {{ video.rating }}</p>
      <button pButton label="Close" (click)="ref.close()" class="mt-3"></button>
    </p-card>
  `
})
export class VideoDialogComponent implements OnInit {
  video!: Video;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {}

  ngOnInit() {
    // Receive video data from DynamicDialogConfig
    if (this.config.data) {
      this.video = this.config.data as Video;
    }
  }
}
