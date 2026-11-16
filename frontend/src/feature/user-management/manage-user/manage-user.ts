import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserUpsertRequest } from '../../../common/interface/user-management/user-upsert';
import { UserDialogResult } from '../../../common/interface/user-management/user-dialog';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { AppSelect } from '../../../common/ui/select';
import { UserManagementService } from '../user-management.service';
import { Role } from '../../../common/enum/role';
import { ToastService } from '../../../common/component/toast/toast-service';
import { TitleCasePipe } from '@angular/common';
import { User } from '../../../common/interface/user-management/user-management';

@Component({
  imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect],
  selector: 'app-manage-user',
  templateUrl: './manage-user.html',
  host: {
    class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
  },
})
export class ManageUser {
    readonly data = inject(DIALOG_DATA) as User;

    readonly emailControl!: FormControl<string>;
    readonly roleControl!: FormControl<string>;
    readonly userForm!: FormGroup;

    roles: { label: string; value: string }[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<UserDialogResult>,
        private userManagementService: UserManagementService,
        private toastService: ToastService,
    ) {
        this.roles = Object.entries(Role).map(([key, value]) => {
            const label = new TitleCasePipe().transform(key);
            return { label: label, value: value  };
        });
        
        this.emailControl = this.formBuilder.nonNullable.control('', [
            Validators.required,
            Validators.email,
            Validators.maxLength(100),
        ]);

        this.roleControl = this.formBuilder.nonNullable.control('', [
            Validators.required,
        ]);

        this.userForm = this.formBuilder.group({
            email: this.emailControl,
            role: this.roleControl,
            version: this.formBuilder.nonNullable.control(0)
        });
        this.loadUser(this.data!.id);
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }
        this.edit();
    }

    private edit(): void {
        const value: UserUpsertRequest = this.userForm.getRawValue();
        
        const userId = this.data!.id;
        this.userManagementService.editUser(userId, value).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('User updated successfully');
            },
        });
    }

    private loadUser(userId:number): void {
        this.userManagementService.getUser(userId).subscribe({
            next: (data) => {
                const user = data.data;
                this.userForm.patchValue(user);
                this.roleControl.setValue(user.role.id);
            },
        });
    }
}