export type RequestOutput<T = any> = {
    success: boolean;
    data: T;
    error?: any;
}