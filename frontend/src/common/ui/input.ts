import { Component, input, model  } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SvgIcon } from "./svg-icon";

@Component({
    selector: 'ui-input',
    imports: [SvgIcon,FormsModule],
    styles:[`
        :host {
            display: block;
        }
    `],
    template: `
        <div class="flex items-center gap-2 h-full">
            @if (icon() && iconPosition()=="prefix") {
                <ui-svg-icon [src]="icon()!" [class]="iconSizeClass()"/>
            }
            <input
                class="w-full h-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed"
                [type]="type()"
                [placeholder]="placeholder()"
                [disabled]="disabled()"
                [readOnly]="readonly()"
                [required]="required()"
                [name]="name()"
                [autocomplete]="autocomplete()"
                [ngModel]="value()"
                (ngModelChange)="value.set($event)"
            />
            @if (icon() && iconPosition()=="suffix") {
                <ui-svg-icon [src]="icon()!" [class]="iconSizeClass()"/>
            }
        </div>
    `,
    host: {
        '[class]': 'classes'
    }
})
export class Input {
    readonly icon = input<string|null>(null);
    readonly iconPosition = input<'prefix'|'suffix'>("suffix");
    readonly iconSizeClass = input<string>('h-5 w-5 text-slate-400 dark:text-slate-500');
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

    get classes(){
        let classes = `${this.height()} ${this.border()}`;
        if(this.disabled()){
            classes += ` ${this.disabledClasses}`;
        }
        return classes;
    }

}