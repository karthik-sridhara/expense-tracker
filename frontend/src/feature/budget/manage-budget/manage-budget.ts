import { Component, inject, OnInit, signal } from '@angular/core';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BudgetDialogData, BudgetDialogResult } from '../../../common/interface/budget/budget-dialog';
import { AppFormControl } from '../../../common/ui/form-control';
import { Input } from '../../../common/ui/input';
import { Button } from '../../../common/ui/button';
import { AppSelect } from '../../../common/ui/select';
import { BudgetService } from '../budget.service';
import { CategoryService } from '../../category/category.service';
import { BudgetType } from '../../../common/enum/budget';
import { Category } from '../../../common/interface/category/category';
import { ToastService } from '../../../common/component/toast/toast-service';
import { take } from 'rxjs';
import { Budget } from '../../../common/interface/budget/budget';
import { BudgetUpsertRequest } from '../../../common/interface/budget/budget-upsert-request';

@Component({
    imports: [AppFormControl, Input, ReactiveFormsModule, Button, AppSelect],
    selector: 'app-manage-budget',
    templateUrl: './manage-budget.html',
    host: {
        class: 'flex h-full w-full flex-col text-slate-900 dark:text-white',
    },
})
export class ManageBudget implements OnInit {
    readonly data = inject(DIALOG_DATA) as BudgetDialogData;

    readonly amountControl!: FormControl<number | null>;
    readonly durationTypeControl!: FormControl<string | null>;
    readonly categoryControl!: FormControl<number | null>;
    readonly budgetForm!: FormGroup;

    categories = signal<Category[]>([]);
    durationTypes: { label: string; value: string }[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: DialogRef<BudgetDialogResult>,
        private budgetService: BudgetService,
        private categoryService: CategoryService,
        private toastService: ToastService,
    ) {
        const budget: Budget | null = this.data.budget;

        for (const [label] of Object.entries(BudgetType)) {
            this.durationTypes.push({ label, value: label });
        }

        this.amountControl = this.formBuilder.control(budget?.amount ?? null, [
            Validators.required,
            Validators.min(1),
        ]);

        this.durationTypeControl = this.formBuilder.control(budget?.durationType ?? null, [
            Validators.required,
        ]);

        this.categoryControl = this.formBuilder.control(budget?.category?.id ?? null, [
            Validators.required,
        ]);

        this.budgetForm = this.formBuilder.group({
            amount: this.amountControl,
            durationType: this.durationTypeControl,
            category: this.categoryControl,
        });
    }

    ngOnInit(): void {
        this.categoryService
            .getCategories()
            .pipe(take(1))
            .subscribe((response) => this.categories.set(response.data));
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.budgetForm.invalid) {
            this.budgetForm.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'add') {
            this.add();
        } else {
            this.edit();
        }
    }

    private add(): void {
        const value: BudgetUpsertRequest = this.budgetForm.getRawValue();
        this.budgetService.addBudget(value).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Budget added successfully');
            },
        });
    }

    private edit(): void {
        const value: BudgetUpsertRequest = this.budgetForm.getRawValue();
        const budgetId = this.data.budget!.id;
        this.budgetService.editBudget(budgetId, value).subscribe({
            next: () => {
                this.dialogRef.close({ saved: true });
                this.toastService.showSuccess('Budget updated successfully');
            },
        });
    }
}