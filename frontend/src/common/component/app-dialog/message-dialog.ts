import { Component, computed, inject } from '@angular/core';
import { DIALOG_DATA, MessageDialogData, MessageDialogResult } from '../../interface/app/app-dialog';
import { MessageDialogKind, MessageDialogTheme } from '../../enum/dialog';
import { DialogRef } from './app-dialog-ref';
import { Button } from '../../ui/button';
import { SvgIcon } from '../../ui/svg-icon';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [Button, SvgIcon],
  template: `
    
    <header
        class="flex items-center gap-4 bg-white px-6 pt-6 pb-3 dark:bg-slate-950"
    >
        <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            [class]="iconContainerClasses()"
        >
            <ui-svg-icon
            [src]="resolvedIconSrc()"
            class="h-6 w-6"
            />
        </div>

        <div class="min-w-0">
            <h2 class="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            {{ data.title }}
            </h2>
        </div>
    </header>

    <div class="bg-white px-6 pb-6 dark:bg-slate-950">
        <p class="text-base leading-8 text-slate-600 dark:text-slate-300">
            {{ data.message }}
        </p>
    </div>

    <footer class="flex justify-end gap-3 border-t border-slate-200 bg-slate-100 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        @if (isConfirm()) {
            <button
                uiButton
                type="button"
                variant="outline"
                color="default"
                size="md"
                (click)="cancel()"
            >
                {{ data.cancelText ?? 'Cancel' }}
            </button>
        }

        <button
            uiButton
            type="button"
            variant="filled"
            [color]="buttonColor()"
            size="md"
            (click)="confirm()"
        >
            {{ data.confirmText ?? (isConfirm() ?   'Confirm' : 'OK') }}
        </button>
    </footer>
  `,
  host: {
    class: 'flex w-full max-w-lg flex-col text-slate-900 dark:text-slate-100'
  }
})
export class MessageDialog {
  readonly data = inject(DIALOG_DATA) as MessageDialogData;
  private readonly dialogRef = inject(DialogRef<MessageDialogResult>);

  protected readonly isConfirm = computed(
    () => (this.data.kind ?? MessageDialogKind.INFO) === MessageDialogKind.CONFIRM,
  );

  protected readonly resolvedTheme = computed(
    () => this.data.theme ?? MessageDialogTheme.INFO,
  );

  protected readonly resolvedIconSrc = computed(() => {
    if (this.data.iconSrc) {
      return this.data.iconSrc;
    }
    switch (this.resolvedTheme()) {
      case MessageDialogTheme.WARNING:
        return '/icons/warning.svg';
      case MessageDialogTheme.ERROR:
        return '/icons/error.svg';
      case MessageDialogTheme.INFO:
      default:
        return '/icons/info.svg';
    }
  });

  protected readonly buttonColor = computed(() => {
    switch (this.resolvedTheme()) {
      case MessageDialogTheme.WARNING:
        return 'warning';
      case MessageDialogTheme.ERROR:
        return 'error';
      case MessageDialogTheme.INFO:
      default:
        return 'info';
    }
  });

  protected readonly iconContainerClasses = computed(() => {
    switch (this.resolvedTheme()) {
      case MessageDialogTheme.WARNING:
        return 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400';
      case MessageDialogTheme.ERROR:
        return 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400';
      case MessageDialogTheme.INFO:
      default:
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400';
    }
  });

  protected cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  protected confirm(): void {
    this.dialogRef.close({ confirmed: true });
  }
}