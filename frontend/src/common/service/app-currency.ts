import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppCurrencyService {

    formatCurrency(value?: number | null ): string {
        const currency = 'INR';
        if (value === null || value === undefined) {
            return '';
        }
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
        }).format(value);
    }
}