import { Component } from '@angular/core';
import { AppLogoIcon } from "./app-logo-icon";

@Component({
  imports: [AppLogoIcon],
  selector: 'app-logo',
  template: `
    <a 
      aria-label="Expense Tracker Logo" 
      class="flex items-center gap-3"
    >
      <app-logo-icon/>
      <span class="flex justify-center text-center">
        <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Expense<span class="text-primary-600">Tracker</span>
        </span>
      </span>
    </a>
  `
})
export class AppLogo {}
