import { Component, signal } from '@angular/core';
import { Button } from '../../../../common/ui/button';
import { Input } from '../../../../common/ui/input';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { AppFormControl } from '../../../../common/ui/form-control';
import { RouterLink } from '@angular/router';
import { AppLogo } from '../../../../common/ui/app-logo';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageBanner, MessageBannerType } from '../../../../common/ui/message-banner';
import { LoginService } from '../../../../common/service/login.service';
import { ChangePasswordRequest } from '../../../../common/interface/login/change-password-request';
import { DividerLine } from "../../../../common/ui/divider-line";
import { take } from 'rxjs';

@Component({
    imports: [Button, Input, ReactiveFormsModule, AppFormControl, AppLogo, RouterLink, MessageBanner, DividerLine],
    selector: 'app-change-password',
    templateUrl: './change-password.html',
    host: {
        class: 'w-full min-h-full flex items-center justify-center',
    },
})
export class ChangePasswordForm {

    protected readonly MessageBannerType = MessageBannerType;

    changePasswordForm!: FormGroup;
    currentPasswordControl!: FormControl;
    newPasswordControl!: FormControl;
    confirmPasswordControl!: FormControl;
    readonly errorMessage = signal<string | null>(null);
    readonly successMessage = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
    ) {
        this.createChangePasswordForm();
    }

    private createChangePasswordForm() {
        this.currentPasswordControl = this.fb.control(null, [Validators.required]);
        this.newPasswordControl = this.fb.control(null, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
        ]);
        this.confirmPasswordControl = this.fb.control(null, [
            Validators.required,
            this.matchPasswordValidator(),
        ]);

        this.changePasswordForm = this.fb.group({
            currentPassword: this.currentPasswordControl,
            newPassword: this.newPasswordControl,
            confirmPassword: this.confirmPasswordControl,
        });

        // Re-validate confirmPassword whenever newPassword changes.
        this.newPasswordControl.valueChanges.subscribe(() => {
            this.confirmPasswordControl.updateValueAndValidity({ onlySelf: true });
        });
    }

    private matchPasswordValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
            const newPassword = control.parent.get('newPassword')?.value;
            return control.value === newPassword ? null : { mismatch: true };
        };
    }

    changePassword() {
        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }
        this.errorMessage.set(null);
        const body: ChangePasswordRequest = this.changePasswordForm.value;
        this.loginService.changePassword(body)
        .pipe(take(1))
        .subscribe({
            next: () => {
                this.successMessage.set('Password changed successfully. Please log in again.');
                setTimeout(() => this.loginService.onLogout(), 1500);
            },
            error: (error: HttpErrorResponse) => {
                this.errorMessage.set(error.error?.message ?? 'Something went wrong. Please try again.');
            },
        });
    }
}