import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { SvgIcon } from '../../common/ui/svg-icon';
import { Category } from '../../common/interface/category/category';


@Component({
  selector: 'app-table-category-cell-renderer',
  imports: [SvgIcon],
  template: `
    <div class="flex h-full items-center gap-2" [title]="category?.description ?? ''">
      @if (category?.icon) {
        <ui-svg-icon
          [src]="'/icons' + category!.icon"
          class="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400"
        />
      }
      <div class="min-w-0 leading-tight">
        <div class="truncate font-medium text-slate-900 dark:text-slate-100"
            [title]="category?.name"
        >
          {{ category?.name }}
        </div>
        @if (category?.description) {
          <div class="truncate text-xs text-slate-500 dark:text-slate-400"
            [title]="category?.description"
          >
            {{ category?.description }}
          </div>
        }
      </div>
    </div>
  `,
})
export class CategoryCellRenderer implements ICellRendererAngularComp {
  category: Category | null = null;

  agInit(params: ICellRendererParams<any, Category>): void {
    this.updateParams(params);
  }

  refresh(params: ICellRendererParams<any, Category>): boolean {
    this.updateParams(params);
    return true;
  }

  private updateParams(params: ICellRendererParams<any, Category>): void {
    this.category = params.value ?? null;
  }
}