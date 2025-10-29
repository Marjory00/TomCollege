// src/main.server.ts (Fixed Syntax for Standalone/SSR)

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ApplicationConfig, EnvironmentProviders } from '@angular/core';

// Define the server-specific providers (if any)
const serverProviders: EnvironmentProviders[] = [
  // Any providers specific to the server environment
];

// Combine the application config with server providers
const serverConfig: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    ...serverProviders,
  ],
};

// 🚨 FIX: The exported function must pass the context as the third argument.
export default function bootstrap(context: any) {
  // context is now passed outside of the configuration object
  return bootstrapApplication(AppComponent, serverConfig, context);
}
