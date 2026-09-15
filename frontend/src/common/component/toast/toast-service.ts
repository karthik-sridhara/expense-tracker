import { Inject, Injectable, signal } from "@angular/core";
import { RUNTIME_APP_CONFIG, RuntimeAppConfig } from "../../interface/api-model/runtime-app-config";
import { AppToast } from "../../interface/app/app-toast";
import { ToastType } from "../../enum/dialog";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    readonly toasts = signal<AppToast[]>([]);

    constructor(
        @Inject(RUNTIME_APP_CONFIG)
        private readonly runtimeAppConfig: RuntimeAppConfig
    ) {}

    private show(
        message: string, 
        type: ToastType,
        duration?: number, 
        dismissible?: boolean
    ): void {
        const resolvedDuration = duration ?? this.runtimeAppConfig.toast.duration;
        const resolvedDismissible = dismissible ?? this.runtimeAppConfig.toast.dismissible;

        const toast: AppToast = {
            id: crypto.randomUUID(),
            message,
            type,
            duration: resolvedDuration,
            dismissible: resolvedDismissible,
            timer: null
        };

        this.toasts.update((items) => [toast, ...items]);

        toast.timer = setTimeout(() => {
            this.dismiss(toast.id);
        }, resolvedDuration);
    }

    dismiss(id: AppToast["id"]): void {
        const toast = this.toasts().find((item) => item.id === id);

        if (toast?.timer) {
            clearTimeout(toast.timer);
        }

        this.toasts.update((items) => items.filter((item) => item.id !== id));
    }

    showSuccess(message: string, duration?: number): void {
        this.show(message,ToastType.SUCCESS, duration);
    }

    showError(message: string, duration?: number): void {
        this.show(message, ToastType.ERROR, duration);
    }

    showInfo(message: string, duration?: number): void {
        this.show(message, ToastType.INFO, duration);
    }

    showWarning(message: string, duration?: number): void {
        this.show(message, ToastType.WARNING, duration);
    }
}