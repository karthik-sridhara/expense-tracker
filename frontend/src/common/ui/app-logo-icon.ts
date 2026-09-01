import { Component, input } from '@angular/core';
import { SvgIcon } from './svg-icon';

@Component({
  imports: [SvgIcon],
  selector: 'app-logo-icon',
  template: `
    <span class="relative flex items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary-900/20"
    [class]="sizeClass()"
    >
      <ui-svg-icon
        src="/icons/app_logo.svg"
        class="text-white"
        [class]="iconSizeClass()"
      />
      <span class="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-secondary-500"></span>
    </span>
  `
})
export class AppLogoIcon {
  sizeClass = input<string>('h-10 w-10');
  iconSizeClass = input<string>('h-6 w-6');
}
