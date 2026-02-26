import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { providePrimeNG } from "primeng/config";

// 👇 1. Import คำสั่งสำหรับ HTTP Client
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// 👇 2. Import ตัว Interceptor ที่เราสร้างไว้ (บรรทัดนี้แหละที่คุณขาดไป)
import { authInterceptor } from './interceptors/auth.interceptor';

import { definePreset } from '@primeuix/themes';
import Aura from "@primeuix/themes/aura";
import { DynamicDialogModule, DialogService } from "primeng/dynamicdialog";

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: 'none'
        }
      },
    }),
    importProvidersFrom(DynamicDialogModule),
    DialogService,

    // ✅ ตรงนี้จะหายแดงแล้ว เพราะเรา import มาครบแล้ว
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};