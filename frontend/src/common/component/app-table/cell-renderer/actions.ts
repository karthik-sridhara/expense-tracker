import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { SvgIcon } from '../../../ui/svg-icon';
import { Button } from '../../../ui/button';

export interface TableAction<T = any> {
  icon: string;
  name: string;
  isDisabled?: (data: T) => boolean;
  onClick: (data: T) => void;
}

export interface ActionsCellRendererParams<T = any> extends ICellRendererParams<T> {
  actions: TableAction<T>[];
}

@Component({
  selector: 'app-table-actions-cell-renderer',
  imports: [Button],
  template: `
    <div class="flex h-full items-center gap-1">
      @for (action of actions; track action.name) {
        <button
            uiButton
            type="button"
            variant="ghost"
            color="primary"
            class="p-0! bg-inherit!"
            size="sm"
            [icon]="action.icon"
            [title]="action.name"
            [disabled]="isDisabled(action)"
            (click)="onClick(action)"
        ></button>
      }
    </div>
  `,
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  actions: TableAction[] = [];
  private data: any;

    agInit(params: ActionsCellRendererParams): void {
        this.updateParams(params);
    }

    refresh(params: ActionsCellRendererParams): boolean {
        this.updateParams(params);
        return true;
    }

    isDisabled(action: TableAction): boolean {
        return action.isDisabled?.(this.data) ?? false;
    }

    onClick(action: TableAction): void {
        if (this.isDisabled(action)) {
            return;
        }
        action.onClick(this.data);
    }

    private updateParams(params: ActionsCellRendererParams): void {
        this.actions = params.actions ?? [];
        this.data = params.data;
    }
}