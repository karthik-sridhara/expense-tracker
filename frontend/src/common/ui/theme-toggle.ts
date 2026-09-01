import { Component, inject } from '@angular/core';
import { ThemeService } from '../service/theme';
import { Button } from './button';

@Component({
    selector: 'ui-theme-toggle',
    imports: [Button],
    template: `
        <button
            uiButton
            iconSizeClass="h-5 w-5"
            variant="ghost"
            color="default"
            size="sm"
            [icon]="theme.theme() === 'dark' ? '/icons/light_mode_fill.svg' : '/icons/dark_mode_fill.svg'"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            (click)="theme.toggle()"
        ></button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
}