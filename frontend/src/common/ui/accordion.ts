import { Component, input, model } from "@angular/core";
import { Button } from "./button";

@Component({
    imports: [Button],
    selector: 'app-accordion',
    styles:`
        #accordion-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    `,
    template: `
        <div
            class="w-full rounded-lg transition-colors"
            [class.border]="bordered()"
            [class.border-slate-200]="bordered()"
            [class.dark:border-slate-800]="bordered()"
        >
            <button
                id="accordion-button"
                uiButton
                variant="ghost"
                size="md"
                color="default"
                class="w-full rounded-lg"
                [attr.aria-expanded]="isOpen()"
                aria-label="Toggle Accordion"
                (click)="toggleAccordion()"
                [icon]="isOpen() ? '/icons/arrow_up.svg' : '/icons/arrow_down.svg'"
                iconPosition="suffix"
            >
                <ng-content select="[accordion-title]"></ng-content>
            </button>
            @if (isOpen()) {
                <div
                    id="accordion-content"
                    class="px-4 pb-4 pt-3 text-sm text-slate-600 dark:text-slate-400"
                    [class.border-t]="bordered()"
                    [class.border-slate-200]="bordered()"
                    [class.dark:border-slate-800]="bordered()"
                >
                    <ng-content select="[accordion-content]"></ng-content>
                </div>
            }
        </div>
    `,
    host: {
        class: 'block'
    }
})
export class Accordion {
    isOpen = model<boolean>(false);
    bordered = input<boolean>(true);

    toggleAccordion() {
        this.isOpen.update((v: boolean) => !v);
    }
}