import { Component, DestroyRef, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import { debounceTime, distinctUntilChanged, merge, take } from "rxjs";
import type { ColDef } from "ag-grid-community";
import { Input } from "../../common/ui/input";
import { AppSelect } from "../../common/ui/select";
import { Button } from "../../common/ui/button";
import { AppTable } from "../../common/component/app-table/app-table";
import { Role } from "../../common/enum/role";
import { UserManagementService } from "./user-management.service";
import { User } from "../../common/interface/user-management/user-management";
import { AppDatetimeService } from "../../common/service/app-datetime";
import { MessageDialog } from "../../common/component/app-dialog/message-dialog";
import { MessageDialogData, MessageDialogResult } from "../../common/interface/app/app-dialog";
import { ToastService } from "../../common/component/toast/toast-service";
import { DialogService } from "../../common/component/app-dialog/app-dialog.service";
import { DialogType, MessageDialogKind, MessageDialogTheme } from "../../common/enum/dialog";
import { UserDialogData, UserDialogResult } from "../../common/interface/user-management/user-dialog";
import { ManageUser } from "./manage-user/manage-user";
import { ActionsCellRenderer, TableAction } from "../../common/component/app-table/cell-renderer/actions";


@Component({
    selector: 'user-management',
    templateUrl: './user-management.html',
    imports: [Input, AppSelect, Button, AppTable, ReactiveFormsModule],
    styles: [`
        #user-app-table {
            height: calc(100vh - 390px);
        }
        @media (min-width: 768px) {
            #user-app-table {
                height: calc(100vh - 290px);
            }
        }
        
    `],
    host: {
        class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }
})
export class UserManagement implements OnInit {

    roles: { label: string, value: string }[] = [];

    userColDefs = signal<ColDef[]>([]);
    userRowData = signal<User[]>([]);

    searchTextFormControl!: FormControl;
    roleFormControl!: FormControl;

    constructor(
        private userManagementService: UserManagementService,
        private _destory$: DestroyRef,
        private appDateTimeService: AppDatetimeService,
        private dialogService: DialogService,
        private toastService: ToastService
    ) {
        this.loadRoles();
        this.loadUserColDefs();
        this.createFilterFormControls();
    }

    ngOnInit(): void {
        this.getUsers();
    }

    private loadRoles() {
        this.roles = Object.entries(Role).map(([label, value]) => ({ label, value }));
    }

    private loadUserColDefs() {
        this.userColDefs.set([
            { headerName: 'Name', field: 'name', flex: 1},
            { headerName: 'Email', field: 'email', flex: 1 },
            { headerName: 'Gender', field: 'gender', flex: 1 },
            { 
                headerName: 'DOB', field: 'dob', flex: 1 , 
                valueFormatter: (params) => this.appDateTimeService.formatDateOnly(params.value),
            },
            {
                headerName: 'Role',
                field: 'role.id',
                flex: 1,
            },
            { 
                headerName: 'Last Updated', 
                valueGetter: (params) => params.data?.modifiedAt ?? params.data?.createdAt,
                valueFormatter: (params) => this.appDateTimeService.formatDateTime(params.value)
            },
            {
                headerName: 'Actions',
                cellRenderer: ActionsCellRenderer,
                cellRendererParams: {
                    actions: [
                        { icon: '/icons/edit_fill.svg', name: 'Edit', onClick: (row) => this.onEdit(row) },
                        { icon: '/icons/delete_fill.svg', name: 'Delete', onClick: (row) => this.onDelete(row) },
                    ] satisfies TableAction[],
                },
                minWidth: 110, sortable: false, filter: false, resizable: false,
            },
        ]);
    }

    private createFilterFormControls() {
        this.searchTextFormControl = new FormControl("");
        this.roleFormControl = new FormControl("ALL");

        const filterSubscription = merge(
            this.searchTextFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged()),
            this.roleFormControl.valueChanges
        ).subscribe(() => this.getUsers());

        this._destory$.onDestroy(() => filterSubscription.unsubscribe());
    }

    private getUsers() {
        const searchText = this.searchTextFormControl.value;
        let params: HttpParams | undefined;
        if (searchText && searchText.trim() !== "") {
            params = new HttpParams().set('search-text', searchText);
        }

        const role = this.roleFormControl.value;
        if (role && role !== "ALL") {
            params = (params ?? new HttpParams()).set('role', role);
        }

        this.userManagementService.getUsers(params)
            .pipe(take(1))
            .subscribe(response => {
                this.userRowData.set(response.data);
            });
    }


    onAddUser() {
        this.openDialog({ mode: 'add', user: null });
    }

    private onEdit(row: User) {
        this.openDialog({ mode: 'edit', user: row });
    }

    private onDelete(row: User) {
        this.dialogService.open<MessageDialog, MessageDialogData, MessageDialogResult>(MessageDialog, {
            data: {
                title: 'Delete User',
                message: 'Are you sure you want to delete this user?',
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                kind: MessageDialogKind.CONFIRM,
                theme: MessageDialogTheme.ERROR,
                iconSrc: '/icons/delete_fill.svg',
            },
            width: '350px',
            type: DialogType.Modal,
            closeOnBackdrop: false,
            ariaLabel: 'Delete user',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.confirmed) {
                this.userManagementService.deleteUser(row.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastService.showSuccess('User deleted successfully');
                        this.getUsers();
                    },
                });
            }
        });
    }

    private openDialog(data: UserDialogData) {
        this.dialogService.open<ManageUser, UserDialogData, UserDialogResult>(ManageUser, {
            data,
            type: DialogType.Sidepop,
            ariaLabel: data.mode === 'add' ? 'Add user' : 'Edit user',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.saved) {
                this.getUsers();
            }
        });
    }
}