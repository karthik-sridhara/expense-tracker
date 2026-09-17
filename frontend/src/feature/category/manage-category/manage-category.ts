import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '../../../common/interface/app/app-dialog';
import { DialogRef } from '../../../common/component/app-dialog/app-dialog-ref';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryUpsertRequest } from '../../../common/interface/category/category-upsert';
import { CategoryDialogData, CategoryDialogResult } from '../../../common/interface/category/category-dialog';
import { AppFormControl } from "../../../common/ui/form-control";
import { Input } from "../../../common/ui/input";
import { Button } from '../../../common/ui/button';
import { CheckBox } from '../../../common/ui/check-box';
import { Textarea } from '../../../common/ui/textarea';
import { CategoryService } from '../category.service';
import { AppSessionService } from '../../../common/service/app-session';
import { Role } from '../../../common/enum/role';

@Component({
  imports: [AppFormControl, Input , ReactiveFormsModule,Button,CheckBox, Textarea],
  selector: 'app-manage-category',
  styleUrl: './manage-category.css',
  templateUrl: './manage-category.html',
  host: {
    class: 'flex h-full w-full flex-col text-slate-900 dark:text-white'
  }
})
export class ManageCategory {

  readonly data = inject(DIALOG_DATA) as CategoryDialogData;

  readonly nameControl!: FormControl<string>;
  readonly descriptionControl!: FormControl<string>;
  readonly iconControl!: FormControl<string>;
  readonly isIncomeControl!: FormControl<boolean>;
  readonly isUniversalControl!: FormControl<boolean>;
  readonly isActiveControl!: FormControl<boolean>;
  readonly categoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: DialogRef<CategoryDialogResult>,
    private categoryService: CategoryService,
    private appSessionService:AppSessionService
  ) {
    const category = this.data.category;
    const user = this.appSessionService.getUser();

    this.nameControl = this.formBuilder.nonNullable.control(
      category?.name ?? '',
      [
        Validators.required,
        Validators.maxLength(50),
      ],
    );

    this.descriptionControl = this.formBuilder.nonNullable.control(
      category?.description ?? '',
      [
        Validators.maxLength(300),
      ],
    );

    this.iconControl = this.formBuilder.nonNullable.control(
      category?.icon ?? '',
      [
        Validators.maxLength(50),
      ],
    );

    this.isIncomeControl = this.formBuilder.nonNullable.control(
      category?.isIncome ?? false,
      [
        Validators.required,
      ],
    );

    this.isUniversalControl = this.formBuilder.nonNullable.control(
      category?.isUniversal ?? false,
      [
        Validators.required,
      ],
    );
  
    this.isActiveControl = this.formBuilder.nonNullable.control(
      category?.isActive ?? true,
      [
        Validators.required,
      ],
    );


    if(this.data.mode === 'add') {
      this.isActiveControl.setValue(true);
      this.isActiveControl.disable();
    }
    if(user!.role === Role.ADMIN) {
      this.isUniversalControl.setValue(true);
      this.isUniversalControl.disable();
    }else if(user!.role === Role.USER) {
      this.isUniversalControl.setValue(false);
      this.isUniversalControl.disable();
    }

    this.categoryForm = this.formBuilder.group({
      name: this.nameControl,
      description: this.descriptionControl,
      icon: this.iconControl,
      isIncome: this.isIncomeControl,
      isUniversal: this.isUniversalControl,
      isActive: this.isActiveControl,
    });
    if(this.data.mode === 'edit') {
      this.categoryForm.patchValue(this.data.category!);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if(this.data.mode === 'add') {
      this.add();
    }else if(this.data.mode === 'edit') {
      this.edit();
    }
  }

  private add(): void {
    const value: CategoryUpsertRequest =
      this.categoryForm.getRawValue();
    this.categoryService.addCategory(value).subscribe({
      next: (response) => {
        this.dialogRef.close({
          saved: true,
        });
      }
    });
  }

  private edit(): void {
    const value: CategoryUpsertRequest =
      this.categoryForm.getRawValue();
    const categoryId = this.data.category!.id;
    this.categoryService.editCategory(categoryId, value).subscribe({
      next: (response) => {
        this.dialogRef.close({
          saved: true,
        });
      }
    });
  }

}
