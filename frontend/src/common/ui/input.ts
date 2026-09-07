import { Component, computed, forwardRef, input, model, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SvgIcon } from "./svg-icon";

@Component({
    selector: 'ui-input',
    imports: [SvgIcon],
    styles:[`
        :host {
            display: block;
        }
        :host(.ng-invalid.ng-touched) {
            outline-color: #dc2626 !important;
            outline-width: 2px !important;
        }
    `],
    template: `
        <div class="flex items-center gap-2 h-full">
            @if (icon() && iconPosition()=="prefix") {
                <ui-svg-icon [src]="icon()!" class="h-full p-2" [class]="iconClass()"/>
            }
            <input
                class="w-full h-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed"
                [type]="type()"
                [placeholder]="placeholder()"
                [disabled]="isDisabled()"
                [readOnly]="readonly()"
                [required]="required()"
                [name]="name()"
                [id]="name()"
                [autocomplete]="autocomplete()"
                [value]="value() ?? ''"
                (input)="onInput($event)"
                (blur)="onTouched()"
            />
            @if (icon() && iconPosition()=="suffix") {
                <ui-svg-icon [src]="icon()!" class="h-full p-2" [class]="iconClass()"/>
            }
        </div>
    `,
    host: {
        '[class]': 'classes'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => Input),
            multi: true,
        },
    ],
})
export class Input implements ControlValueAccessor {
    readonly icon = input<string|null>(null);
    readonly iconPosition = input<'prefix'|'suffix'>("suffix");
    readonly iconClass = input<string>('text-slate-400 dark:text-slate-500');
    readonly type = input<string>('text');
    readonly placeholder = input<string>('');
    readonly disabled = input<boolean>(false);
    readonly readonly = input<boolean>(false);
    readonly required = input<boolean>(false);
    readonly name = input<string>('');
    readonly autocomplete = input<string | null>(null);
    readonly value = model<string | null>(null);
    readonly height = input<string>('h-10 px-3');
    readonly border = input<string>('bg-white dark:bg-slate-800 outline-1 outline-gray-300 dark:outline-slate-600 rounded-md transition-colors focus-within:outline-2 focus-within:outline-primary-500');
    private disabledClasses = "opacity-50 cursor-not-allowed";

    // Set via ControlValueAccessor#setDisabledState when bound to a disabled FormControl.
    private readonly formDisabled = signal(false);
    readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

    private onChange: (value: string | null) => void = () => {};
    onTouched: () => void = () => {};

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
        this.onChange(value);
    }

    // ControlValueAccessor implementation - lets ui-input work with both
    // FormsModule ([(ngModel)]) and ReactiveFormsModule (formControlName/[formControl]).
    writeValue(value: string | null): void {
        this.value.set(value);
    }

    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.formDisabled.set(isDisabled);
    }

    get classes(){
        let classes = `${this.height()} ${this.border()}`;
        if(this.isDisabled()){
            classes += ` ${this.disabledClasses}`;
        }
        return classes;
    }

}