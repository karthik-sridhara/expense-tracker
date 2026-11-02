import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { ToastService } from '../../../common/component/toast/toast-service';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { AppSelect } from '../../../common/ui/select';
import { Textarea } from '../../../common/ui/textarea';
import { RecurringType } from '../../../common/enum/recurring-payment';
import { MONTHS, WEEK_DAYS } from '../../../common/const/recurring-payment.const';
import { Category } from '../../../common/interface/category/category';
import {
    RecurringPaymentDialogData,
    RecurringPaymentDialogResult,
} from '../../../common/interface/recurring-payment/recurring-payment-dialog';
import { RecurringPaymentUpsertRequest } from '../../../common/interface/recurring-payment/recurring-payment-upsert-request';
import { CategoryService } from '../../category/category.service';
import { RecurringPaymentService } from '../recurring-payment.service';
import { AMOUNT_PATTERN } from '../../../common/const/app.const';

interface Option {
    label: string;
    value: number;
}


@Component({
    imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect, Textarea],
    selector: 'app-manage-recurring-payment',
    templateUrl: './manage-recurring-payment.html',
    host: {
        class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
    },
})
export class ManageRecurringPayment implements OnInit {
    readonly data = inject(DIALOG_DATA) as RecurringPaymentDialogData;
    private readonly destroyRef = inject(DestroyRef);

    readonly nameControl!: FormControl<string>;
    readonly descriptionControl!: FormControl<string>;
    readonly recurringControl!: FormControl<RecurringType | null>;
    readonly dayControl!: FormControl<number | null>;
    readonly monthControl!: FormControl<number | null>;
    readonly amountControl!: FormControl<number | string | null>;
    readonly categoryControl!: FormControl<number | null>;
    readonly endDateControl!: FormControl<string | null>;
    readonly recurringPaymentForm!: FormGroup;

    readonly RecurringType = RecurringType;
    readonly recurringTypes = Object.values(RecurringType);
    readonly monthOptions: Option[] = MONTHS.map((label, index) => ({ label, value: index + 1 }));

    categories = signal<Category[]>([]);
    recurringType = signal<RecurringType | null>(null);
    dayOptions = signal<Option[]>([]);

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<RecurringPaymentDialogResult>,
        private recurringPaymentService: RecurringPaymentService,
        private categoryService: CategoryService,
        private toastService: ToastService,
    ) {
        const payment = this.data.recurringPayment;

        this.nameControl = this.formBuilder.nonNullable.control(payment?.name ?? '', [
            Validators.required,
            Validators.maxLength(100),
        ]);
        this.descriptionControl = this.formBuilder.nonNullable.control(payment?.description ?? '', [
            Validators.maxLength(300),
        ]);
        this.recurringControl = this.formBuilder.control<RecurringType | null>(payment?.recurring ?? null, [
            Validators.required,
        ]);
        this.dayControl = this.formBuilder.control<number | null>(payment?.day ?? null);
        this.monthControl = this.formBuilder.control<number | null>(payment?.month ?? null);
        this.amountControl = this.formBuilder.control<number | string | null>(payment?.amount ?? null, [
            Validators.required,
            Validators.min(0.01),
            Validators.pattern(AMOUNT_PATTERN),
        ]);
        this.categoryControl = this.formBuilder.control<number | null>(payment?.category?.id ?? null, [
            Validators.required,
        ]);
        this.endDateControl = this.formBuilder.control<string | null>(payment?.endDate ?? null);

        this.recurringPaymentForm = this.formBuilder.group({
            name: this.nameControl,
            description: this.descriptionControl,
            recurring: this.recurringControl,
            day: this.dayControl,
            month: this.monthControl,
            amount: this.amountControl,
            category: this.categoryControl,
            endDate: this.endDateControl,
        });

        this.applyRecurringRules(this.recurringControl.value, false);

        this.recurringControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(type => this.applyRecurringRules(type, true));

        this.monthControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (this.recurringControl.value === RecurringType.YEARLY) {
                    this.applyYearlyDayRules();
                }
            });
    }

    ngOnInit(): void {
        this.getCategories();
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.recurringPaymentForm.invalid) {
            this.recurringPaymentForm.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'add') {
            this.add();
        } else {
            this.edit();
        }
    }

    /**
     * Adjusts day/month controls based on the recurring type:
     * - DAILY: day fixed to 1 (disabled), no month
     * - WEEKLY: day 1-7 (Monday-Sunday), no month
     * - MONTHLY: day 1-31, no month
     * - YEARLY: month 1-12 and day 1-(days in selected month)
     */
    private applyRecurringRules(type: RecurringType | null, resetValues: boolean): void {
        this.recurringType.set(type);

        if (resetValues) {
            this.dayControl.setValue(null, { emitEvent: false });
            this.monthControl.setValue(null, { emitEvent: false });
        }

        switch (type) {
            case RecurringType.DAILY:
                this.dayControl.setValue(1, { emitEvent: false });
                this.configureDay([], [], false);
                this.configureMonth(false);
                break;
            case RecurringType.WEEKLY:
                this.configureDay(
                    [Validators.required, Validators.min(1), Validators.max(7)],
                    WEEK_DAYS.map((label, index) => ({ label, value: index + 1 })),
                    true,
                );
                this.configureMonth(false);
                break;
            case RecurringType.MONTHLY:
                this.configureDay(
                    [Validators.required, Validators.min(1), Validators.max(31)],
                    this.buildDayRange(31),
                    true,
                );
                this.configureMonth(false);
                break;
            case RecurringType.YEARLY:
                this.configureMonth(true);
                this.applyYearlyDayRules();
                break;
            default:
                this.configureDay([], [], false);
                this.configureMonth(false);
        }
    }

    private applyYearlyDayRules(): void {
        const maxDay = this.getDaysInMonth(this.monthControl.value);
        if ((this.dayControl.value ?? 0) > maxDay) {
            this.dayControl.setValue(null, { emitEvent: false });
        }
        this.configureDay(
            [Validators.required, Validators.min(1), Validators.max(maxDay)],
            this.buildDayRange(maxDay),
            true,
        );
    }

    private configureDay(validators: ValidatorFn[], options: Option[], enabled: boolean): void {
        this.dayOptions.set(options);
        this.dayControl.setValidators(validators);
        if (enabled) {
            this.dayControl.enable({ emitEvent: false });
        } else {
            this.dayControl.disable({ emitEvent: false });
        }
        this.dayControl.updateValueAndValidity({ emitEvent: false });
    }

    private configureMonth(enabled: boolean): void {
        if (enabled) {
            this.monthControl.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
            this.monthControl.enable({ emitEvent: false });
        } else {
            this.monthControl.clearValidators();
            this.monthControl.setValue(null, { emitEvent: false });
            this.monthControl.disable({ emitEvent: false });
        }
        this.monthControl.updateValueAndValidity({ emitEvent: false });
    }

    private buildDayRange(max: number): Option[] {
        return Array.from({ length: max }, (_, index) => ({ label: `${index + 1}`, value: index + 1 }));
    }

    private getDaysInMonth(month: number | null): number {
        if (!month) {
            return 31;
        }
        // Leap year so February allows the 29th.
        return new Date(2024, month, 0).getDate();
    }

    private getCategories(): void {
        const params = new HttpParams()
            .set('isIncome', false)
            .set('isActive', true);

        this.categoryService.getCategoriesWithoutPagination(params)
            .pipe(take(1))
            .subscribe(response => this.categories.set(response.data));
    }

    private buildRequest(): RecurringPaymentUpsertRequest {
        const value = this.recurringPaymentForm.getRawValue();
        const description = value.description?.trim();
        return {
            name: value.name.trim(),
            description: description ? description : null,
            recurring: value.recurring,
            day: value.recurring === RecurringType.DAILY ? 1 : value.day,
            month: value.recurring === RecurringType.YEARLY ? value.month : null,
            amount: Number(value.amount),
            category: value.category,
            endDate: value.endDate ? value.endDate : null,
        };
    }

    private add(): void {
        this.recurringPaymentService.addRecurringPayment(this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Recurring payment added successfully');
            },
        });
    }

    private edit(): void {
        const id = this.data.recurringPayment!.id;
        this.recurringPaymentService.editRecurringPayment(id, this.buildRequest()).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Recurring payment updated successfully');
            },
        });
    }
}
