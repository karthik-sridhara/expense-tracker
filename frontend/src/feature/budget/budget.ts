import { Component, signal } from '@angular/core';
import { Button } from "../../common/ui/button";
import { Input } from '../../common/ui/input';
import { AppSelect } from "../../common/ui/select";
import { BudgetType } from '../../common/enum/budget';
import type { ColDef, SortComparatorFn } from 'ag-grid-community';
import { AppTable } from '../../common/component/app-table/app-table';
import { BudgetService } from './budget.service';
import { take } from 'rxjs';
import { ActionsCellRenderer, TableAction } from '../../common/component/app-table/cell-renderer/actions';
import { CategoryCellRenderer } from './category-cellrender';
import { ManageBudget } from './manage-budget/manage-budget';
import { BudgetDialogData, BudgetDialogResult } from '../../common/interface/budget/budget-dialog';
import { DialogType, MessageDialogKind, MessageDialogTheme } from '../../common/enum/dialog';
import { DialogService } from '../../common/component/app-dialog/app-dialog.service';
import { MessageDialog } from '../../common/component/app-dialog/message-dialog';
import { MessageDialogData, MessageDialogResult } from '../../common/interface/app/app-dialog';
import { AppDatetimeService } from '../../common/service/app-datetime';
import { AppCurrencyService } from '../../common/service/app-currency';

@Component({
  imports: [Button, Input, AppSelect,AppTable],
  selector: 'app-budget',
  styleUrl: './budget.css',
  templateUrl: './budget.html',
  host: {
    class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
  }
})
export class Budget {
  budgetType!:{'label':string,'value':string}[];
  
  budgetColDefs = signal<ColDef[]>([]);
  budgetRowData = signal<any[]>([]);


  constructor(
    private budgetService: BudgetService,
    private dialogService: DialogService,
    private appDatetimeService: AppDatetimeService,
    private appCurrencyService: AppCurrencyService
  ){
    this.loadBudgetType();
    this.loadBudgetColDefs();
    this.getBudgets();
  }

  private loadBudgetType() {
    this.budgetType = [];
    for (const [label, value] of Object.entries(BudgetType)) {
      this.budgetType.push({ label, value });
    }
  }

  private loadBudgetColDefs() {
    const colDefs: ColDef[] = [
      { 
        headerName: 'Category', 
        cellRenderer: CategoryCellRenderer, 
        minWidth: 220,
        field: 'category',
        comparator:this.categoryComparator
      },
      { headerName: 'Duratuion', field: 'durationType' },
      { 
        headerName: 'Monthly Limit', 
        field: 'amount', 
        valueFormatter: (params) => this.appCurrencyService.formatCurrency(params.value),
        cellClass: 'text-right'
      },
      { 
        headerName: 'Last Updated', 
        valueGetter: (params) => params.data?.modifiedAt ?? params.data?.createdAt,
        valueFormatter: (params) => this.appDatetimeService.formatDate(params.value)
      },
      { 
        headerName: 'Actions', 
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          actions: [
            { icon: '/icons/edit_fill.svg', name: 'Edit', onClick: (row) => this.onEdit(row) },
            { icon: '/icons/delete_fill.svg', name: 'Delete', isDisabled: (row) => row.isSystem, onClick: (row) => this.onDelete(row) },
          ] satisfies TableAction[],
        }, 
        minWidth: 110,
        sortable: false, 
        filter: false , 
        resizable: false 
      }
    ];
    this.budgetColDefs.set(colDefs);
  }
  
  private getBudgets() {
    this.budgetService.getBudgets()
    .pipe(take(1))
    .subscribe({
      next: (response) => {
        if (response.data) {
          this.budgetRowData.set(response.data);
        }
      }
    });
  }

  private categoryComparator:SortComparatorFn = (a: any, b: any) => {
    const nameA = a?.name ?? '';
    const nameB = b?.name ?? '';
    return nameA.localeCompare(nameB);
  };



  private onEdit(row: any) {
    this.openManageBudgetDialog({ mode: 'edit', budget: row });
  }

  private onDelete(row: any) {
    this.dialogService.open
    <MessageDialog, MessageDialogData, MessageDialogResult>(MessageDialog,
      {
        data: {
          title: 'Delete Budget',
          message: 'Are you sure you want to delete this budget?',
          confirmText: 'Yes, Delete',
          cancelText: 'Cancel',
          kind: MessageDialogKind.CONFIRM,
          theme: MessageDialogTheme.ERROR,
          iconSrc: '/icons/delete_fill.svg'
        },
        width: '350px',
        type: DialogType.Modal,
        closeOnBackdrop: false,
        ariaLabel: 'Delete budget',
      }
    ).afterClosed().pipe(take(1)).subscribe((result) => {
        if (result?.confirmed) {
          this.budgetService.deleteBudget(row.id)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.getBudgets();
            }
          });
        }
    });
  }

  onAdd(){
    this.openManageBudgetDialog({ mode: 'add', budget: null });
  }

  private openManageBudgetDialog(data: BudgetDialogData) {
    this.dialogService.open
    <ManageBudget, BudgetDialogData, BudgetDialogResult>(ManageBudget,
      {
        data,
        width: '300px',
        type: DialogType.Sidepop,
        ariaLabel: data.mode === 'add' ? 'Add budget' : 'Edit budget',
      }
    ).afterClosed().pipe(take(1)).subscribe((result) => {
        if (result?.saved) {
          this.getBudgets();
        }
    });
  }

}
