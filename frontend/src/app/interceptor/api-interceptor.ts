import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppSessionService } from '../../common/service/app-session';
import { finalize } from 'rxjs';
import { LoaderService } from '../../common/service/loader';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    if (!request.url.startsWith('/api/')) {
        return next(request);
    }

    const appSessionService = inject(AppSessionService);
    const token = appSessionService.getToken();
    const loaderService = inject(LoaderService);

    const headers: Record<string, string> = {
        Accept: 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    loaderService.show();

    return next(
        request.clone({
            setHeaders: headers
        })
    ).pipe(finalize(() => loaderService.hide()));
};

