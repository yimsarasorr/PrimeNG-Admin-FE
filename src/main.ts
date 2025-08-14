import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { InboxComponent } from './app/inbox/inbox.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
