import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { RUNTIME_APP_CONFIG, RuntimeAppConfig } from './common/interface/api-model/runtime-app-config';

const response = await fetch('./config/app-config.json', {
  cache: 'no-store'
});
const runtimeConfig: RuntimeAppConfig = await response.json();

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    {
      provide: RUNTIME_APP_CONFIG,
      useValue: runtimeConfig
    }
  ]
}).catch((err) => console.error(err));
