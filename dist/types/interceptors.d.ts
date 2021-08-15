/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
declare type OrPromise<T> = T | Promise<T>;
declare type C = IUniHttpConfig;
declare type RSCR = UniApp.RequestSuccessCallbackResult;
declare type GCR = UniApp.GeneralCallbackResult;
export interface UniHttpInterceptors {
    request?: (options: C) => void;
    success?: (result: RSCR, options: C) => OrPromise<RSCR>;
    fail?: (result: GCR, options: C) => void;
    complete?: (result: GCR, options: C) => void;
}
export {};
//# sourceMappingURL=interceptors.d.ts.map