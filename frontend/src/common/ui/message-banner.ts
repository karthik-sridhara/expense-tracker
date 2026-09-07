import { Component, computed, input } from "@angular/core";
import { SvgIcon } from "./svg-icon";

export enum MessageBannerType {
    Info = "info",
    Success = "success",
    Warning = "warning",
    Error = "error"
}

@Component({
    selector: "ui-message-banner",
    imports: [SvgIcon],
    template: `
        <div 
            class="px-3 py-2 flex items-center gap-2 h-full w-full rounded-md" role="alert"
            [class]="getCssClasses()"
        >
            <ui-svg-icon [src]="getIconSrc()" class="h-full"/>
            <p 
                class="h-full overflow-hidden text-ellipsis whitespace-nowrap"
                [title]="text()"
            >
                {{text()}}
            </p>
        </div>
    `
})
export class MessageBanner {

    readonly text = input.required<string>();
    readonly type = input<MessageBannerType>(MessageBannerType.Info);

    private readonly cssMap = {
        [MessageBannerType.Info]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        [MessageBannerType.Success]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        [MessageBannerType.Warning]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        [MessageBannerType.Error]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };


    protected getIconSrc = computed(() => {
        switch (this.type()) {
            case MessageBannerType.Info:
                return "/icons/info.svg";
            case MessageBannerType.Success:
                return "/icons/success.svg";
            case MessageBannerType.Warning:
                return "/icons/warning.svg";
            case MessageBannerType.Error:
                return "/icons/error.svg";
            default:
                return "/icons/info.svg";
        }
    });

    protected getCssClasses = computed(() => {
        return this.cssMap[this.type()] || this.cssMap[MessageBannerType.Info];
    });

}