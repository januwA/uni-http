/// <reference types="@dcloudio/types/uni-app" />
/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
export declare class UniHttp {
    readonly config: IUniHttpConfig;
    static create(config?: IUniHttpConfig): UniHttp;
    constructor(config?: IUniHttpConfig);
    request(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    private _request;
    get(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    get(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    post(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    post(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    put(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    put(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    delete(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    delete(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    options(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    options(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    head(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    head(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    reace(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    reace(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    connect(url: string, options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
    connect(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
}
//# sourceMappingURL=uni-http.d.ts.map