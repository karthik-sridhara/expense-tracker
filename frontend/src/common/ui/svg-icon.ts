import {
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { SvgIconRegistry } from '../service/svg-icon-registry';

/**
 * Loads an SVG file as inline markup so its color can be controlled with
 * regular CSS/Tailwind classes (e.g. `text-blue-500`), instead of being
 * limited to whatever colors are hardcoded in the SVG file.
 *
 * Usage:
 *   <ui-svg-icon src="/icons/app_logo.svg" class="h-9 w-9 text-blue-500" />
 */
@Component({
  selector: 'ui-svg-icon',
  standalone: true,
  template: '',
  host: {
    class: 'inline-flex',
    'aria-hidden': 'true',
  },
})
export class SvgIcon {
    readonly src = input.required<string>();

    private readonly registry = inject(SvgIconRegistry);
    private readonly host = inject(ElementRef<HTMLElement>);
    private readonly renderer = inject(Renderer2);

    constructor() {
        toObservable(this.src)
        .pipe(
            switchMap((src) => this.registry.get(src)),
            takeUntilDestroyed()
        )
        .subscribe((svgText) => this.render(svgText));
    }

    private render(svgText: string | null): void {
        this.host.nativeElement.innerHTML = svgText ?? '';

        const svg = this.host.nativeElement.querySelector('svg');
        if (!svg) {
            return;
        }

        svg.removeAttribute('width');
        svg.removeAttribute('height');
        this.renderer.setAttribute(svg, 'fill', 'currentColor');
        this.renderer.setAttribute(svg, 'class', 'h-full w-full');
    }
}
