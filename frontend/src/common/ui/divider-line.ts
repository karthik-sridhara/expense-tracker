import { Component, input } from "@angular/core";

@Component({
    selector: 'ui-divider',
    template: `
        <div class="flex items-center gap-3">
            <hr class="flex-1 border-slate-200 dark:border-slate-700">
            @if (text()) {
                <span class="text-xs text-slate-400 dark:text-slate-500">{{ text() }}</span>
                <hr class="flex-1 border-slate-200 dark:border-slate-700">
            }
        </div>
    `,
    host: {
        class: 'block'
    }
})
export class DividerLine {
    text = input<string|null>(null);
}