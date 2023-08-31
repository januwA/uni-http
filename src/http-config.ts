import { UniAbortController } from "./abort-controller";
import { UniHttpInterceptors } from "./interceptors";

export interface IUniHttpConfig {
  /**
   * 自定义request方式，不使用默认的 uni.request 和 uni.uploadFile
   * 
   * 可以根据 url 和 options 发送请求
   * 
   * 然后必须调用 success，fail，complete 三个回调函数
   * 
   */
  requestFunc?: (
    url: string,
    options: IUniHttpConfig,
    success: (result: any) => Promise<void>,
    fail: (result: any) => Promise<void>,
    complete: (result: any) => Promise<void>
  ) => void;

  baseURL?: string;
  url?: string;

  /**
   * method 有效值
   *
   * ! https://uniapp.dcloud.net.cn/api/request/request
   */
  method?:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";

  /**
   * post data
   *
   * ! App（自定义组件编译模式）不支持ArrayBuffer类型
   */
  data?: AnyObject;

  /**
   * query 参数
   */
  params?: AnyObject;

  /**
   * 设置请求的 header，header 中不能设置 Referer。
   *
   * ! App、H5端会自动带上cookie，且H5端不可手动修改
   */
  header?: AnyObject;

  /**
   * 发送文件路径
   */
  filePath?: string;

  /**
   * 发送文件时的name
   */
  name?: string;

  /**
   * 文件类型，image/video/audio，仅支付宝小程序，且必填。
   * - image: 图像
   * - video: 视频
   * - audio: 音频
   */
  fileType?: "image" | "video" | "audio";

  /**
   * ! 仅H5（2.6.15+）支持
   * 要上传的文件对象
   */
  file?: File;

  /**
   * ! 要上传的文件对象，仅H5（2.6.15+）支持
   */
  files?: UniApp.UploadFileOptionFiles[];

  /**
   * 超时时间，单位 ms
   *
   * ! H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
   */
  timeout?: number;

  /**
   * 如果设为 json，会尝试对返回的数据做一次 JSON.parse
   */
  dataType?: string;

  /**
   * 设置响应的数据类型。合法值：text、arraybuffer
   *
   * ! 支付宝小程序不支持
   */
  responseType?: string;

  /**
   * 验证 ssl 证书
   *
   * ! 仅App安卓端支持（HBuilderX 2.3.3+）
   */
  sslVerify?: boolean;

  /**
   * 跨域请求时是否携带凭证（cookies）
   *
   * ! 仅H5支持（HBuilderX 2.6.15+）
   */
  withCredentials?: boolean;

  /**
   * DNS解析时优先使用 ipv4
   *
   * ! 仅 App-Android 支持 (HBuilderX 2.8.0+)
   */
  firstIpv4?: boolean;

  /**
   * 收到开发者服务器成功返回的回调函数
   */
  success?: (result: UniApp.RequestSuccessCallbackResult) => void;

  /**
   * 接口调用失败的回调函数
   */
  fail?: (result: UniApp.GeneralCallbackResult) => void;

  /**
   * 接口调用结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (result: UniApp.GeneralCallbackResult) => void;

  /**
   * 中断请求
   */
  abortController?: UniAbortController;

  /**
   * 取消监听 HTTP Response Header 事件，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.offHeadersReceived.html)
   */
  offHeadersReceived?: (result: any) => void;

  /**
   * 监听 HTTP Response Header 事件。会比请求完成事件更早，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.onHeadersReceived.html)
   */
  onHeadersReceived?: (result: any) => void;

  /***
   *
   * uploadFile: 监听上传进度变化
   */
  onProgressUpdate?: (result: UniApp.OnProgressUpdateResult) => void;

  /**
   * 取消监听下载进度变化事件，仅微信小程序平台支持，[规范详情](https://developers.weixin.qq.com/miniprogram/dev/api/network/download/DownloadTask.offProgressUpdate.html)
   */
  offProgressUpdate?: (result: any) => void;

  /**
   * 拦截器列表
   */
  interceptors?: UniHttpInterceptors[];

  /**
   * 将[cancel]设置为true，网络请求将不会发送
   *
   * 在option中将cancel设置为true，但是没有设置拦截器，将不会触发
   *
   * 其中一个拦截器将cancel设置为true，那么接下来的拦截器也不会触发
   *
   * ! 检查cancel只会在拦截器的request中，如果cancel===true
   * ! 那么会直接调用拦截器的fail和complete
   * ! { errMsg: "request:fail cancel" }
   */
  cancel?: boolean;
}
