import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  Type,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { DialogConfig } from '../../interface/app/app-dialog';
import { DialogRef } from './app-dialog-ref';
import { DialogType } from '../../enum/dialog';

@Component({
  imports: [NgComponentOutlet],
  selector: 'app-dialog',
  template: `
    <dialog
      #dialog
      [class]="dialogClasses()"
      aria-modal="true"
      [attr.aria-label]="config().ariaLabel ?? null"
      [style.width]="config().width ?? null"
      [style.max-width]="config().maxWidth ?? null"
      (cancel)="onCancel($event)"
      (click)="onDialogClick($event)"
    >
      <ng-container
        *ngComponentOutlet="
          content();
          injector: contentInjector()
        "
      />
    </dialog>
  `,
})
export class AppDialog {
  readonly content = input.required<Type<unknown>>();
  readonly contentInjector = input.required<Injector>();
  readonly dialogRef = input.required<DialogRef<unknown>>();
  readonly config = input<DialogConfig<unknown>>({});

  private readonly positionClasses = {
    [DialogType.Sidepop]: 'ml-auto mr-0 my-0 h-dvh max-h-dvh w-2/3 md:w-1/2 min-w-80 max-w-[calc(100vw-2rem)] rounded-l-md',
    [DialogType.Modal]: 'm-auto max-h-[calc(100vh-2rem)] w-100 max-w-[calc(100vw-2rem)] rounded-md',
    [DialogType.ProfilePop]: 'm-auto mr-4 md:mr-10 mt-16 max-h-dvh  max-w-[calc(100vw-2rem)] rounded-lg backdrop:bg-slate-950/1!',
  }

  protected readonly dialogClasses = computed(() => {
    const baseClasses =
      'p-0 overflow-auto border border-slate-200 bg-white shadow-xl ' +
      'backdrop:bg-slate-950/50 dark:border-slate-600 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/80';
    const positionClasses = this.positionClasses[this.config().type ?? DialogType.Modal];

    return [baseClasses, positionClasses, this.config().class]
      .filter(Boolean)
      .join(' ');
    }
  );

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(): void {
    const dialog = this.dialog().nativeElement;

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  protected onCancel(event: Event): void {
    // Prevent the browser from closing only the native element.
    // DialogRef must run so the Angular component is also destroyed.
    event.preventDefault();

    if (this.config().closeOnEscape ?? true) {
      this.dialogRef().close();
    }
  }

  protected onDialogClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;

    // A click directly on <dialog> is a backdrop click. Clicks from
    // content bubble up with a different event target.
    if (
      event.target === dialog &&
      (this.config().closeOnBackdrop ?? true)
    ) {
      this.dialogRef().close();
    }
  }
}