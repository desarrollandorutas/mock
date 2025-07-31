export abstract class HttpAdapter {
    abstract get<T>(url: string, options?: Record<string, unknown>): Promise<T>;
    abstract post<T>(url: string, body: any, options?: Record<string, unknown>): Promise<T>;
    abstract put<T>(url: string, body: any): Promise<T>;
    abstract patch<T>(url: string, body: any): Promise<T>;
    abstract delete<T>(url: string, body: any): Promise<T>; //validar
}