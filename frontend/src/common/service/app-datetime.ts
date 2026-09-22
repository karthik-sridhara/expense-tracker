import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppDatetimeService {

    formatDate(value?: string | Date | null, options?: Intl.DateTimeFormatOptions): string {
        if (!value) {
            return '';
        }
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleString(undefined, options ?? {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    
}