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
        private _destory$: DestroyRef
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
            { headerName: 'DOB', field: 'dob', flex: 1 },
            {
                headerName: 'Role',
                valueGetter: (params) => params.data?.role?.name,
                flex: 1,
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
            params = new HttpParams().set('searchText', searchText);
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
        // TODO: open an "add user" dialog, mirroring ManageCategory/ManageBudget pattern
    }
}