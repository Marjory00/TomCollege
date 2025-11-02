import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import for API service

import { routes } from './app.routes';

// Defines the root configuration for the application
export const appConfig: ApplicationConfig = {
  providers: [
    // Required Angular providers
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configures the router with the routes defined in app.routes.ts
    provideRouter(routes),

    // **Crucial: Registers the HttpClient for the ApiService to work**
    provideHttpClient()
  ]
};
