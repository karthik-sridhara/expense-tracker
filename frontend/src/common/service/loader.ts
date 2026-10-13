import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private readonly minimumDisplayTime = 500;

    private pendingRequests = 0;
    private shownAt = 0;
    private hideTimer: ReturnType<typeof setTimeout> | null = null;

    readonly isLoading = signal(false);

    show(): void {
        this.pendingRequests++;

        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }

        if (!this.isLoading()) {
            this.shownAt = Date.now();
            this.isLoading.set(true);
        }
    }

    hide(): void {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);

        if (this.pendingRequests > 0) {
            return;
        }

        const elapsedTime = Date.now() - this.shownAt;
        const remainingTime = Math.max(
            0,
            this.minimumDisplayTime - elapsedTime
        );

        this.hideTimer = setTimeout(() => {
            this.hideTimer = null;

            // Another request may have started during the delay.
            if (this.pendingRequests === 0) {
                this.isLoading.set(false);
            }
        }, remainingTime);
    }
}

