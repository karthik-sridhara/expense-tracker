import { Component, computed, forwardRef, inject, input, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GoogleIcon } from './google-icon';
import { Input } from './input';
import { Button } from './button';
import { GoogleIconService } from '../service/google-icon.service';

const PAGE_SIZE = 120;

// Fixed icon style; only `fill` is user selectable.
const ICON_WEIGHT = 400;
const ICON_GRADE = 0;
const ICON_OPTICAL_SIZE = 24;

/**
 * Form control for picking a Google Material Symbols icon.
 * Value format: `name;fill` (e.g. `savings;1`).
 */
@Component({
    selector: 'ui-google-icon-picker',
    imports: [GoogleIcon, Input, Button],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GoogleIconPicker),
            multi: true,
        },
    ],
    host: {
        class: 'block rounded-md border border-slate-300 p-3 dark:border-slate-600',
    },
    template: `
        <div class="mb-3 flex items-center gap-3">
            <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md
                    bg-primary-50 text-primary-700 ring-1 ring-primary-100
                    dark:bg-primary-950 dark:text-primary-300 dark:ring-primary-900"
            >
                @if (selected(); as name) {
                    <ui-google-icon
                        [name]="name"
                        [fill]="fill()"
                        [weight]="weight"
                        [grade]="grade"
                        [opticalSize]="opticalSize"
                        class="text-3xl"
                    />
                } @else {
                    <span class="text-xs text-slate-400">None</span>
                }
            </div>

            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium" [title]="selected() ?? ''">
                    {{ selected() ?? 'No icon selected' }}
                </p>

                <div
                    role="group"
                    aria-label="Icon style"
                    class="mt-1 inline-flex overflow-hidden rounded-md border border-slate-300 text-xs dark:border-slate-600"
                >
                    <button
                        type="button"
                        class="px-2.5 py-1 transition-colors"
                        [class]="fill() ? activeToggleClass : inactiveToggleClass"
                        [attr.aria-pressed]="fill()"
                        [disabled]="disabled()"
                        (click)="setFill(true)"
                    >
                        Filled
                    </button>
                    <button
                        type="button"
                        class="px-2.5 py-1 transition-colors"
                        [class]="!fill() ? activeToggleClass : inactiveToggleClass"
                        [attr.aria-pressed]="!fill()"
                        [disabled]="disabled()"
                        (click)="setFill(false)"
                    >
                        Outlined
                    </button>
                </div>
            </div>
        </div>

        <ui-input
            [name]="name()"
            placeholder="Search icons, e.g. shopping"
            icon="/icons/search.svg"
            [disabled]="disabled()"
            [(value)]="query"
        />

        @if (names() === undefined) {
            <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading icons...</p>
        } @else if (names() === null) {
            <p class="mt-3 text-sm text-red-600">Unable to load icons. Please try again later.</p>
        } @else {
            <div
                role="listbox"
                aria-label="Icons"
                class="mt-3 grid max-h-64 grid-cols-6 gap-2 overflow-auto sm:grid-cols-8"
            >
                @for (name of visible(); track name) {
                    <button
                        type="button"
                        role="option"
                        class="flex aspect-square items-center justify-center rounded-md border
                            transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        [class]="name === selected() ? selectedOptionClass : optionClass"
                        [attr.aria-selected]="name === selected()"
                        [attr.aria-label]="name"
                        [title]="name"
                        [disabled]="disabled()"
                        (click)="select(name)"
                    >
                        <ui-google-icon
                            [name]="name"
                            [fill]="fill()"
                            [weight]="weight"
                            [grade]="grade"
                            [opticalSize]="opticalSize"
                            class="text-2xl"
                        />
                    </button>
                } @empty {
                    <p class="col-span-full text-sm text-slate-500 dark:text-slate-400">No icons found.</p>
                }
            </div>

            <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{{ visible().length }} of {{ filtered().length }} icons</span>
                @if (visible().length < filtered().length) {
                    <button uiButton type="button" variant="link" size="sm" (click)="showMore()">
                        Show more
                    </button>
                }
            </div>
        }
    `,
})
export class GoogleIconPicker implements ControlValueAccessor {
    readonly name = input<string>('icon-search');

    protected readonly weight = ICON_WEIGHT;
    protected readonly grade = ICON_GRADE;
    protected readonly opticalSize = ICON_OPTICAL_SIZE;

    protected readonly activeToggleClass = 'bg-primary-600 text-white';
    protected readonly inactiveToggleClass =
        'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';
    protected readonly optionClass =
        'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';
    protected readonly selectedOptionClass =
        'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500 dark:bg-primary-950 dark:text-primary-300';

    /** undefined = loading, null = failed, string[] = loaded. */
    private readonly googleIconService = inject(GoogleIconService);
    protected readonly names = toSignal(this.googleIconService.names$);

    protected readonly query = signal<string | null>('');
    protected readonly selected = signal<string | null>(null);
    protected readonly fill = signal(true);
    protected readonly disabled = signal(false);
    /** Number of icons rendered; resets whenever the search text changes. */
    private readonly limit = linkedSignal({ source: this.query, computation: () => PAGE_SIZE });

    protected readonly filtered = computed(() => {
        const names = this.names() ?? [];
        const q = (this.query() ?? '').trim().toLowerCase().replace(/\s+/g, '_');
        return q ? names.filter((n) => n.includes(q)) : names;
    });

    protected readonly visible = computed(() => this.filtered().slice(0, this.limit()));

    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    protected select(name: string): void {
        this.selected.set(name);
        this.emit();
    }

    protected setFill(fill: boolean): void {
        this.fill.set(fill);
        if (this.selected()) {
            this.emit();
        }
    }

    protected showMore(): void {
        this.limit.update((l) => l + PAGE_SIZE);
    }

    private emit(): void {
        const name = this.selected();
        if (!name) {
            return;
        }
        this.onChange(
            this.googleIconService.toGoogleIconValue({
                name,
                fill: this.fill(),
            })
        );
        this.onTouched();
    }

    writeValue(value: string | null): void {
        const config = this.googleIconService.parseGoogleIconValue(value);
        this.selected.set(config?.name ?? null);
        this.fill.set(config?.fill ?? true);
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
}
