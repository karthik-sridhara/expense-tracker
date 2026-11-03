import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { PaymentDialogData, PaymentDialogResult } from '../../../common/interface/payment/payment-dialog';
import { PaymentUpsertRequest } from '../../../common/interface/payment/payment-upsert-request';
import { CategoryService } from '../../category/category.service';
import { PaymentService } from '../payment.service';
import { AMOUNT_PATTERN } from '../../../common/const/app.const';

@Component({
    imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect, Textarea],
    selector: 'app-manage-payment',
    templateUrl: './manage-payment.html',
    host: {
        class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
    },
})
export class ManagePayment implements OnInit {
    readonly data = inject(DIALOG_DATA) as PaymentDialogData;

    readonly nameControl!: FormControl<string>;
    readonly descriptionControl!: FormControl<string>;
    readonly amountControl!: FormControl<number | string | null>;
    readonly categoryControl!: FormControl<number | null>;
    readonly dueDateControl!: FormControl<string | null>;
    readonly paymentForm!: FormGroup;

    categories = signal<Category[]>([]);

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<PaymentDialogResult>,
        private paymentService: PaymentService,
        private categoryService: CategoryService,
        private toastService: ToastService,
    ) {
        const payment = this.data.payment;

        this.nameControl = this.formBuilder.nonNullable.control(payment?.name ?? '', [
            Validators.required,
            Validators.maxLength(100),
        ]);
        this.descriptionControl = this.formBuilder.nonNullable.control(payment?.description ?? '', [
            Validators.maxLength(300),
        ]);
        this.amountControl = this.formBuilder.control<number | string | null>(payment?.amount ?? null, [
            Validators.required,
            Validators.min(0.01),
            Validators.pattern(AMOUNT_PATTERN),
        ]);
        this.categoryControl = this.formBuilder.control<number | null>(payment?.category?.id ?? null, [
            Validators.required,
        ]);
        this.dueDateControl = this.formBuilder.control<string | null>(payment?.dueDate ?? null, [
            Validators.required,
        ]);

        this.paymentForm = this.formBuilder.group({
            name: this.nameControl,
            description: this.descriptionControl,
            amount: this.amountControl,
            category: this.categoryControl,
            dueDate: this.dueDateControl,
        });
    }

    ngOnInit(): void {
        this.getCategories();
        if (this.data.mode === 'edit' && this.data.payment) {
            this.getPayment(this.data.payment.id);
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.paymentForm.invalid) {
            this.paymentForm.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'add') {
            this.add();
        } else {
            this.edit();
        }
    }

    private getCategories(): void {
        const params = new HttpParams()
            .set('isIncome', false)
            .set('isActive', true);

        this.categoryService.getCategoriesWithoutPagination(params)
            .pipe(take(1))
            .subscribe(response => this.categories.set(response.data));
    }

    private getPayment(id: number): void {
        this.paymentService.getPaymentById(id)
            .pipe(take(1))
            .subscribe(response => {
                const payment = response.data;
                if (!payment) {
                    return;
                }
                this.paymentForm.patchValue({
                    name: payment.name,
                    description: payment.description ?? '',
                    amount: payment.amount,
                    category: payment.categoryId ?? null,
                    dueDate: payment.dueDate,
                });
            });
    }

    private buildRequest(): PaymentUpsertRequest {
        const value = this.paymentForm.getRawValue();
        const description = value.description?.trim();
        return {
            name: value.name.trim(),
            description: description ? description : null,
            amount: Number(value.amount),
            categoryId: value.category,
            dueDate: value.dueDate,
        };
    }

    private add(): void {
        this.paymentService.addPayment(this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Payment added successfully');
            },
        });
    }

    private edit(): void {
        const id = this.data.payment!.id;
        this.paymentService.editPayment(id, this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Payment updated successfully');
            },
        });
    }
}
