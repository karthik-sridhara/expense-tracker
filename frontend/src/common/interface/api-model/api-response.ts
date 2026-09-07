export interface ApiResponse<T> {
    data:T 
    info: string,
    message: string,
    timestamp: string,
    warnings:string
}