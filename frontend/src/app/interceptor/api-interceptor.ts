import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppSessionService } from '../../common/service/app-session';
import { catchError } from 'rxjs';
import { ERROR_CODES } from '../../common/const/error-codes.const';
export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    if (!request.url.startsWith('/api/')) {
        return next(request);
    }

    const appSessionService = inject(AppSessionService);
    const token = appSessionService.getToken();

    const headers: Record<string, string> = {
        Accept: 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return next(
        request.clone({
            setHeaders: headers
        })
    ).pipe(
        catchError((error) => {
            if(error.status === 401) {
                const errorCode = error?.error?.code;
                if(errorCode === ERROR_CODES.UNAUTHORIZED) {
                    console.error('Unauthorized access - perhaps redirect to login');
                    window.location.href = '/login';
                }
            }
            throw error;
        })
    );
};