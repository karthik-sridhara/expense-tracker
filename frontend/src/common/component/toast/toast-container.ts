import { Component } from "@angular/core";
import { ToastService } from "./toast-service";
import { Button } from "../../ui/button";
import { ToastType } from "../../enum/dialog";
import { SvgIcon } from "../../ui/svg-icon";

@Component({
  selector: 'toast-container',
  imports: [Button, SvgIcon],
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div
        animate.enter="toast-enter"
        animate.leave="toast-leave"
        class="pointer-events-auto flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 pe-3 text-slate-700 shadow-lg shadow-slate-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-200"
        role="status"
        aria-live="polite"
      >
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <div
            class="h-10 w-1 shrink-0 rounded-full"
            [class]="getIndicatorClass(toast.type)"
          ></div>

          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            [class]="getIconChipClass(toast.type)"
          >
            <ui-svg-icon
              class="h-4 w-4"
              [src]="getIconSrc(toast.type)"
            />
          </div>

          <p class="truncate text-sm font-medium leading-5">
            {{ toast.message }}
          </p>
        </div>

        @if (toast.dismissible) {
          <button
            uiButton
            type="button"
            variant="ghost"
            color="default"
            size="sm"
            class="shrink-0 rounded-full! p-0!"
            icon="/icons/close.svg"
            iconClass="p-1.5!"
            aria-label="Dismiss notification"
            (click)="toastService.dismiss(toast.id)"
          ></button>
        }
      </div>
    }
  `,
  styles: [`
    .toast-enter {
      animation: toast-slide-in 220ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .toast-leave {
      animation: toast-slide-out 180ms ease-in forwards;
    }

    @keyframes toast-slide-in {
      from {
        opacity: 0;
        transform: translate3d(16px, -8px, 0) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    @keyframes toast-slide-out {
      from {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
      to {
        opacity: 0;
        transform: translate3d(20px, -4px, 0) scale(0.96);
      }
    }
  `],
  host: {
    class: 'pointer-events-none fixed top-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3'
  }
})
export class ToastContainer {
  constructor(readonly toastService: ToastService) {}

  protected getIndicatorClass(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return 'bg-green-500';
      case ToastType.ERROR:
        return 'bg-red-500';
      case ToastType.WARNING:
        return 'bg-amber-500';
      case ToastType.INFO:
      default:
        return 'bg-blue-500';
    }
  }

  protected getIconChipClass(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300';
      case ToastType.ERROR:
        return 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300';
      case ToastType.WARNING:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300';
      case ToastType.INFO:
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300';
    }
  }

  protected getIconSrc(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return '/icons/success.svg';
      case ToastType.ERROR:
        return '/icons/error.svg';
      case ToastType.WARNING:
        return '/icons/warning.svg';
      case ToastType.INFO:
      default:
        return '/icons/info.svg';
    }
  }
}