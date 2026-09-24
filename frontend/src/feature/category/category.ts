import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { SvgIcon } from "../../common/ui/svg-icon";
import { CategoryService } from './category.service';
import { debounceTime, distinctUntilChanged, merge, take } from 'rxjs';
import { UiMenu, UiMenuItem } from "../../common/ui/menu";
import { Category as CategoryModel } from "../../common/interface/category/category";
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { ManageCategory } from './manage-category/manage-category';

import { CategoryDialogData, CategoryDialogResult } from '../../common/interface/category/category-dialog';
import { AppSessionService } from '../../common/service/app-session';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { MessageDialogData, MessageDialogResult } from '../../common/interface/app/app-dialog';
import { ToastService } from '../../common/component/toast/toast-service';
import { Input } from "../../common/ui/input";
import { Button } from "../../common/ui/button";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { AppSelect } from "../../common/ui/select";

@Component({
  imports: [SvgIcon, UiMenu, Input, Button, ReactiveFormsModule, AppSelect],
  selector: 'app-category',
  styleUrl: './category.css',
  templateUrl: './category.html',
  host:{
    class: 'block h-full  overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
  }
})
export class Category implements OnInit{

  categories = signal<CategoryModel[]>([]); 
  userRole = signal<string>('unknown');

  searchTextFormControl!: FormControl;
  statusFormControl!: FormControl;
  incomeExpenseFormControl!: FormControl;

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private appSessionService:AppSessionService,
    private toastService:ToastService,
    private _destory$: DestroyRef
  ) {
    this.userRole.set(this.appSessionService.getUser()!.role);
    this.createFilterFormControls();
  }

  menuItems:UiMenuItem[] = [
    { 
      icon: '/icons/edit_fill.svg', 
      onClick: (data) => {
        this.openDialog({
          mode: 'edit',
          category: data as CategoryModel,
        });
      } , 
      text: 'Edit' 
    },
    { 
      icon: '/icons/delete_fill.svg', 
      onClick: (data) => {
        this.onDeleteCategory(data as CategoryModel)
      } , 
      text: 'Delete' 
    },
  ];

  ngOnInit(): void {
    this.getCategories();
  }

  private createFilterFormControls() {
    this.searchTextFormControl = new FormControl("");
    this.incomeExpenseFormControl = new FormControl("ALL");
    this.statusFormControl = new FormControl("ALL");

    const filterSubscription = merge(
      this.incomeExpenseFormControl.valueChanges,
      this.statusFormControl.valueChanges,
      this.searchTextFormControl.valueChanges
    )
    .pipe(
      debounceTime(700),
      distinctUntilChanged()
    )
    .subscribe((value:[string, string, string]) => {
      this.getCategories();
    });

    this._destory$.onDestroy(() => {
      filterSubscription.unsubscribe();
    });
  }


  private getCategories() {
    const searchText = this.searchTextFormControl.value;
    let params: HttpParams | undefined;
    if(searchText && searchText.trim() !== ""){
      params = new HttpParams().set('searchText', searchText);
    }
    const incomeExpense = this.incomeExpenseFormControl.value;
    if(incomeExpense && incomeExpense !== "ALL"){
      params = (params ?? new HttpParams()).set('isIncome', incomeExpense);
    }
    
    const status = this.statusFormControl.value;
    if(status && status !== "ALL"){
      params = (params ?? new HttpParams()).set('isActive', status);
    }

    this.categoryService.getCategories(params)
    .pipe(take(1))
    .subscribe(response => {
      this.categories.set(response.data);
    });
  }

  private openDialog(data:CategoryDialogData) {
    this.dialogService.open<
      ManageCategory,
      CategoryDialogData,
      CategoryDialogResult
    >(
      ManageCategory,
      {
        data: data,
        type: DialogType.Sidepop,
        ariaLabel: data.mode === 'add' ? 'Add category' : 'Edit category',
      }
    ).afterClosed().pipe(
      take(1)
    ).subscribe(result => {
      if (result?.saved) {
        this.getCategories();
      }
    });
  }

  onAddCategory() {
    this.openDialog({
      mode: 'add',
      category: null,
    });
  }

  private onDeleteCategory(category: CategoryModel) {
    this.dialogService.open<
      MessageDialog,
      MessageDialogData,
      MessageDialogResult
    >(
      MessageDialog,
      {
        data: {
          title: 'Delete category',
          message: `Are you sure you want to delete the category "${category.name}"?`,
          kind: MessageDialogKind.CONFIRM,
          theme: MessageDialogTheme.ERROR,
          iconSrc: '/icons/delete_fill.svg',
          cancelText: 'Cancel',
          confirmText: 'Yes, Delete',
        },
        width: '350px',
        closeOnBackdrop: false,
        type: DialogType.Modal,
        ariaLabel: 'Delete category',
      }
    ).afterClosed().pipe(
      take(1)
    ).subscribe(result => {
      if (result?.confirmed) {
        this.delete(category);
      }
    });
  }

  private delete(category: CategoryModel) {
    this.categoryService.deleteCategory(category.id, category.isUniversal)
    .pipe(take(1))
    .subscribe(response => {
      this.toastService.showSuccess('Category deleted successfully');
      this.getCategories();
    });
  }
}
