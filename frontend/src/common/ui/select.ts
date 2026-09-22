import { Component } from "@angular/core";

@Component({
    selector:'select[uiSelect]',
    template:  `<ng-content />`,
    host:{
        class:'h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md transition-colors focus:outline-none focus:border-primary-500 focus:ring-2 ring-primary-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    },
    styles:[`
        :host{
            display:block;
        }
        :host(.ng-invalid.ng-touched) {
            border-color: #dc2626;
        }
        :host(.ng-invalid.ng-touched:focus-within) {
            box-shadow: 0 0 0 2px rgb(220 38 38 / 20%);
        }      
    `]
})
export class AppSelect {

}