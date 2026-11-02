import { Component, inject } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { GoogleIcon } from '../../common/ui/google-icon';
import { Category } from '../../common/interface/category/category';
import { GoogleIconService } from '../../common/service/google-icon.service';
import { GoogleIconConfig } from '../../common/interface/app/google-icon.model';


@Component({
  selector: 'app-table-category-cell-renderer',
  imports: [GoogleIcon],
  template: `
    <div class="flex h-full items-center gap-2" [title]="category?.description ?? ''">
      @if (icon) {
        <ui-google-icon
          [name]="icon.name"
          [fill]="icon.fill"
          class="shrink-0 text-2xl text-slate-500 dark:text-slate-400"
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
  private readonly googleIconService = inject(GoogleIconService);

  category: Category | null = null;
  icon: GoogleIconConfig | null = null;

  agInit(params: ICellRendererParams<any, Category>): void {
    this.updateParams(params);
  }

  refresh(params: ICellRendererParams<any, Category>): boolean {
    this.updateParams(params);
    return true;
  }

  private updateParams(params: ICellRendererParams<any, Category>): void {
    this.category = params.value ?? null;
    this.icon = this.googleIconService.parseGoogleIconValue(this.category?.icon);
  }
}