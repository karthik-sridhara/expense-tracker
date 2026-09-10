import { Component, computed, forwardRef, input, model, output, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SvgIcon } from "./svg-icon";
import { Button } from "./button";
import { NgTemplateOutlet } from "@angular/common";

@Component({
    selector: 'ui-input',
    imports: [SvgIcon,Button,NgTemplateOutlet],
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
        <ng-template #iconTemplate>
			<ui-svg-icon [src]="icon()!" id="input-icon" class="h-full p-2" [class]="iconClass()"/>
		</ng-template>
        <div class="flex items-center h-full">
            @if (icon() && iconPosition()=="prefix") {
                <ng-container *ngTemplateOutlet="iconTemplate"></ng-container>
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
                <ng-container *ngTemplateOutlet="iconTemplate"></ng-container>
            }
            @if(actionIcon()) {
                <button
                    uiButton
                    class="h-full w-8 shrink-0 p-0!"
                    type="button"
                    variant="link"
                    size="sm"
                    [color]="actionButtonClass()"
                    [icon]="actionIcon()!"
                    iconClass="h-full w-5 p-0!"
                    (click)="action.emit(true)"
                ></button>
            }
        </div>
    `,
    host: {
        '[class]': 'classes()'
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
    readonly actionIcon = input<string | null>(null);
    readonly action = output<boolean>();
    readonly actionButtonClass = input(
        'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 '
    );
    readonly clientClass = input<string>('', { alias: 'class' });

    private defaultClasess = ('h-10 px-3 bg-white dark:bg-slate-800 outline-1 outline-gray-300 dark:outline-slate-600 rounded-md transition-colors focus-within:outline-2 focus-within:outline-primary-500');
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

    
    readonly classes = computed(() => {
        const parts = [
            this.defaultClasess,
            this.isDisabled() ? this.disabledClasses : '',
            this.clientClass(),
        ].filter(Boolean);

        return parts.join(' ');
    });

}