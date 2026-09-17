import { Component, computed, input } from '@angular/core';
import { SvgIcon } from './svg-icon';
import { NgTemplateOutlet } from '@angular/common';

export type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'prefix' | 'suffix';

export enum ButtonColor {
	DEFAULT = 'default',
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error'
}

@Component({
	selector: 'button[uiButton], a[uiButton]',
	standalone: true,
	imports: [SvgIcon,NgTemplateOutlet],
	template: `
		<ng-template #iconTemplate>
			<ui-svg-icon 
				id="button-icon"
				class="h-full p-2" 
				[src]="icon()!" 
				[class]="iconClass()" 
			/>
		</ng-template>
		@if(icon() && iconPosition() === 'prefix') {
			<ng-container *ngTemplateOutlet="iconTemplate"></ng-container>
		}
		<ng-content />
		@if(icon() && iconPosition() === 'suffix') {
			<ng-container *ngTemplateOutlet="iconTemplate"></ng-container>
		}
	`,
	host: {
		'[class]': 'classes()',
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
		outline: 'border bg-transparent focus:inset-ring-1',
		ghost: 'bg-transparent',
		link: 'bg-transparent underline-offset-4  hover:underline',
	};
	
	private readonly sizeClasses: Record<ButtonSize, string> = {
		sm: 'h-9 px-3  text-sm',
		md: 'h-10 px-4  text-base',
		lg: 'h-11 px-8  text-lg'
	};


	private readonly colorClasses: Record<ButtonColor, Record<ButtonVariant, string>> = {
		default: {
		filled:
			'bg-slate-900 text-white hover:bg-slate-800 focus:outline-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
		outline:
			'border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800',
		ghost:
			'text-slate-600 hover:bg-slate-200 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white',
		link:
			'text-slate-900 hover:text-slate-950 dark:text-white dark:hover:text-slate-300',
		},
		primary: {
		filled:
			'bg-primary-600 hover:bg-primary-700 focus:outline-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400',
		outline:
			'border-primary-600 text-primary-700 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-300 dark:bg-slate-800 dark:hover:bg-primary-950',
		ghost:
			'text-primary-700 hover:bg-primary-100 hover:text-primary-900 dark:bg-slate-800 dark:text-primary-300 dark:hover:bg-primary-900 dark:hover:text-primary-100',
		link:
			'text-primary-700 focus:text-primary-900 dark:text-primary-300 dark:focus:text-primary-100',
		},
		secondary: {
		filled:
			'bg-secondary-400 hover:bg-secondary-500 focus:outline-secondary-500 dark:bg-secondary-500 dark:hover:bg-secondary-600',
		outline:
			'border-secondary-400 text-secondary-500 hover:bg-secondary-50 dark:border-secondary-400 dark:text-secondary-300 dark:hover:bg-secondary-950',
		ghost:
			'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-900 dark:hover:text-secondary-100',
		link:
			'text-secondary-500 focus:text-secondary-600 dark:text-secondary-300 dark:focus:text-secondary-200',
		},
		info: {
		filled:
			'bg-blue-600 hover:bg-blue-700 focus:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400',
		outline:
			'border-blue-600 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950',
		ghost:
			'text-blue-700 hover:bg-blue-100 hover:text-blue-900 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-100',
		link:
			'text-blue-700 focus:text-blue-900 dark:text-blue-300 dark:focus:text-blue-100',
		},
		warning: {
		filled:
			'bg-orange-500 hover:bg-orange-600 focus:outline-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400',
		outline:
			'border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-950',
		ghost:
			'text-orange-700 hover:bg-orange-100 hover:text-orange-900 dark:text-orange-300 dark:hover:bg-orange-900 dark:hover:text-orange-100',
		link:
			'text-orange-700 focus:text-orange-900 dark:text-orange-300 dark:focus:text-orange-100',
		},
		error: {
		filled:
			'bg-red-600 hover:bg-red-700 focus:outline-red-500 dark:bg-red-500 dark:hover:bg-red-400',
		outline:
			'border-red-600 text-red-700 hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950',
		ghost:
			'text-red-700 hover:bg-red-100 hover:text-red-900 dark:text-red-300 dark:hover:bg-red-900 dark:hover:text-red-100',
		link:
			'text-red-700 focus:text-red-900 dark:text-red-300 dark:focus:text-red-100',
		},
	};

	classes = computed(() => {
		const colorClass = this.colorClasses.hasOwnProperty(this.color()) ? this.colorClasses[this.color() as ButtonColor][this.variant()] : this.color();

		return [
			this.baseClasses,
			this.variantClasses[this.variant()],
			colorClass,
			this.sizeClasses[this.size()],
		].join(' ');
	});

}
