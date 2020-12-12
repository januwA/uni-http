/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
export declare abstract class UniHttpInterceptors {
    /**
     * 发送前拦截一次
     * @param options  IUniHttpConfig
     */
    abstract request(options: IUniHttpConfig): IUniHttpConfig;
    /**
     * 在success拦截一次
     */
    abstract success(result: UniApp.RequestSuccessCallbackResult): UniApp.RequestSuccessCallbackResult;
    /**
     * 在fail拦截一次
     */
    abstract fail(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
    /**
     * 在complete拦截一次
     */
    abstract complete(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
}
/**
 * 在h5上跨域，你可能需要设置一个拦截器
 * 这只是一个简单的配置，您可能需要和你设置的proxy相配合
 */
export declare class KH5CrossInterceptor extends UniHttpInterceptors {
    request(options: IUniHttpConfig): IUniHttpConfig;
    success(result: UniApp.RequestSuccessCallbackResult): UniApp.RequestSuccessCallbackResult;
    fail(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
    complete(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
}
