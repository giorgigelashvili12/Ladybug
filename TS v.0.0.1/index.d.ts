declare module 'ladybug' {
    export interface LadybugReqConfig {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        data?: any;
        timeout?: AbortSignal;
        onProgress?: (event: ProgressEvent) => void;
        stream?: boolean;
        csrfToken?: string;
    } 

    export interface LadybugRes<T = any> {
        data: T;
        status: number;
        statusText: string;
        headers: Record<string, string>;
        config: LadybugReqConfig;
        req?: any;
    }

    export interface LadybugErr<T = any> extends Error {
        config: LadybugReqConfig;
        code?: string;
        req?: any;
        res?: LadybugRes<T>;
        isLadybugErr: boolean;
        toJSON: () => object;
    }

    export class Ladybug {
        constructor(config?: LadybugReqConfig);
        req<T = any>(config: LadybugReqConfig): Promise<LadybugRes<T>>;
        get<T = any>(url: string, config?: LadybugReqConfig): Promise<LadybugRes<T>>;
        post<T = any>(url: string, data?: any, config?:LadybugReqConfig): Promise<LadybugRes<T>>;
        put<T = any>(url: string,data?: any, config?: LadybugReqConfig): Promise<LadybugRes<T>>;
        delete<T = any>(url: string, config?: LadybugReqConfig): Promise<LadybugRes<T>>;
        reqInterceptor(fulfilled: (config: LadybugReqConfig) => LadybugReqConfig | Promise<LadybugReqConfig>, rejected?: (error: any)=> any): number;
        resInterceptor(fulfilled: (response: LadybugRes) => LadybugRes | Promise<LadybugRes>, rejected?: (error: any) => any): number;
        setBaseURL(base: string): void;
        isLadybugErr(error: any): boolean;
    }

    export default Ladybug;
}