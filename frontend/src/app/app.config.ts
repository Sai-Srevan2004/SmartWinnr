// This file provides global configuration for the Angular app

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Required for HTTP calls
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),      // Set up routing
    provideHttpClient(),        // Allow HTTP requests (needed for API calls)
  ],
};