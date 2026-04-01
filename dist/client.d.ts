export declare function authenticate(): Promise<string>;
export declare function clearToken(): void;
export declare function diadocGet(path: string, params?: Record<string, string>): Promise<unknown>;
export declare function diadocPost(path: string, body: unknown, params?: Record<string, string>): Promise<unknown>;
