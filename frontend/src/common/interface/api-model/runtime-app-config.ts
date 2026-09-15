import { InjectionToken } from "@angular/core";

export interface RuntimeAppConfig {
  apiBaseUrl: string;
  toast: {
    duration: number;
    dismissible: boolean;
  };
}

export const RUNTIME_APP_CONFIG = new InjectionToken<RuntimeAppConfig>('RUNTIME_APP_CONFIG');