import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { ColDef, SortComparatorFn } from 'ag-grid-community';
import { debounceTime, distinctUntilChanged, merge, take } from 'rxjs';
import { Input } from '../../common/ui/input';
import { AppSelect } from '../../common/ui/select';
import { GoogleIcon } from '../../common/ui/google-icon';
import { AppTable } from '../../common/component/app-table/app-table';
import { AppPagination, PaginationChange } from '../../common/component/app-pagination/app-pagination';
import { Category } from '../../common/interface/category/category';
import { Transaction as TransactionModel } from '../../common/interface/transaction/transaction';
import { AppDatetimeService } from '../../common/service/app-datetime';
import { AppCurrencyService } from '../../common/service/app-currency';
import { GoogleIconService } from '../../common/service/google-icon.service';
import { CategoryService } from '../category/category.service';
import { CategoryCellRenderer } from '../category/category-cellrender';
import { TransactionService } from './transaction.service';
import { UiMenu } from '../../common/ui/menu';
import { ActionsCellRenderer, TableAction } from '../../common/component/app-table/cell-renderer/actions';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { MessageDialogData, MessageDialogResult } from '../../common/interface/app/app-dialog';
import { ToastService } from '../../common/component/toast/toast-service';
import { Button } from '../../common/ui/button';
import { TransactionDialogData, TransactionDialogResult } from '../../common/interface/transaction/transaction-dialog';
import { ManageTransaction } from './manage-transaction/manage-transaction';

@Component({
    imports: [Input, AppSelect, AppTable, ReactiveFormsModule, GoogleIcon, AppPagination, UiMenu, Button],
    selector: 'app-transaction',
    styleUrl: './transaction.css',
    templateUrl: './transaction.html',
    host: {
        class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }
})
export class Transaction implements OnInit {
    categories = signal<Category[]>([]);

    transactionColDefs = signal<ColDef[]>([]);
    transactionRowData = signal<TransactionModel[]>([]);
    page = signal(0);
    pageSize = signal(20);
    totalElements = signal(0);
    totalPages = signal(0);

    searchTextFormControl!: FormControl<string>;
    categoryFormControl!: FormControl<string>;
    typeFormControl!: FormControl<string>;
    fromDateFormControl!: FormControl<string>;
    toDateFormControl!: FormControl<string>;

    readonly today = this.toDateInput(new Date());

    transactionMenuItems = [
        {
            icon: '/icons/edit_fill.svg',
            text: 'Edit',
            onClick: (data: unknown) => this.onEdit(data as TransactionModel)
        },
        {
            icon: '/icons/delete_fill.svg',
            text: 'Delete',
            onClick: (data: unknown) => this.onDelete(data as TransactionModel)
        },
    ];

    constructor(
        private transactionService: TransactionService,
        private categoryService: CategoryService,
        private dialogService: DialogService,
        private toastService: ToastService,
        private appDatetimeService: AppDatetimeService,
        private appCurrencyService: AppCurrencyService,
        private _destory$: DestroyRef,
        protected googleIconService: GoogleIconService
    ) {
        this.loadColDefs();
        this.createFilterFormControls();
    }

    ngOnInit(): void {
        this.getCategories();
        this.getTransactions();
    }

    private createFilterFormControls() {
        this.categoryFormControl = new FormControl('ALL', { nonNullable: true });
        this.typeFormControl = new FormControl('ALL', { nonNullable: true });
        this.searchTextFormControl = new FormControl('', { nonNullable: true });
        this.fromDateFormControl = new FormControl('', { nonNullable: true });
        this.toDateFormControl = new FormControl('', { nonNullable: true });

        const filterSubscription = merge(
            this.categoryFormControl.valueChanges,
            this.typeFormControl.valueChanges,
            this.fromDateFormControl.valueChanges,
            this.toDateFormControl.valueChanges,
            this.searchTextFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged())
        ).subscribe(() => {
            this.page.set(0);
            this.getTransactions();
        });

        this._destory$.onDestroy(() => filterSubscription.unsubscribe());
    }

    private loadColDefs() {
        this.transactionColDefs.set([
            { headerName: 'Name', field: 'name' },
            {
                headerName: 'Category',
                cellRenderer: CategoryCellRenderer,
                minWidth: 220,
                field: 'category',
                comparator: this.categoryComparator
            },
            {
                headerName: 'Amount',
                field: 'amount',
                valueFormatter: (params) => this.appCurrencyService.formatCurrency(params.value),
                cellClass: 'text-right'
            },
            {
                headerName: 'Date',
                field: 'transactionDate',
                valueFormatter: (params) => this.appDatetimeService.formatDateOnly(params.value)
            },
            {
                headerName: 'Last Updated',
                valueGetter: (params) => params.data?.modifiedAt ?? params.data?.createdAt,
                valueFormatter: (params) => this.appDatetimeService.formatDateTime(params.value)
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
                minWidth: 110,
                sortable: false,
                filter: false,
                resizable: false
            },
        ]);
    }

    private getCategories(): void {
        this.categoryService.getCategoriesWithoutPagination()
            .pipe(take(1))
            .subscribe(response => this.categories.set(response.data));
    }

    private getTransactions() {
        const searchText = this.searchTextFormControl.value;
        const category = this.categoryFormControl.value;
        const type = this.typeFormControl.value;
        const fromDate = this.fromDateFormControl.value;
        const toDate = this.toDateFormControl.value;

        let params = new HttpParams()
            .set('page', this.page())
            .set('size', this.pageSize());
        if (searchText && searchText.trim() !== '') {
            params = params.set('searchText', searchText.trim());
        }
        if (category !== 'ALL') {
            params = params.set('category', category);
        }
        if (type !== 'ALL') {
            params = params.set('income', type);
        }
        if (fromDate) {
            // Start of the selected day (00:00:00.000 local) as a UTC instant.
            params = params.set('from', new Date(`${fromDate}T00:00:00.000`).toISOString());
        }
        if (toDate) {
            // End of the selected day (23:59:59.999 local) as a UTC instant.
            params = params.set('to', new Date(`${toDate}T23:59:59.999`).toISOString());
        }

        this.transactionService.getTransactions(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    if (response.data) {
                        this.transactionRowData.set(response.data.content);
                        this.page.set(response.data.page);
                        this.pageSize.set(response.data.size);
                        this.totalElements.set(response.data.totalElement);
                        this.totalPages.set(response.data.totalPage);
                    }
                }
            });
    }

    onPaginationChange(event: PaginationChange): void {
        this.page.set(event.page);
        this.pageSize.set(event.size);
        this.getTransactions();
    }

    onAdd(): void {
        this.openManageDialog({ mode: 'add', transaction: null });
    }

    onEdit(row: TransactionModel): void {
        this.openManageDialog({ mode: 'edit', transaction: row });
    }

    private openManageDialog(data: TransactionDialogData): void {
        this.dialogService.open<ManageTransaction, TransactionDialogData, TransactionDialogResult>(ManageTransaction, {
            data,
            type: DialogType.Sidepop,
            ariaLabel: data.mode === 'add' ? 'Add transaction' : 'Edit transaction',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.saved) {
                this.getTransactions();
            }
        });
    }

    onDelete(row: TransactionModel): void {
        this.dialogService.open<MessageDialog, MessageDialogData, MessageDialogResult>(MessageDialog, {
            data: {
                title: 'Delete transaction',
                message: `Are you sure you want to delete "${row.name}"?`,
                confirmText: 'Yes, Delete',
                cancelText: 'Cancel',
                kind: MessageDialogKind.CONFIRM,
                theme: MessageDialogTheme.ERROR,
                iconSrc: '/icons/delete_fill.svg',
            },
            width: '350px',
            type: DialogType.Modal,
            closeOnBackdrop: false,
            ariaLabel: 'Delete transaction',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.confirmed) {
                this.transactionService.deleteTransaction(row.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastService.showSuccess('Transaction deleted successfully');
                        this.getTransactions();
                    },
                });
            }
        });
    }

    private toDateInput(date: Date): string {
        const pad = (value: number) => `${value}`.padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    private categoryComparator: SortComparatorFn = (a: any, b: any) => {
        const nameA = a?.name ?? '';
        const nameB = b?.name ?? '';
        return nameA.localeCompare(nameB);
    };

    formatCurrency(amount?: number | null): string {
        return this.appCurrencyService.formatCurrency(amount);
    }

    formatDate(date?: string | Date | null): string {
        return this.appDatetimeService.formatDateTime(date);
    }

    formatDateOnly(date?: string | null): string {
        return date ? this.appDatetimeService.formatDateOnly(date) : '';
    }
}
