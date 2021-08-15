/// <reference types="@dcloudio/types/uni-app" />
import { UniAbortController } from "./abort-controller";
import { UniHttpInterceptors } from "./interceptors";
export interface IUniHttpConfig {
    baseURL?: string;
    url?: string;
    method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
    data?: AnyObject;
    params?: AnyObject;
    header?: AnyObject;
    filePath?: string;
    name?: string;
    fileType?: "image" | "video" | "audio";
    file?: File;
    files?: UniApp.UploadFileOptionFiles[];
    timeout?: number;
    dataType?: string;
    responseType?: string;
    sslVerify?: boolean;
    withCredentials?: boolean;
    firstIpv4?: boolean;
    success?: (result: UniApp.RequestSuccessCallbackResult) => void;
    fail?: (result: UniApp.GeneralCallbackResult) => void;
    complete?: (result: UniApp.GeneralCallbackResult) => void;
    abortController?: UniAbortController;
    offHeadersReceived?: (result: any) => void;
    onHeadersReceived?: (result: any) => void;
    onProgressUpdate?: (result: UniApp.OnProgressUpdateResult) => void;
    offProgressUpdate?: (result: any) => void;
    interceptors?: UniHttpInterceptors[];
    cancel?: boolean;
}
//# sourceMappingURL=http-config.d.ts.map