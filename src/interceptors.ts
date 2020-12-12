import { IUniHttpConfig } from "./http-config";

export abstract class UniHttpInterceptors {
  /**
   * 发送前拦截一次
   * @param options  IUniHttpConfig
   */
  abstract request(options: IUniHttpConfig): IUniHttpConfig;

  /**
   * 在success拦截一次
   */
  abstract success(
    result: UniApp.RequestSuccessCallbackResult
  ): UniApp.RequestSuccessCallbackResult;

  /**
   * 在fail拦截一次
   */
  abstract fail(
    result: UniApp.GeneralCallbackResult
  ): UniApp.GeneralCallbackResult;

  /**
   * 在complete拦截一次
   */
  abstract complete(
    result: UniApp.GeneralCallbackResult
  ): UniApp.GeneralCallbackResult;
}

/**
 * 在h5上跨域，你可能需要设置一个拦截器
 * 这只是一个简单的配置，您可能需要和你设置的proxy相配合
 */
export class KH5CrossInterceptor extends UniHttpInterceptors {
  request(options: IUniHttpConfig): IUniHttpConfig {
    // #ifdef H5
    if (process.env.NODE_ENV === "development") options.baseURL = "";
    // #endif
    return options;
  }
  success(
    result: UniApp.RequestSuccessCallbackResult
  ): UniApp.RequestSuccessCallbackResult {
    return result;
  }
  fail(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult {
    return result;
  }
  complete(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult {
    return result;
  }
}
