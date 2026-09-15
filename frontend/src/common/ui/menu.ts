import { AfterViewInit, Component, ElementRef, input, OnDestroy, output, Signal, ViewChild } from "@angular/core";
import { Button, ButtonSize, ButtonVariant, IconPosition } from "./button";

export interface UiMenuItem {
    text: string;
    icon: string | null;
    onClick: () => void;
    disabled?: Signal<boolean>;
}

@Component({
    selector: 'ui-menu',
    imports: [Button],
    template: `
        <button
            #menuToggleButton
            uiButton
            type="button"
            aria-haspopup="menu"
            [icon]="buttonIcon()"
            [iconPosition]="buttonIconPosition()"
            [iconClass]="buttonIconClass()"
            [variant]="buttonVariant()"
            [size]="buttonSize()"
            [color]="buttonColor()"
            [class]="buttonClass()"
            (click)="toggleMenu()"
        >
            <ng-content [select]="buttonContent" ></ng-content>
        </button>
       <div #menuPopover popover="auto" class="
            fixed m-0 p-1 max-h-96 min-w-40 max-w-[calc(100vw-1rem)] overflow-y-auto
            bg-white  text-slate-700  dark:bg-slate-900 dark:text-slate-200
            rounded-md border border-slate-200 dark:border-slate-700 shadow-lg
        ">
            <ul role="menu" class="m-0 grid list-none gap-0.5 p-0">
                @for (item of menuItems(); track $index) {
                    <li role="none">
                        <button
                            uiButton
                            role="menuitem"
                            type="button"
                            class="w-full justify-start! ps-0! whitespace-nowrap"
                            [icon]="item.icon"
                            [iconPosition]="menuItemIconPosition()"
                            variant="ghost"
                            [size]="menuItemSize()"
                            [color]="menuItemColor()"
                            [disabled]="item.disabled?.() ?? false"
                            (click)="selectItem(item)"
                        >
                            {{ item.text }}
                        </button>
                    </li>
                }
            </ul>
        </div>
    `
})
export class UiMenu implements AfterViewInit, OnDestroy {
    readonly buttonVariant = input<ButtonVariant>('ghost');
	readonly buttonSize = input<ButtonSize>('sm');
	readonly buttonIcon = input<string | null>(null);
	readonly buttonIconPosition = input<IconPosition>('prefix');
	readonly buttonIconClass = input<string>();
	readonly buttonColor = input<string>('primary');
    readonly buttonClass = input<string>('');

	readonly menuItemSize = input<ButtonSize>('sm');
	readonly menuItemIconPosition = input<IconPosition>('prefix');
	readonly menuItemColor = input<string>('default');
    readonly menuItemClass = input<string>('');
    readonly menuItems = input.required<UiMenuItem[]>();


    @ViewChild('menuToggleButton', { read: ElementRef })
    menuButton!: ElementRef<HTMLButtonElement>;

    @ViewChild('menuPopover', { read: ElementRef })
    menuPopover!: ElementRef<HTMLElement>;

    private readonly handleViewportChange = (): void => {
        const popover = this.menuPopover.nativeElement;

        if (!popover.matches(':popover-open')) {
            return;
        }

        const buttonRect = this.menuButton.nativeElement.getBoundingClientRect();
        const buttonIsOutsideViewport =
            buttonRect.bottom <= 0 ||
            buttonRect.top >= window.innerHeight ||
            buttonRect.right <= 0 ||
            buttonRect.left >= window.innerWidth;

        if (buttonIsOutsideViewport) {
            popover.hidePopover();
            return;
        }

        this.positionPopover();
    };

    ngAfterViewInit(): void {
        document.addEventListener('scroll', this.handleViewportChange, true);
        window.addEventListener('resize', this.handleViewportChange);
    }

    ngOnDestroy(): void {
        document.removeEventListener('scroll', this.handleViewportChange, true);
        window.removeEventListener('resize', this.handleViewportChange);
    }
    toggleMenu(): void {
        const popover = this.menuPopover.nativeElement;

        if (popover.matches(':popover-open')) {
            popover.hidePopover();
        } else {
            popover.showPopover();
            this.positionPopover();
        }
    }

    selectItem(item: UiMenuItem): void {
        if (item.disabled?.()) {
            return;
        }

        item.onClick();
        this.menuPopover.nativeElement.hidePopover();
    }

    private positionPopover(): void {
        const popover = this.menuPopover.nativeElement;
        const buttonRect =
            this.menuButton.nativeElement.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const gap = 4;
        const pagePadding = 8;

        const left = Math.min(
            buttonRect.left,
            window.innerWidth - popoverRect.width - pagePadding
        );

        const top = Math.min(
            buttonRect.bottom + gap,
            window.innerHeight - popoverRect.height - pagePadding
        );

        popover.style.left = `${Math.max(pagePadding, left)}px`;
        popover.style.top = `${Math.max(pagePadding, top)}px`;
    }

}