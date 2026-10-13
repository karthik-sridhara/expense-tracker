import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { ERROR_CODES } from '../../common/const/error-codes.const';
import { Router } from '@angular/router';
import { AppSessionService } from '../../common/service/app-session';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialogData } from '../../common/interface/app/app-dialog';
import { ApiError } from '../../common/interface/api-model/api-error';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private readonly dialogService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly appSessionService = inject(AppSessionService);
    private readonly recentBackendErrors = new Map<string, number>();
    private readonly duplicateWindowMs = 3_000;

    handleError(error: unknown): void {

        if (error instanceof HttpErrorResponse) {
            this.handleBackendError(error);
        }else{
            const applicationError = error instanceof Error
                ? error
                : new Error(String(error));

            console.groupCollapsed(
                `[Application Error] ${applicationError.message}`
            );
            console.error(applicationError);
            console.error('Stack trace:', applicationError.stack ?? 'Unavailable');
            console.groupEnd();
        }
    }

    private handleBackendError(error: HttpErrorResponse): void {
        const url = error.url ?? 'Unknown URL';

        if(!url.includes('/api/')) {
            return;
        }
        const backendError:ApiError = error.error;
        if (this.isDuplicateBackendError(backendError)) {
            return;
        }
        if (
            error.status === 401 &&
            backendError?.code === ERROR_CODES.UNAUTHORIZED
        ) {

            this.appSessionService.clearSession();
            this.router.navigate(['/login'], {
                queryParams: {
                    returnUrl: this.router.routerState.snapshot.url
                }
            });

            this.dialogService.open<MessageDialog, MessageDialogData, void>(
                MessageDialog,
                {
                    data: {
                    title: 'Unauthorized',
                    message: 'Your session has expired. Please log in again.',
                    kind: MessageDialogKind.INFO,
                    theme: MessageDialogTheme.WARNING
                    },
                    type: DialogType.Modal
                }
            );
        } else if (
            error.status === 403 &&
            backendError?.code === ERROR_CODES.PASSWORD_EXPIRED
        ) {
            this.router.navigate(['/login/change-password'], {
                queryParams: {
                    returnUrl: this.router.routerState.snapshot.url
                }
            });
            this.dialogService.open<MessageDialog, MessageDialogData, void>(
                MessageDialog,
                {
                    data: {
                    title: 'Password Expired',
                    message: 'Your password has expired. Please change your password.',
                    kind: MessageDialogKind.INFO,
                    theme: MessageDialogTheme.WARNING
                    },
                    type: DialogType.Modal
                }
            );
        }else{
            this.dialogService.open<MessageDialog, MessageDialogData, void>(
                MessageDialog,
                {
                    data: {
                        title: 'Error',
                        message: backendError?.message ?? 'An unexpected error occurred.',
                        kind: MessageDialogKind.INFO,
                        theme: MessageDialogTheme.ERROR
                    },
                    type: DialogType.Modal
                }
            );
        }

    }

    private isDuplicateBackendError(error: ApiError): boolean {
        const code = error?.code ?? 'UNKNOWN';
        const key = `${error.httpStatus}:${code}`;
        const now = Date.now();
        const previousTime = this.recentBackendErrors.get(key);
        
        if (
            previousTime !== undefined &&
            now - previousTime < this.duplicateWindowMs
        ) {
            return true;
        }
        
        this.recentBackendErrors.set(key, now);
        return false;
    }
}