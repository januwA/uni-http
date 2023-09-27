import { IUniHttpConfig } from "./http-config";
export declare class UniHttp<T = any> {
    readonly config: IUniHttpConfig;
    static create(config?: IUniHttpConfig): UniHttp;
    constructor(config?: IUniHttpConfig);
    request(options: IUniHttpConfig): Promise<T>;
    private _request;
    get(url: string, options?: IUniHttpConfig): Promise<T>;
    get(options: IUniHttpConfig): Promise<T>;
    post(url: string, options?: IUniHttpConfig): Promise<T>;
    post(options: IUniHttpConfig): Promise<T>;
    put(url: string, options?: IUniHttpConfig): Promise<T>;
    put(options: IUniHttpConfig): Promise<T>;
    delete(url: string, options?: IUniHttpConfig): Promise<T>;
    delete(options: IUniHttpConfig): Promise<T>;
    options(url: string, options?: IUniHttpConfig): Promise<T>;
    options(options: IUniHttpConfig): Promise<T>;
    head(url: string, options?: IUniHttpConfig): Promise<T>;
    head(options: IUniHttpConfig): Promise<T>;
    reace(url: string, options?: IUniHttpConfig): Promise<T>;
    reace(options: IUniHttpConfig): Promise<T>;
    connect(url: string, options?: IUniHttpConfig): Promise<T>;
    connect(options: IUniHttpConfig): Promise<T>;
}
//# sourceMappingURL=uni-http.d.ts.map