import { Component, DestroyRef, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpParams } from "@angular/common/http";
import { debounceTime, distinctUntilChanged, merge, take } from "rxjs";
import type { ColDef } from "ag-grid-community";
import { Input } from "../../common/ui/input";
import { AppSelect } from "../../common/ui/select";
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
import { UserDialogResult } from "../../common/interface/user-management/user-dialog";
import { ManageUser } from "./manage-user/manage-user";
import { ResetPassword } from "./reset-password/reset-password";
import { ActionsCellRenderer, TableAction } from "../../common/component/app-table/cell-renderer/actions";
import { AppPagination, PaginationChange } from "../../common/component/app-pagination/app-pagination";
import { TitleCasePipe } from "@angular/common";


@Component({
    selector: 'user-management',
    templateUrl: './user-management.html',
    imports: [Input, AppSelect,  AppTable, ReactiveFormsModule, AppPagination],
    styles: [`
        #user-app-table {
            height: calc(100vh - 402px);
            min-height: 300px;
        }
        @media (min-width: 768px) {
            #user-app-table {
                height: calc(100vh - 302px);
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
    page = signal(0);
    pageSize = signal(10);
    totalElements = signal(0);
    totalPages = signal(0);

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
        this.roles = Object.entries(Role).map(([key, value]) => {
            const label = new TitleCasePipe().transform(key);
            return { label: label, value: value  };
        });
    }

    private loadUserColDefs() {
        this.userColDefs.set([
            { headerName: 'Name', field: 'name', flex: 1},
            { headerName: 'Email', field: 'email', flex: 1 },
            { 
                headerName: 'Gender', field: 'gender', flex: 1 ,
                valueFormatter: (params) => params.value ? params.value : '-'
            },
            { 
                headerName: 'DOB', field: 'dob', flex: 1 , 
                valueFormatter: (params) => params.value ? 
                    this.appDateTimeService.formatDateOnly(params.value) : '-',
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
                        { icon: '/icons/lock_reset_fill.svg', name: 'Reset Password', onClick: (row) => this.onResetPassword(row) },
                        { icon: '/icons/delete_fill.svg', name: 'Delete', onClick: (row) => this.onDelete(row) }
                    ] satisfies TableAction[],
                },
                minWidth: 150, sortable: false, filter: false, resizable: false,
            },
        ]);
    }

    private createFilterFormControls() {
        this.searchTextFormControl = new FormControl("");
        this.roleFormControl = new FormControl("ALL");

        const filterSubscription = merge(
            this.searchTextFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged()),
            this.roleFormControl.valueChanges
        ).subscribe(() => {
            this.page.set(0);
            this.getUsers();
        });

        this._destory$.onDestroy(() => filterSubscription.unsubscribe());
    }

    private getUsers() {
        const searchText = this.searchTextFormControl.value;
        let params = new HttpParams()
            .set('page', this.page())
            .set('size', this.pageSize());
        if (searchText && searchText.trim() !== "") {
            params = params.set('search-text', searchText);
        }

        const role = this.roleFormControl.value;
        if (role && role !== "ALL") {
            params = params.set('role', role);
        }

        this.userManagementService.getUsers(params)
            .pipe(take(1))
            .subscribe(response => {
                this.userRowData.set(response.data.content);
                this.page.set(response.data.page);
                this.pageSize.set(response.data.size);
                this.totalElements.set(response.data.totalElement);
                this.totalPages.set(response.data.totalPage);
            });
    }

    onPaginationChange(event: PaginationChange): void {
        this.page.set(event.page);
        this.pageSize.set(event.size);
        this.getUsers();
    }

    private onEdit(row: User) {
        this.dialogService.open<ManageUser, User, UserDialogResult>(ManageUser, {
            data: row,
            type: DialogType.Modal,
            ariaLabel:'Edit user',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.saved) {
                this.getUsers();
            }
        });
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

    private onResetPassword(row: User) {
        this.dialogService.open<ResetPassword, User, UserDialogResult>(ResetPassword, {
            data: row,
            type: DialogType.Modal,
            closeOnBackdrop: false,
            ariaLabel: 'Reset password',
        });
    }
}