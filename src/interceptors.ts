import { IUniHttpConfig } from "./http-config";

type OrPromise<T> = T | Promise<T>;
type C = IUniHttpConfig;
type RSCR = UniApp.RequestSuccessCallbackResult;
type GCR = UniApp.GeneralCallbackResult;

export interface UniHttpInterceptors {
  /**
   * 发送前拦截
   */
  request?: (options: C) => void;

  /**
   * 在success拦截
   */
  success?: (result: RSCR, options: C) => OrPromise<RSCR>;

  /**
   * 在fail拦截
   */
  fail?: (result: GCR, options: C) => void;

  /**
   * 在complete拦截
   */
  complete?: (result: GCR, options: C) => void;
}
