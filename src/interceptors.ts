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