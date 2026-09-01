import { Injectable, effect, signal } from '@angular/core';
import { LocalStorageService } from './local-storage';
import { LocalStorageKey } from '../enum/local-storage-key';

export type Theme = 'light' | 'dark';


@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly theme = signal<Theme>(this.getPreferredTheme());

    constructor() {
        effect(() => {
            const theme = this.theme();
            document.documentElement.classList.toggle('dark', theme === 'dark');
            LocalStorageService.setValue(LocalStorageKey.THEME, theme);
        });
    }

    toggle(): void {
        this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
    }


    getPreferredTheme(): Theme {
        const stored = LocalStorageService.getValue(LocalStorageKey.THEME);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}