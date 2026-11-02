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
import { RecurringType } from '../../common/enum/recurring-payment';
import { Category } from '../../common/interface/category/category';
import { RecurringPayment as RecurringPaymentModel } from '../../common/interface/recurring-payment/recurring-payment';
import { AppDatetimeService } from '../../common/service/app-datetime';
import { AppCurrencyService } from '../../common/service/app-currency';
import { GoogleIconService } from '../../common/service/google-icon.service';
import { CategoryService } from '../category/category.service';
import { CategoryCellRenderer } from '../category/category-cellrender';
import { RecurringPaymentService } from './recurring-payment.service';
import { MONTHS, WEEK_DAYS } from '../../common/const/recurring-payment.const';
import { Button } from '../../common/ui/button';
import { UiMenu } from '../../common/ui/menu';
import { ActionsCellRenderer, TableAction } from '../../common/component/app-table/cell-renderer/actions';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { MessageDialogData, MessageDialogResult } from '../../common/interface/app/app-dialog';
import { ToastService } from '../../common/component/toast/toast-service';
import {
    RecurringPaymentDialogData,
    RecurringPaymentDialogResult,
} from '../../common/interface/recurring-payment/recurring-payment-dialog';
import { ManageRecurringPayment } from './manage-recurring-payment/manage-recurring-payment';

@Component({
    imports: [Input, AppSelect, AppTable, ReactiveFormsModule, GoogleIcon, AppPagination, Button, UiMenu],
    selector: 'app-recurring-payment',
    styleUrl: './recurring-payment.css',
    templateUrl: './recurring-payment.html',
    host: {
        class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }
})
export class RecurringPayment implements OnInit {
    recurringTypes!: { label: string, value: string }[];
    categories = signal<Category[]>([]);

    recurringPaymentColDefs = signal<ColDef[]>([]);
    recurringPaymentRowData = signal<RecurringPaymentModel[]>([]);
    page = signal(0);
    pageSize = signal(10);
    totalElements = signal(0);
    totalPages = signal(0);

    searchTextFormControl!: FormControl<string>;
    categoryFormControl!: FormControl<string>;
    recurringFormControl!: FormControl<string>;
    activeFormControl!: FormControl<string>;

    recurringPaymentMenuItems = [
        {
            icon: '/icons/edit_fill.svg',
            text: 'Edit',
            onClick: (data: unknown) => this.onEdit(data as RecurringPaymentModel)
        },
        {
            icon: '/icons/delete_fill.svg',
            text: 'Delete',
            onClick: (data: unknown) => this.onDelete(data as RecurringPaymentModel)
        },
    ];

    constructor(
        private recurringPaymentService: RecurringPaymentService,
        private categoryService: CategoryService,
        private dialogService: DialogService,
        private toastService: ToastService,
        private appDatetimeService: AppDatetimeService,
        private appCurrencyService: AppCurrencyService,
        private _destory$: DestroyRef,
        protected googleIconService: GoogleIconService
    ) {
        this.loadRecurringTypes();
        this.loadColDefs();
        this.createFilterFormControls();
    }

    ngOnInit(): void {
        this.getCategories();
        this.getRecurringPayments();
    }

    private createFilterFormControls() {
        this.categoryFormControl = new FormControl('ALL', { nonNullable: true });
        this.recurringFormControl = new FormControl('ALL', { nonNullable: true });
        this.activeFormControl = new FormControl('ALL', { nonNullable: true });
        const selectSubscription = merge(
            this.categoryFormControl.valueChanges,
            this.recurringFormControl.valueChanges,
            this.activeFormControl.valueChanges
        ).subscribe(() => {
            this.page.set(0);
            this.getRecurringPayments();
        });

        this.searchTextFormControl = new FormControl('', { nonNullable: true });
        const searchTextSubscription = this.searchTextFormControl.valueChanges
            .pipe(
                debounceTime(700),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.page.set(0);
                this.getRecurringPayments();
            });

        this._destory$.onDestroy(() => {
            selectSubscription.unsubscribe();
            searchTextSubscription.unsubscribe();
        });
    }

    private loadRecurringTypes() {
        this.recurringTypes = [];
        for (const [label, value] of Object.entries(RecurringType)) {
            this.recurringTypes.push({ label, value });
        }
    }

    private loadColDefs() {
        const colDefs: ColDef[] = [
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
            { headerName: 'Recurring', field: 'recurring' },
            {
                headerName: 'Schedule',
                valueGetter: (params) => this.getSchedule(params.data)
            },
            {
                headerName: 'End Date',
                field: 'endDate',
                valueFormatter: (params) => this.formatEndDate(params.value)
            },
            {
                headerName: 'Status',
                field: 'active',
                cellDataType: 'text',
                valueFormatter: (params) => params.value ? 'Active' : 'Inactive'
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
            }
        ];
        this.recurringPaymentColDefs.set(colDefs);
    }

    private getCategories(): void {
        const params = new HttpParams()
            .set('isIncome', false);

        this.categoryService.getCategoriesWithoutPagination(params)
            .pipe(take(1))
            .subscribe(response => this.categories.set(response.data));
    }

    private getRecurringPayments() {
        const searchText = this.searchTextFormControl.value;
        const category = this.categoryFormControl.value;
        const recurring = this.recurringFormControl.value;
        const active = this.activeFormControl.value;

        let params = new HttpParams()
            .set('page', this.page())
            .set('size', this.pageSize());
        if (searchText && searchText.trim() !== '') {
            params = params.set('searchText', searchText.trim());
        }
        if (category !== 'ALL') {
            params = params.set('category', category);
        }
        if (recurring !== 'ALL') {
            params = params.set('recurring', recurring);
        }
        if (active !== 'ALL') {
            params = params.set('active', active);
        }

        this.recurringPaymentService.getRecurringPayments(params)
            .pipe(take(1))
            .subscribe({
                next: (response) => {
                    if (response.data) {
                        this.recurringPaymentRowData.set(response.data.content);
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
        this.getRecurringPayments();
    }

    onAdd(): void {
        this.openManageDialog({ mode: 'add', recurringPayment: null });
    }

    onEdit(row: RecurringPaymentModel): void {
        this.openManageDialog({ mode: 'edit', recurringPayment: row });
    }

    onDelete(row: RecurringPaymentModel): void {
        this.dialogService.open<MessageDialog, MessageDialogData, MessageDialogResult>(MessageDialog, {
            data: {
                title: 'Delete recurring payment',
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
            ariaLabel: 'Delete recurring payment',
        }).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.confirmed) {
                this.recurringPaymentService.deleteRecurringPayment(row.id).pipe(take(1)).subscribe({
                    next: () => {
                        this.toastService.showSuccess('Recurring payment deleted successfully');
                        this.getRecurringPayments();
                    },
                });
            }
        });
    }

    private openManageDialog(data: RecurringPaymentDialogData): void {
        this.dialogService.open
        <ManageRecurringPayment, RecurringPaymentDialogData, RecurringPaymentDialogResult>(ManageRecurringPayment,
            {
                data,
                type: DialogType.Sidepop,
                ariaLabel: data.mode === 'add' ? 'Add recurring payment' : 'Edit recurring payment',
            }
        ).afterClosed().pipe(take(1)).subscribe((result) => {
            if (result?.saved) {
                this.getRecurringPayments();
            }
        });
    }

    private categoryComparator: SortComparatorFn = (a: any, b: any) => {
        const nameA = a?.name ?? '';
        const nameB = b?.name ?? '';
        return nameA.localeCompare(nameB);
    };

    getSchedule(row?: RecurringPaymentModel | null): string {
        if (!row) {
            return '';
        }
        switch (row.recurring) {
            case RecurringType.DAILY:
                return 'Every day';
            case RecurringType.WEEKLY:
                return row.day ? `Every ${WEEK_DAYS[row.day - 1] ?? ''}` : '';
            case RecurringType.MONTHLY:
                return row.day ? `Day ${row.day} of every month` : '';
            case RecurringType.YEARLY:
                return row.day && row.month ? `Every ${row.day} ${MONTHS[row.month - 1] ?? ''}` : '';
            default:
                return '';
        }
    }

    formatCurrency(amount?: number | null): string {
        return this.appCurrencyService.formatCurrency(amount);
    }

    formatDate(date?: string | Date | null): string {
        return this.appDatetimeService.formatDateTime(date);
    }

    formatEndDate(date?: string | null): string {
        return date ? this.appDatetimeService.formatDateOnly(date) : 'No end date';
    }
}
