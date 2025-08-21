import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DockModule } from 'primeng/dock';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';   // ✅ use TabMenuModule
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';     // ✅ for pButton
import { MenuItem } from 'primeng/api';

interface Video {
  title: string;
  category: string;
  genres: string;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-video',
  standalone: true, // ✅ standalone component
  imports: [
    CommonModule,
    RouterOutlet,
    DockModule,
    InputTextModule,
    CarouselModule,
    CardModule,
    TabMenuModule,   // ✅
    AvatarModule,
    AvatarGroupModule,
    ButtonModule     // ✅
  ],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {
  keepWatching: Video[] = [
    { title: 'Heat', category: 'Drama', genres: 'Action, Crime, Drama', rating: 4.7, image: 'https://i.ibb.co/6nM6L5f/heat.jpg' },
    { title: 'Batman Begins', category: 'Drama', genres: 'Action, Crime, Drama', rating: 4.8, image: 'https://i.ibb.co/vqHcbtJ/batman.jpg' },
    { title: 'Leon', category: 'Drama', genres: 'Action, Crime, Drama', rating: 4.3, image: 'https://i.ibb.co/qJNw1ys/leon.jpg' },
    { title: 'Matrix', category: 'Sci-Fi', genres: 'Action, Sci-Fi', rating: 4.9, image: 'https://i.ibb.co/XXmcyCG/matrix.jpg' },
    { title: 'Fight Club', category: 'Drama', genres: 'Drama', rating: 4.4, image: 'https://i.ibb.co/7CptjBQ/fightclub.jpg' }
  ];

  popular: Video[] = [
    { title: 'Twelve Angry Men', category: 'Drama', genres: 'Crime, Drama', rating: 4.6, image: 'https://i.ibb.co/99tN0nD/12angry.jpg' },
    { title: 'Saving Private Ryan', category: 'War', genres: 'Drama, War', rating: 4.4, image: 'https://i.ibb.co/pQ2mZfc/saving.jpg' },
    { title: 'Seven', category: 'Mystery', genres: 'Crime, Drama, Mystery', rating: 4.3, image: 'https://i.ibb.co/kGWyRmJ/seven.jpg' },
    { title: 'Shutter Island', category: 'Thriller', genres: 'Mystery, Thriller', rating: 4.7, image: 'https://i.ibb.co/2gZr7BM/shutter.jpg' },
    { title: 'Basic Instinct', category: 'Thriller', genres: 'Drama, Mystery', rating: 4.3, image: 'https://i.ibb.co/LNx2C4P/basic.jpg' }
  ];

  categories: MenuItem[] = [
    { label: 'Popular' },
    { label: 'New Releases' },
    { label: 'Recently Added' },
    { label: 'For you' }
  ];

  activeCategory: MenuItem = this.categories[0];
}
