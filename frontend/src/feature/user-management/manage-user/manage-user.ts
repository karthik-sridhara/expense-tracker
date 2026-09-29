import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserUpsertRequest } from '../../../common/interface/user-management/user-upsert';
import { UserDialogData, UserDialogResult } from '../../../common/interface/user-management/user-dialog';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { AppSelect } from '../../../common/ui/select';
import { UserManagementService } from '../user-management.service';
import { Role } from '../../../common/enum/role';
import { Gender } from '../../../common/enum/gender';
import { ToastService } from '../../../common/component/toast/toast-service';

@Component({
  imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect],
  selector: 'app-manage-user',
  templateUrl: './manage-user.html',
  host: {
    class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
  },
})
export class ManageUser {
    readonly data = inject(DIALOG_DATA) as UserDialogData;

    readonly nameControl!: FormControl<string>;
    readonly genderControl!: FormControl<string>;
    readonly dobControl!: FormControl<string>;
    readonly emailControl!: FormControl<string>;
    readonly roleControl!: FormControl<string>;
    readonly passwordControl!: FormControl<string>;
    readonly userForm!: FormGroup;

    genders: { label: string; value: string }[] = [];
    roles: { label: string; value: string }[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<UserDialogResult>,
        private userManagementService: UserManagementService,
        private toastService: ToastService,
    ) {
        const user = this.data.user;

        this.genders = Object.entries(Gender).map(([label, value]) => ({ label, value }));
        this.roles = Object.entries(Role).map(([label, value]) => ({ label, value }));
        console.log(this.genders, this.roles, user);
        this.nameControl = this.formBuilder.nonNullable.control(user?.name ?? '', [
            Validators.required,
            Validators.maxLength(100),
        ]);

        this.genderControl = this.formBuilder.nonNullable.control(user?.gender ?? '', [
            Validators.required,
        ]);

        this.dobControl = this.formBuilder.nonNullable.control(user?.dob ?? '', [
            Validators.required,
        ]);

        this.emailControl = this.formBuilder.nonNullable.control(user?.email ?? '', [
            Validators.required,
            Validators.email,
            Validators.maxLength(100),
        ]);

        this.roleControl = this.formBuilder.nonNullable.control(user?.role?.id ?? '', [
            Validators.required,
        ]);

        // Password required when adding; optional on edit (blank = keep current password)
        this.passwordControl = this.formBuilder.nonNullable.control(
            '',
            [Validators.required, Validators.minLength(8)]
        );

        this.userForm = this.formBuilder.group({
            name: this.nameControl,
            gender: this.genderControl,
            dob: this.dobControl,
            email: this.emailControl,
            role: this.roleControl,
            password: this.passwordControl,
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'add') {
            this.add();
        } else {
            this.edit();
        }
    }

    private add(): void {
        const value: UserUpsertRequest = this.userForm.getRawValue();
        this.userManagementService.addUser(value).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('User added successfully');
            },
        });
    }

    private edit(): void {
        const value: UserUpsertRequest = this.userForm.getRawValue();
        
        const userId = this.data.user!.id;
        this.userManagementService.editUser(userId, value).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('User updated successfully');
            },
        });
    }
}