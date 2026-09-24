import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Button } from "../../common/ui/button";
import { Input } from '../../common/ui/input';
import { AppSelect } from "../../common/ui/select";
import { BudgetType } from '../../common/enum/budget';
import type { ColDef, SortComparatorFn } from 'ag-grid-community';
import { AppTable } from '../../common/component/app-table/app-table';
import { BudgetService } from './budget.service';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { SvgIcon } from '../../common/ui/svg-icon';
import { ToastService } from '../../common/component/toast/toast-service';
import { UiMenu } from '../../common/ui/menu';

@Component({
  imports: [Button, Input, AppSelect,AppTable,ReactiveFormsModule,SvgIcon,UiMenu],
  selector: 'app-budget',
  styleUrl: './budget.css',
  templateUrl: './budget.html',
  host: {
    class: 'block h-full overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
  }
})
export class Budget implements OnInit{
  durationType!:{'label':string,'value':string}[];
  
  budgetColDefs = signal<ColDef[]>([]);
  budgetRowData = signal<any[]>([]);

  durationTypeFormControl!:FormControl;
  searchTextFormControl!: FormControl;

  budgetMenuItems = [
    { 
      icon: '/icons/edit_fill.svg', 
      text: 'Edit', 
      onClick: (data:unknown) => this.onEdit(data) 
    },
    {
      icon: '/icons/delete_fill.svg',
      text: 'Delete',
      onClick: (data:unknown) => this.onDelete(data),
    },
  ];


  constructor(
    private budgetService: BudgetService,
    private dialogService: DialogService,
    private appDatetimeService: AppDatetimeService,
    private appCurrencyService: AppCurrencyService,
    private toastService: ToastService,
    private _destory$: DestroyRef
  ){
    this.loadDurationType();
    this.loadBudgetColDefs();
    this.createFilterFormControls();
  }

  ngOnInit(): void {
    this.getBudgets();
  }

  private createFilterFormControls() {
    this.durationTypeFormControl = new FormControl("ALL");
    const durationTypeSubscription = this.durationTypeFormControl.valueChanges.subscribe(value => {
      this.getBudgets();
    });

    this.searchTextFormControl = new FormControl("");
    const searchTextSubscription = this.searchTextFormControl.valueChanges
    .pipe(
      debounceTime(700),
      distinctUntilChanged()
    )
    .subscribe((value:string) => {
        this.getBudgets();
    });

    this._destory$.onDestroy(() => {
      durationTypeSubscription.unsubscribe();
      searchTextSubscription.unsubscribe();
    });
  }

  private loadDurationType() {
    this.durationType = [];
    for (const [label, value] of Object.entries(BudgetType)) {
      this.durationType.push({ label, value });
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
    const durationType = this.durationTypeFormControl.value;
    const searchText = this.searchTextFormControl.value;
    let params: HttpParams | undefined;
    if(durationType!="ALL"){
      params = new HttpParams().set('durationType', durationType);
    }
    if(searchText && searchText.trim() !== ""){
      params = (params ?? new HttpParams()).set('searchText', searchText);
    }

    this.budgetService.getBudgets(params)
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

  
  onEdit(row: any) {
    this.openManageBudgetDialog({ mode: 'edit', budget: row });
  }

  onDelete(row: any) {
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
          this.toastService.showSuccess( 'Budget deleted successfully');
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

  formatCurrency(amount?: number | null): string {
    return this.appCurrencyService.formatCurrency(amount);
  }

  formatDate(date?: string | Date | null): string {
    return this.appDatetimeService.formatDate(date);
  }
}
