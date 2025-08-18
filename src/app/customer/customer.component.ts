import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';

interface Customer {
  name: string;
  avatar?: string;
  initials?: string;
  title: string;
  company: string;
  email: string;
  leadSource: string;
  status: 'Active' | 'Inactive' | 'Prospect';
}

@Component({
  selector: 'app-customer',
  standalone: true, // <-- important for Angular 16+ standalone component
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CheckboxModule,
    AvatarModule,
    BadgeModule,
    OverlayBadgeModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customers: Customer[] = [
    { name: 'Brook Simmons', avatar: 'assets/brook.jpg', title: 'Sales Executive', company: 'Mistranet', email: 'hi@brooksmnns.co', leadSource: 'Linkedin', status: 'Active' },
    { name: 'Dianne Russell', avatar: 'assets/dianne.jpg', title: 'CEO', company: 'BriteMank', email: 'hi@diannerussell.com', leadSource: 'Website', status: 'Inactive' },
    { name: 'Amy Elsner', avatar: 'assets/amy.jpg', title: 'Product Manager', company: 'ZenTrailMs', email: 'hi@amyelsner.com', leadSource: 'Cold Call', status: 'Prospect' },
    { name: 'Jacob Jones', avatar: 'assets/jacob.jpg', title: 'Manager', company: 'Streamlinz', email: 'jacobjones@gmail.com', leadSource: 'Partner', status: 'Prospect' },
    { name: 'Cameron Watson', initials: 'CW', title: 'Product Manager', company: 'BriteMank', email: 'hi@cameronwilliamson.com', leadSource: 'Social Media', status: 'Active' },
    { name: 'Wade Warren', initials: 'WW', title: 'Director', company: 'Streamlinz', email: 'hi@annetteblack.com', leadSource: 'Cold Call', status: 'Inactive' },
    { name: 'Guy Hawkins', avatar: 'assets/guy.jpg', title: 'Director', company: 'Wavelength', email: 'hi@darrellsteward.com', leadSource: 'Linkedin', status: 'Active' },
    { name: 'Annette Black', avatar: 'assets/annette.jpg', title: 'Manager', company: 'Wavelength', email: 'jeromebell@gmail.com', leadSource: 'Website', status: 'Inactive' }
  ];

  statuses = {
    Active: 'success',
    Inactive: 'danger',
    Prospect: 'info'
  };

    getSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      case 'Prospect':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
