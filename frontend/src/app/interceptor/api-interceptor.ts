import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppSessionService } from '../../common/service/app-session';
import { catchError } from 'rxjs';
import { ERROR_CODES } from '../../common/const/error-codes.const';
import { Router } from '@angular/router';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialogData } from '../../common/interface/app/app-dialog';
export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    if (!request.url.startsWith('/api/')) {
        return next(request);
    }

    const appSessionService = inject(AppSessionService);
    const token = appSessionService.getToken();
    const router = inject(Router);
    const dialogService = inject(DialogService);

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
                    appSessionService.clearSession();
                    router.navigate(['/login'],{ queryParams: { returnUrl: router.routerState.snapshot.url } });
                    dialogService.open<MessageDialog,MessageDialogData, void>
                    (MessageDialog,{
                        data: {
                            title: 'Unauthorized',
                            message: 'Your session has expired. Please log in again.',
                            kind: MessageDialogKind.INFO,
                            theme: MessageDialogTheme.WARNING
                        },
                        type: DialogType.Modal
                    });
                }
            }
            throw error;
        })
    );
};