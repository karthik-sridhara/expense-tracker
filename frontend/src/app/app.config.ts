import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptor/api-interceptor';
import { GlobalErrorHandler } from './interceptor/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    provideRouter(
      routes, 
      withInMemoryScrolling({ 
        anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' 
      })
    ),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    )
  ]
};
