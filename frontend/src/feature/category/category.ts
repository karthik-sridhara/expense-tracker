import { Component, OnInit, signal } from '@angular/core';
import { SvgIcon } from "../../common/ui/svg-icon";
import { CategoryService } from './category.service';
import { take } from 'rxjs';
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

@Component({
  imports: [SvgIcon, UiMenu],
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

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private appSessionService:AppSessionService,
    private toastService:ToastService
  ) {
    this.userRole.set(this.appSessionService.getUser()!.role);
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

  private getCategories() {
    this.categoryService.getCategories()
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
          cancelText: 'Cancel',
          confirmText: 'Yes, Delete',
        },
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
