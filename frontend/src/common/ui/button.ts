import { Component, input } from '@angular/core';
import { SvgIcon } from './svg-icon';

type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'prefix' | 'suffix';

@Component({
	selector: 'button[uiButton], a[uiButton]',
	standalone: true,
	imports: [SvgIcon],
	template: `
		@if(icon() && iconPosition() === 'prefix') {
			<ui-svg-icon class="h-full p-2" [src]="icon()!" [class]="iconClass()" />
		}
		<ng-content />
		@if(icon() && iconPosition() === 'suffix') {
			<ui-svg-icon class="h-full p-2" [src]="icon()!" [class]="iconClass()" />
		}
	`,
	host: {
		'[class]': 'classes',
	}
})
export class Button {
	readonly variant = input<ButtonVariant>('filled');
	readonly size = input<ButtonSize>('sm');
	readonly icon = input<string | null>(null);
	readonly iconPosition = input<IconPosition>('prefix');
	readonly iconClass = input<string>();
	readonly color = input<string>('primary');

 	private readonly baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';

	private readonly variantClasses: Record<ButtonVariant, string> = {
		filled: 'text-white focus:inset-ring-1 focus:outline-2',
		outline: 'border bg-white focus:inset-ring-1',
		ghost: 'bg-transparent',
		link: 'bg-transparent underline-offset-4  hover:underline',
	};
	
	private readonly sizeClasses: Record<ButtonSize, string> = {
		sm: 'h-9 px-3  text-sm',
		md: 'h-10 px-4  text-base',
		lg: 'h-11 px-8  text-lg'
	};


	private readonly colorClasses: Record<string,Record<ButtonVariant, string>> = {
		'default': {
			filled: 'bg-slate-900 text-white hover:bg-slate-800 focus:outline-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
			outline: 'border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800',
			ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
			link: 'text-slate-900 hover:text-slate-950 dark:text-white dark:hover:text-slate-300',
		},
		'primary': {
			filled: 'bg-primary-600 hover:bg-primary-700 focus:outline-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400',
			outline: 'border-primary-600 text-primary-700 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-300 dark:bg-slate-800 dark:hover:bg-primary-950',
			ghost: 'text-primary-700 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-900  dark:bg-slate-800',
			link: 'text-primary-700 focus:text-primary-900 dark:text-primary-300 dark:focus:text-primary-100',
		},
		'secondary': {
			filled: 'bg-secondary-400 hover:bg-secondary-500 focus:outline-secondary-500 dark:bg-secondary-500 dark:hover:bg-secondary-600',
			outline: 'border-secondary-400 text-secondary-500 hover:bg-secondary-50 dark:border-secondary-400 dark:text-secondary-300 dark:hover:bg-secondary-950',
			ghost: 'text-secondary-500 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-900',
			link: 'text-secondary-500 focus:text-secondary-600 dark:text-secondary-300 dark:focus:text-secondary-200',
		}
	}

	get classes(): string {
		const colorClass = this.colorClasses.hasOwnProperty(this.color()) ? this.colorClasses[this.color()][this.variant()] : this.color();

		
		return [
			this.baseClasses,
			this.variantClasses[this.variant()],
			colorClass,
			this.sizeClasses[this.size()],
		].join(' ');
	}

}
