import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SvgIconRegistry {
    private readonly http = inject(HttpClient);
    private readonly cache = new Map<string, Observable<string | null>>();
    private readonly errorHandler = inject(ErrorHandler);

    get(src: string): Observable<string | null> {
        let icon$ = this.cache.get(src);
        if (!icon$) {
            icon$ = this.http.get(src, { responseType: 'text' })
                .pipe(
                    catchError((error) => {
                        this.cache.delete(src); // allow retry on failure
                        this.errorHandler.handleError(error);
                        return of(null);
                    }),
                    shareReplay({ bufferSize: 1, refCount: false })
                );
            this.cache.set(src, icon$);
        }
        return icon$;
    }
}