import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { LoaderService } from '../../service/loader';
import { AppLogoIcon } from '../../ui/app-logo-icon';

@Component({
  selector: 'app-loader',
  imports: [AppLogoIcon],
  template: `
    <dialog
        #loaderDialog
        class="m-auto overflow-visible border-0 bg-transparent p-0 backdrop:bg-slate-950/25 backdrop:backdrop-blur-xs"
        aria-label="Loading"
        (cancel)="$event.preventDefault()"
    >
        <div
            class="relative flex h-24 w-24 items-center justify-center rounded-lg bg-white shadow-xl dark:bg-slate-900"
            role="status"
            aria-live="polite"
        >
            <span class="loader-ring" aria-hidden="true"></span>

            <app-logo-icon
                sizeClass="h-12 w-12"
                iconSizeClass="h-7 w-7"
            />
        </div>
    </dialog>
  `,
  styles: `
    .loader-ring {
        position: absolute;
        width: 4.25rem;
        height: 4.25rem;
        border: 0.2rem solid
            color-mix(
                in srgb,
                var(--color-primary-500) 20%,
                transparent
            );
        border-top-color: var(--color-primary-600);
        border-right-color: var(--color-amber-500);
        border-radius: 50%;
        animation: loader-spin 750ms linear infinite;
    }

    @keyframes loader-spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .loader-ring {
            animation-duration: 1500ms;
        }
    }
  `
})
export class Loader {
    private readonly loaderService = inject(LoaderService);
    private readonly loaderDialog =
        viewChild.required<ElementRef<HTMLDialogElement>>('loaderDialog');

    constructor() {
        effect(() => {
            const dialog = this.loaderDialog().nativeElement;

            if (this.loaderService.isLoading()) {
                if (!dialog.open) {
                    dialog.showModal();
                }
            } else if (dialog.open) {
                dialog.close();
            }
        });
    }
}