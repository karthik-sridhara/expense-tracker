import {
  Component,
  ElementRef,
  ErrorHandler,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

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

    private readonly http = inject(HttpClient);
    private readonly host = inject(ElementRef<HTMLElement>);
    private readonly renderer = inject(Renderer2);
    private readonly errorHandler = inject(ErrorHandler);

    constructor() {
        toObservable(this.src)
        .pipe(
            switchMap((src) =>
            this.http.get(src, { responseType: 'text' }).pipe(
                catchError((err) => {
                    this.errorHandler.handleError(err);
                    return of(null);
                })
            )
            ),
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
