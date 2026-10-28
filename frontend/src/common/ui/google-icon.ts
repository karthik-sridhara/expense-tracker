import { Component, computed, input } from '@angular/core';

/**
 * Renders a Google Material Symbols icon using the variable icon font.
 * Color follows `currentColor` and size follows `font-size`, so Tailwind
 * classes like `text-2xl text-primary-700` work directly.
 *
 * Usage:
 *   <ui-google-icon name="savings" class="text-2xl text-emerald-600" />
 *   <ui-google-icon name="edit" [fill]="false" [weight]="300" />
 */
@Component({
    selector: 'ui-google-icon',
    template: '{{ name() }}',
    host: {
        class: 'google-icon inline-flex select-none leading-none',
        'aria-hidden': 'true',
        '[style.font-variation-settings]': 'variation()',
    },
})
export class GoogleIcon {
    readonly name = input.required<string>();
    readonly fill = input(true);
    readonly weight = input(400);
    readonly grade = input(0);
    readonly opticalSize = input(24);

    readonly variation = computed(
        () =>
        `'FILL' ${this.fill() ? 1 : 0}, 'wght' ${this.weight()}, 'GRAD' ${this.grade()}, 'opsz' ${this.opticalSize()}`
    );
}
