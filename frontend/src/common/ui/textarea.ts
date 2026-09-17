import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-textarea',
  template: `
    <textarea
      class="block min-h-24 w-full resize-y bg-transparent
             px-3 pb-7 pt-2 text-sm text-slate-900
             outline-none placeholder:text-slate-400
             disabled:cursor-not-allowed
             dark:text-white dark:placeholder:text-slate-500"
      [id]="name()"
      [name]="name()"
      [rows]="rows()"
      [placeholder]="placeholder()"
      [maxLength]="maxLength()!=null ? maxLength()! + 1 : -1"
      [required]="required()"
      [readOnly]="readonly()"
      [disabled]="isDisabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    ></textarea>

    @if (maxLength() !== null) {
      <span
        class="pointer-events-none absolute bottom-2 right-3
               text-xs tabular-nums text-slate-400
               dark:text-slate-500"
        aria-hidden="true"
      >
        {{ characterCount() }} / {{ maxLength() }}
      </span>
    }
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
    }

    :host(.ng-invalid.ng-touched) {
      border-color: #dc2626;
    }

    :host(.ng-invalid.ng-touched:focus-within) {
      border-color: #dc2626;
      box-shadow: 0 0 0 2px rgb(220 38 38 / 20%);
    }
  `],
  host: {
    '[class]': 'classes()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor {
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly maxLength = input<number | null>(null);
  readonly required = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly clientClass = input<string>('', { alias: 'class' });

  readonly value = model<string>('');

  private readonly formDisabled = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

  protected readonly characterCount = computed(
    () => this.value().length,
  );

  protected readonly classes = computed(() => [
    'overflow-hidden rounded-md border border-slate-300 bg-white ' +
      'transition-colors focus-within:border-primary-500 ' +
      'focus-within:ring-2 focus-within:ring-primary-500/20 ' +
      'dark:border-slate-600 dark:bg-slate-800',
    this.isDisabled()
      ? 'cursor-not-allowed opacity-50'
      : '',
    this.clientClass(),
  ].filter(Boolean).join(' '));

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;

    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
  }

  registerOnChange(
    onChange: (value: string) => void,
  ): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}