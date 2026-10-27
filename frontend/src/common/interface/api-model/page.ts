export interface Page<T> {
    content: T[];
    page: number;
    size: number;
    totalElement: number;
    totalPage: number;
}