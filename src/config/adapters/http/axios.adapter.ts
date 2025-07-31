import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";

export interface Options {
    baseURL: string;
    params: Record<string, string>;
}

export class AxiosAdapter implements HttpAdapter {

    private axiosInstance: AxiosInstance;

    constructor(options: Options) {
        this.axiosInstance = axios.create({
            baseURL: options.baseURL,
            params: options.params
        });
    }

    async post<T>(url: string, body?: any, options?: Record<string, unknown>): Promise<T> {
        try {
            const { data } = await this.axiosInstance.post<T>(url, body, options);
            return data;
        } catch (error) {
            throw new Error(`Error fetching post: ${url}`);
        }
    }

    async put<T>(url: string, body: any): Promise<T> {
        try {
            const { data } = await this.axiosInstance.put<T>(url, body);
            return data;
        } catch (error) {
            throw new Error(`Error fetching put: ${url}`);
        }
    }

    async patch<T>(url: string, body: any): Promise<T> {
        try {
            const { data } = await this.axiosInstance.patch<T>(url, body);
            return data;
        } catch (error) {
            throw new Error(`Error fetching patch: ${url}`);
        }
    }

    async delete<T>(url: string, body: any): Promise<T> {
        try {
            const { data } = await this.axiosInstance.delete<T>(url, body);
            return data;
        } catch (error) {
            throw new Error(`Error fetching delete: ${url}`);
        }
    }


    async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {

        try {
            const { data } = await this.axiosInstance.get<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error fetching get: ${url}`);
        }
    }

}