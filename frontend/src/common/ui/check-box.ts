import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  template: `
    <label
      class="flex items-start gap-3"
      [class.cursor-pointer]="!isDisabled()"
      [class.cursor-not-allowed]="isDisabled()"
    >
      <input
        type="checkbox"
        class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary-600 disabled:cursor-not-allowed"
        [checked]="checked()"
        [disabled]="isDisabled()"
        [name]="name()"
        [attr.aria-describedby]="
          description() ? name() + '-description' : null
        "
        (change)="onCheckedChange($event)"
        (blur)="onTouched()"
      />

      <span class="min-w-0">
        <span
          class="block text-sm font-medium
                 text-slate-900 dark:text-white"
        >
          {{ label() }}
        </span>

        @if (description()) {
          <span
            [id]="name() + '-description'"
            class="block text-xs leading-5
                   text-slate-500 dark:text-slate-400"
          >
            {{ description() }}
          </span>
        }
      </span>
    </label>
  `,
  host: {
    '[class]': 'classes()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckBox),
      multi: true,
    },
  ],
})
export class CheckBox implements ControlValueAccessor {
    readonly label = input.required<string>();
    readonly description = input<string>('');
    readonly name = input<string>('');
    readonly disabled = input<boolean>(false);
    readonly clientClass = input<string>('', { alias: 'class' });

    protected readonly checked = signal(false);
    private readonly formDisabled = signal(false);

    protected readonly isDisabled = computed(
        () => this.disabled() || this.formDisabled(),
    );

    protected readonly classes = computed(() => {
        return [
        'block',
        this.isDisabled() ? 'opacity-50' : '',
        this.clientClass(),
        ]
        .filter(Boolean)
        .join(' ');
    });

    private onChange: (checked: boolean) => void = () => {};
    protected onTouched: () => void = () => {};

    protected onCheckedChange(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        this.checked.set(checked);
        this.onChange(checked);
    }

    writeValue(value: boolean | null | undefined): void {
        this.checked.set(value ?? false);
    }

    registerOnChange(
        onChange: (checked: boolean) => void,
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