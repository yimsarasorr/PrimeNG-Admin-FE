import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

import { providePrimeNG } from "primeng/config";
import Aura from "@primeuix/themes/aura";

// PrimeNG dialog
import { DynamicDialogModule, DialogService } from "primeng/dynamicdialog";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      },
    }),
    importProvidersFrom(DynamicDialogModule), // ✅ required for dialogs
    DialogService,                            // ✅ global provider
  ],
};
