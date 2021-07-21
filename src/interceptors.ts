import { IUniHttpConfig } from "./http-config";

export abstract class UniHttpInterceptors {
  /**
   * 发送前拦截
   * @param options  IUniHttpConfig
   */
  abstract request(options: IUniHttpConfig): IUniHttpConfig;

  /**
   * 在success拦截
   */
  abstract success(
    result: UniApp.RequestSuccessCallbackResult
  ): UniApp.RequestSuccessCallbackResult;

  /**
   * 在fail拦截
   */
  abstract fail(
    result: UniApp.GeneralCallbackResult
  ): UniApp.GeneralCallbackResult;

  /**
   * 在complete拦截
   */
  abstract complete(
    result: UniApp.GeneralCallbackResult
  ): UniApp.GeneralCallbackResult;
}