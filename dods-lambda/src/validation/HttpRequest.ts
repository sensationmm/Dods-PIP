export type HttpMethod = "GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT" | "OPTIONS" | "TRACE" | "CONNECT";

export interface HttpRequest {
    /**
     * HTTP request method used to invoke this function.
     */
    method: HttpMethod | null;
    /**
     * Request URL.
     */
    url: string;
    /**
     * HTTP request headers.
     */
    headers: Record<string, any>;
    rawHeaders: Record<string, any>;
    /**
     * Query string parameter keys and values from the URL.
     */
    query: Record<string, any>;
    /**
     * Route parameter keys and values.
     */
    params: Record<string, any>;
    /**
     * The HTTP request body.
     */
    body?: any;
    /**
     * The HTTP request body as a UTF-8 string.
     */
    rawBody?: any;
}