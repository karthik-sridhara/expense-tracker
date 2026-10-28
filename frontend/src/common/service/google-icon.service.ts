import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { CODEPOINTS_URL, ICON_NAME_PATTERN } from '../const/google-icon.const';
import { GoogleIconConfig } from '../interface/app/google-icon.model';


@Injectable({ providedIn: 'root' })
export class GoogleIconService {

    private readonly http = inject(HttpClient);

    /** All icon names (aliases sharing the same glyph removed). Fetched once and cached. */
    readonly names$: Observable<string[] | null> = this.http
        .get(CODEPOINTS_URL, { responseType: 'text' })
        .pipe(
            map((text) => this.parse(text)),
            shareReplay({ bufferSize: 1, refCount: false }),
            catchError(() => of(null))
        );

    private parse(text: string): string[] {
        const seenCodepoints = new Set<string>();
        const names: string[] = [];

        for (const line of text.split('\n')) {
            const [name, codepoint] = line.trim().split(/\s+/);
            if (!name || !codepoint || !ICON_NAME_PATTERN.test(name) || seenCodepoints.has(codepoint)) {
                continue;
            }
            seenCodepoints.add(codepoint);
            names.push(name);
        }
        return names;
    }

    /** Serializes an icon config to `name;fill` (e.g. `savings;1`). */
    toGoogleIconValue(config: GoogleIconConfig): string {
        return [
            config.name,
            config.fill ? 1 : 0
        ].join(';');
    }

    /** Parses `name;fill`. Returns null for empty or invalid values. */
    parseGoogleIconValue(value: string | null | undefined): GoogleIconConfig | null {
        const [name, fill] = (value ?? '').split(';');
        if (!name || !ICON_NAME_PATTERN.test(name)) {
            return null;
        }
        return {
            name,
            fill: fill !== '0',
        };
    }
}
