import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    CheckboxModule,
    ChipModule,
    InputSwitchModule,
    SliderModule
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  // NgModel properties for the components
  everyoneChecked: boolean = false;
  adminsOnlyChecked: boolean = false;
  soundChecked: boolean = true;
  wifiChecked: boolean = false;
  darkModeChecked: boolean = true;
  locationChecked: boolean = false;
  privacyChecked: boolean = true;
  rangeValues: number[] = [0, 10000];
  popularSpecs: string[] = ['Furnished', 'Detached', 'Balcony'];
}
