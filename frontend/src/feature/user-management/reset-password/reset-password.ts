import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { UserDialogResult } from '../../../common/interface/user-management/user-dialog';
import { User } from '../../../common/interface/user-management/user-management';
import { ChangePasswordRequest } from '../../../common/interface/login/change-password-request';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { UserManagementService } from '../user-management.service';
import { ToastService } from '../../../common/component/toast/toast-service';

// The admin reset endpoint reuses ChangePasswordRequest, whose currentPassword is
// @NotBlank on the backend but ignored for admin resets.
const ADMIN_RESET_CURRENT_PASSWORD = 'ADMIN_RESET';

@Component({
    imports: [AppFormControl, Input, ReactiveFormsModule, Button],
    selector: 'app-reset-password',
    templateUrl: './reset-password.html',
    host: {
        class: 'flex w-full flex-col text-slate-900 dark:text-white',
    },
})
export class ResetPassword {
    readonly data = inject(DIALOG_DATA) as User;

    readonly newPasswordControl: FormControl<string>;
    readonly confirmPasswordControl: FormControl<string>;
    readonly resetPasswordForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<UserDialogResult>,
        private userManagementService: UserManagementService,
        private toastService: ToastService,
        destroyRef: DestroyRef,
    ) {
        this.newPasswordControl = this.formBuilder.nonNullable.control('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
        ]);
        this.confirmPasswordControl = this.formBuilder.nonNullable.control('', [
            Validators.required,
            this.matchPasswordValidator(),
        ]);

        this.resetPasswordForm = this.formBuilder.group({
            newPassword: this.newPasswordControl,
            confirmPassword: this.confirmPasswordControl,
        });

        this.newPasswordControl.valueChanges
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe(() => this.confirmPasswordControl.updateValueAndValidity({ onlySelf: true }));
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        const body: ChangePasswordRequest = {
            currentPassword: ADMIN_RESET_CURRENT_PASSWORD,
            newPassword: this.newPasswordControl.value,
            confirmPassword: this.confirmPasswordControl.value,
        };

        this.userManagementService.resetPassword(this.data.id, body)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.dialogRef.close({ saved: true });
                    this.toastService.showSuccess('Password reset successfully');
                },
            });
    }

    private matchPasswordValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            const newPassword = control.parent?.get('newPassword')?.value;
            return control.value === newPassword ? null : { mismatch: true };
        };
    }
}
