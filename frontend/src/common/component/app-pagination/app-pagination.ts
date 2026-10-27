import { Component, computed, input, output } from '@angular/core';
import { Button } from '../../ui/button';
import { AppSelect } from '../../ui/select';

export interface PaginationChange {
    page: number;
    size: number;
}

@Component({
    selector: 'app-pagination',
    imports: [Button, AppSelect],
    templateUrl: './app-pagination.html',
})
export class AppPagination {
    readonly page = input.required<number>();
    readonly size = input.required<number>();
    readonly totalElements = input.required<number>();
    readonly totalPages = input.required<number>();
    readonly pageSizeOptions = input<number[]>([10, 20, 50]);

    readonly paginationChange = output<PaginationChange>();

    readonly firstItem = computed(() =>
        this.totalElements() === 0 ? 0 : this.page() * this.size() + 1
    );

    readonly lastItem = computed(() =>
        Math.min((this.page() + 1) * this.size(), this.totalElements())
    );

    readonly isFirstPage = computed(() => this.page() === 0);
    readonly isLastPage = computed(() =>
        this.totalPages() === 0 || this.page() >= this.totalPages() - 1
    );

    readonly pageItems = computed<(number | null)[]>(() => {
        const totalPages = this.totalPages();
        const currentPage = this.page() + 1;

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, null, totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                null,
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages];
    });

    goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages() || page === this.page()) {
            return;
        }

        this.paginationChange.emit({ page, size: this.size() });
    }

    changePageSize(event: Event): void {
        const size = Number((event.target as HTMLSelectElement).value);
        this.paginationChange.emit({ page: 0, size });
    }
}