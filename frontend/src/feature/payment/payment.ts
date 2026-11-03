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
import { PaymentForListing as PaymentModel } from '../../common/interface/payment/payment';
import { AppDatetimeService } from '../../common/service/app-datetime';
import { AppCurrencyService } from '../../common/service/app-currency';
import { GoogleIconService } from '../../common/service/google-icon.service';
import { CategoryService } from '../category/category.service';
import { CategoryCellRenderer } from '../category/category-cellrender';
import { PaymentService } from './payment.service';
import { UiMenu } from '../../common/ui/menu';
import { ActionsCellRenderer, TableAction } from '../../common/component/app-table/cell-renderer/actions';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { MessageDialogData, MessageDialogResult } from '../../common/interface/app/app-dialog';
import { ToastService } from '../../common/component/toast/toast-service';
import { Button } from '../../common/ui/button';
import { PaymentDialogData, PaymentDialogResult } from '../../common/interface/payment/payment-dialog';
import { ManagePayment } from './manage-payment/manage-payment';

@Component({
    imports: [Input, AppSelect, AppTable, ReactiveFormsModule, GoogleIcon, AppPagination, UiMenu, Button],
    selector: 'app-payment',
    styleUrl: './payment.css',
    templateUrl: './payment.html',
    host: {
        class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }
})
export class Payment implements OnInit {
    categories = signal<Category[]>([]);

    paymentColDefs = signal<ColDef[]>([]);
    paymentRowData = signal<PaymentModel[]>([]);
    page = signal(0);
    pageSize = signal(20);
    totalElements = signal(0);
    totalPages = signal(0);

    searchTextFormControl!: FormControl<string>;
    categoryFormControl!: FormControl<string>;
    completedFormControl!: FormControl<string>;
    dueFromFormControl!: FormControl<string>;
    dueToFormControl!: FormControl<string>;

    paymentMenuItems = [
        {
            icon: '/icons/edit_fill.svg',
            text: 'Edit',
            onClick: (data: unknown) => this.onEdit(data as PaymentModel)
        },
        {
            icon: '/icons/delete_fill.svg',
            text: 'Delete',
            onClick: (data: unknown) => this.onDelete(data as PaymentModel)
        },
    ];

    constructor(
        private paymentService: PaymentService,
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
    }

    private createFilterFormControls() {
        this.searchTextFormControl = new FormControl('', { nonNullable: true });
        this.categoryFormControl = new FormControl('ALL', { nonNullable: true });
        this.completedFormControl = new FormControl('false', { nonNullable: true });
        this.dueFromFormControl = new FormControl('', { nonNullable: true });
        this.dueToFormControl = new FormControl('', { nonNullable: true });

        const filterSubscription = merge(
            this.categoryFormControl.valueChanges,
            this.completedFormControl.valueChanges,
            this.dueFromFormControl.valueChanges,
            this.dueToFormControl.valueChanges,
            this.searchTextFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged())
        ).subscribe(() => {
            this.page.set(0);
            this.getPayments();
        });

        this._destory$.onDestroy(() => filterSubscription.unsubscribe());
    }

    private loadColDefs() {
        this.paymentColDefs.set([
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
                headerName: 'Due Date',
                field: 'dueDate',
                valueFormatter: (params) => this.appDatetimeService.formatDateOnly(params.value)
            },
            {
                headerName: 'Status',
                field: 'completed',
                cellDataType: 'text',
                valueFormatter: (params) => params.value ? 'Completed' : 'Pending'
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
        .subscribe(response => {
            this.categories.set(response.data)
            this.getPayments();
        });
    }

    private getPayments() {
        if (this.categories().length === 0) {
            return;
        }
        const searchText = this.searchTextFormControl.value.trim();
        const category = this.categoryFormControl.value;
        const completed = this.completedFormControl.value;
        const dueFrom = this.dueFromFormControl.value;
        const dueTo = this.dueToFormControl.value;

        let params = new HttpParams()
            .set('page', this.page())
            .set('size', this.pageSize());
        if (searchText) {
            params = params.set('searchText', searchText);
        }
        if (category !== 'ALL') {
            params = params.set('categoryId', category);
        }
        if (completed !== 'ALL') {
            params = params.set('completed', completed);
        }
        if (dueFrom) {
            params = params.set('dueFrom', dueFrom);
        }
        if (dueTo) {
            params = params.set('dueTo', dueTo);
        }

        this.paymentService.getPayments(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    if (response.data) {

                        const categoryMap = new Map(this.categories().map(c => [c.id, c]));
                        const payments = response.data.content.map(payment => ({
                            ...payment,
                            category: categoryMap.get(payment.categoryId) ?? null,
                        }));

                        this.paymentRowData.set(payments);
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
        this.getPayments();
    }

    onAdd(): void {
        this.openManageDialog({ mode: 'add', payment: null });
    }

    onEdit(row: PaymentModel): void {
        this.openManageDialog({ mode: 'edit', payment: row });
    }

    private openManageDialog(data: PaymentDialogData): void {
        this.dialogService.open<ManagePayment, PaymentDialogData, PaymentDialogResult>(ManagePayment, {
            data,
            type: DialogType.Sidepop,
            ariaLabel: data.mode === 'add' ? 'Add payment' : 'Edit payment',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.saved) {
                this.getPayments();
            }
        });
    }

    onDelete(row: PaymentModel): void {
        this.dialogService.open<MessageDialog, MessageDialogData, MessageDialogResult>(MessageDialog, {
            data: {
                title: 'Delete payment',
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
            ariaLabel: 'Delete payment',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.confirmed) {
                this.paymentService.deletePayment(row.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastService.showSuccess('Payment deleted successfully');
                        this.getPayments();
                    },
                });
            }
        });
    }

    /** Returns a non-negative number, or null when the input is empty or invalid. */
    private toAmount(value: string | number | null): number | null {
        if (value === null || `${value}`.trim() === '') {
            return null;
        }
        const amount = Number(value);
        return Number.isFinite(amount) && amount >= 0 ? amount : null;
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
