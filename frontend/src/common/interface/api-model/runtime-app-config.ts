import { InjectionToken } from "@angular/core";

export interface RuntimeAppConfig {
  apiBaseUrl: string;
  authAuthority: string;
  enableReports: boolean;
}

export const RUNTIME_APP_CONFIG = new InjectionToken<RuntimeAppConfig>('RUNTIME_APP_CONFIG');