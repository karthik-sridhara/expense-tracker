import { Component, computed, input } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { startWith, switchMap } from "rxjs";

@Component({
    selector: 'form-control',
    imports:[],
    styles:`
        .error-message {
            font-size: 0.7rem; /* text-xs */
            line-height: 1rem; /* h-4 */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `,
    template:`
        <ng-content></ng-content>
        <p class="error-message text-red-600 h-4 w-full" [title]="errorsMessage()">
            @if(touched() && invalid()) {
                {{errorsMessage()}}
            }
        </p>
    `,
    host: {
        class: 'block'
    }
})
export class AppFormControl{
    name = input.required<string>();
    control = input.required<FormControl>();

    // Plain FormControl mutations (markAsTouched, updateValueAndValidity, etc.) don't
    // notify Angular's zoneless change detector by themselves. Bridging control.events
    // into a signal ensures this component's view actually refreshes when touched/status change.
    private readonly controlEvents = toSignal(
        toObservable(this.control).pipe(
            switchMap(control => control.events.pipe(startWith(null)))
        )
    );

    protected readonly touched = computed(() => {
        this.controlEvents();
        return this.control().touched;
    });
    protected readonly invalid = computed(() => {
        this.controlEvents();
        return this.control().invalid;
    });
    protected readonly errors = computed(() => {
        this.controlEvents();
        return this.control().errors;
    });

    protected readonly errorsMessage = computed(() => {
        this.controlEvents();
        let error = this.control().errors;
        if (!error) return ``;
        else if (error['required']) return `${this.name()} is required`;
        else if (error['email']) return `Enter a valid email address`;
        else if (error['minlength']) return `${this.name()} must be at least ${error['minlength'].requiredLength} characters long`;
        else return `Invalid value`;
    });
}