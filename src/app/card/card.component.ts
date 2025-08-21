import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipModule } from 'primeng/chip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FluidModule } from 'primeng/fluid';


@Component({
  selector: 'app-card',
    standalone: true, // <-- important for Angular 16+ standalone component
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ChipModule,
    SelectButtonModule,
    InputSwitchModule,
    FormsModule,
    AvatarModule,
    AvatarGroupModule,
    FluidModule
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  // Upload Files
  documentName: string = '';
  tags: string[] = [];
  access: string = 'Everyone';

  // Add Member
  members = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ];

  // User Profiles
  profileMode: string = 'Chilling';
  sound: boolean = true;
  wifi: boolean = true;
  darkMode: boolean = false;
  location: boolean = true;
  privacy: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
