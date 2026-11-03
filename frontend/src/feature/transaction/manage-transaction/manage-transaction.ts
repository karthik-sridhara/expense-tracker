import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { ToastService } from '../../../common/component/toast/toast-service';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { AppSelect } from '../../../common/ui/select';
import { Textarea } from '../../../common/ui/textarea';
import { Category } from '../../../common/interface/category/category';
import {
    TransactionDialogData,
    TransactionDialogResult,
} from '../../../common/interface/transaction/transaction-dialog';
import { TransactionUpsertRequest } from '../../../common/interface/transaction/transaction-upsert-request';
import { CategoryService } from '../../category/category.service';
import { TransactionService } from '../transaction.service';
import { AMOUNT_PATTERN } from '../../../common/const/app.const';

@Component({
    imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect, Textarea],
    selector: 'app-manage-transaction',
    templateUrl: './manage-transaction.html',
    host: {
        class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
    },
})
export class ManageTransaction implements OnInit {
    readonly data = inject(DIALOG_DATA) as TransactionDialogData;

    readonly nameControl!: FormControl<string>;
    readonly descriptionControl!: FormControl<string>;
    readonly amountControl!: FormControl<number | string | null>;
    readonly categoryControl!: FormControl<number | null>;
    readonly transactionDateControl!: FormControl<string | null>;
    readonly transactionForm!: FormGroup;
    readonly maxDateTime = this.toLocalDateTimeInput(new Date());

    categories = signal<Category[]>([]);

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<TransactionDialogResult>,
        private transactionService: TransactionService,
        private categoryService: CategoryService,
        private toastService: ToastService,
    ) {
        const transaction = this.data.transaction;

        this.nameControl = this.formBuilder.nonNullable.control(transaction?.name ?? '', [
            Validators.required,
            Validators.maxLength(100),
        ]);
        this.descriptionControl = this.formBuilder.nonNullable.control(transaction?.description ?? '', [
            Validators.maxLength(300),
        ]);
        this.amountControl = this.formBuilder.control<number | string | null>(transaction?.amount ?? null, [
            Validators.required,
            Validators.min(0.01),
            Validators.pattern(AMOUNT_PATTERN),
        ]);
        this.categoryControl = this.formBuilder.control<number | null>(transaction?.category?.id ?? null, [
            Validators.required,
        ]);
        this.transactionDateControl = this.formBuilder.control<string | null>(
            this.toLocalDateTimeInput(transaction?.transactionDate ? new Date(transaction.transactionDate) : new Date()),
            [Validators.required, this.notFutureDateValidator],
        );

        this.transactionForm = this.formBuilder.group({
            name: this.nameControl,
            description: this.descriptionControl,
            amount: this.amountControl,
            category: this.categoryControl,
            transactionDate: this.transactionDateControl,
        });
    }

    ngOnInit(): void {
        this.getCategories();
if (this.data.mode === 'edit' && this.data.transaction) {
            this.getTransaction(this.data.transaction.id);
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.transactionForm.invalid) {
            this.transactionForm.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'add') {
            this.add();
        } else {
            this.edit();
        }
    }

    private notFutureDateValidator(control: AbstractControl<string | null>): ValidationErrors | null {
        if (!control.value) {
            return null;
        }
        return new Date(control.value).getTime() > Date.now() ? { futureDate: true } : null;
    }

    /** Formats a Date as `yyyy-MM-ddTHH:mm` in local time for a datetime-local input. */
    private toLocalDateTimeInput(date: Date): string {
        const pad = (value: number) => `${value}`.padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
            + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    private getCategories(): void {
        const params = new HttpParams().set('isActive', true);

        this.categoryService.getCategoriesWithoutPagination(params)
            .pipe(take(1))
            .subscribe(response => this.categories.set(response.data));
    }

    private getTransaction(id: number): void {
        this.transactionService.getTransactionById(id)
            .pipe(take(1))
            .subscribe(response => {
                const transaction = response.data;
                if (!transaction) {
                    return;
                }
                this.transactionForm.patchValue({
                    name: transaction.name,
                    description: transaction.description ?? '',
                    amount: transaction.amount,
                    category: transaction.category?.id ?? null,
                    transactionDate: this.toLocalDateTimeInput(new Date(transaction.transactionDate)),
                });
            });
    }

    private buildRequest(): TransactionUpsertRequest {
        const value = this.transactionForm.getRawValue();
        const description = value.description?.trim();
        return {
            name: value.name.trim(),
            description: description ? description : null,
            amount: Number(value.amount),
            category: value.category,
            transactionDate: new Date(value.transactionDate).toISOString(),
        };
    }

    private add(): void {
        this.transactionService.addTransaction(this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Transaction added successfully');
            },
        });
    }

    private edit(): void {
        const id = this.data.transaction!.id;
        this.transactionService.editTransaction(id, this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Transaction updated successfully');
            },
        });
    }
}
