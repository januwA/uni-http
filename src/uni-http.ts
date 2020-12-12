import { IUniHttpConfig } from "./http-config";
import { mergeConfig, removeHeaderContentType, urlWithParams } from "./utils";

function _uniHttp(
  options: IUniHttpConfig
): Promise<UniApp.RequestSuccessCallbackResult> {
  let _res: any, _rej: any;
  const _promise = new Promise<UniApp.RequestSuccessCallbackResult>(
    (res, rej) => {
      _res = res;
      _rej = rej;
    }
  );

  let cancel = false;
  const cancelResult = {
    errMsg: "request:fail cancel",
  };
  // request 拦截器
  if (Array.isArray(options.interceptors)) {
    for (const it of options.interceptors) {
      if (!it.request) continue;

      options = it.request(options);
      if (options.cancel === true) {
        cancel = true;
        if (it.fail) it.fail(cancelResult);
        if (it.complete) it.complete(cancelResult);
        break;
      }
    }
  }

  // cancel 直接返回，不发送请求
  if (cancel) {
    _rej(cancelResult);
    return _promise;
  }

  const url = urlWithParams(options);

  const isUpfile =
    options.filePath || options.file || (options.files && options.files.length);

  const _success = (result: UniApp.RequestSuccessCallbackResult) => {
    // success 拦截器
    options.interceptors
      ?.filter((it) => it.success)
      .forEach((it) => (result = it.success(result)));

    if (options.success) options.success(result);
    else _res(result);
  };

  const _fail = (result: UniApp.GeneralCallbackResult) => {
    // fail 拦截器
    options.interceptors
      ?.filter((it) => it.fail)
      .forEach((it) => (result = it.fail(result)));

    if (options.fail) options.fail(result);
    else _rej(result);
  };

  const _complete = (result: UniApp.GeneralCallbackResult) => {
    // compilete 拦截器
    options.interceptors
      ?.filter((it) => it.complete)
      .forEach((it) => (result = it.complete(result)));

    if (options.complete) options.complete(result);
  };

  if (isUpfile) {
    // 发送文件需要删除header中的content-type
    options.header = removeHeaderContentType(options.header ?? {});
    const task = uni.uploadFile({
      url: url,
      fileType: options.fileType,
      file: options.file,
      files: options.files,
      filePath: options.filePath,
      name: options.name,
      header: options.header,
      formData: options.data,
      success: (res) => {
        let data;
        try {
          // 避免parse解析错误
          data = JSON.parse(res.data);
        } catch (error) {
          data = res.data;
        }
        const result: UniApp.RequestSuccessCallbackResult = {
          statusCode: res.statusCode,
          header: {},
          cookies: [],
          data,
        };
        _success(result);
      },
      fail: _fail,
      complete: _complete,
    });

    options.abortController?.promise.then(() => {
      task.abort();
    });
    if (options.offHeadersReceived)
      task.offHeadersReceived(options.offHeadersReceived);
    if (options.onHeadersReceived)
      task.onHeadersReceived(options.onHeadersReceived);
    if (options.onProgressUpdate)
      task.onProgressUpdate(options.onProgressUpdate);
    if (options.offProgressUpdate)
      task.offProgressUpdate(options.offProgressUpdate);
  } else {
    const task = uni.request({
      url: url,
      data: options.data,
      header: options.header,
      method: options.method,
      timeout: options.timeout,
      dataType: options.dataType,
      responseType: options.responseType,
      sslVerify: options.sslVerify,
      withCredentials: options.withCredentials,
      firstIpv4: options.firstIpv4,
      success: _success,
      fail: _fail,
      complete: _complete,
    });

    options.abortController?.promise.then(() => {
      task.abort();
    });

    if (options.offHeadersReceived)
      task.offHeadersReceived(options.offHeadersReceived);
    if (options.onHeadersReceived)
      task.onHeadersReceived(options.onHeadersReceived);
  }
  return _promise;
}

export class UniHttp {
  constructor(public readonly config: IUniHttpConfig = {}) {}

  request(
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    return _uniHttp(mergeConfig(options, this.config));
  }

  private _request(
    method:
      | "OPTIONS"
      | "GET"
      | "HEAD"
      | "POST"
      | "PUT"
      | "DELETE"
      | "TRACE"
      | "CONNECT",
    url: string | IUniHttpConfig,
    options?: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    if (!options) options = {};

    if (typeof url === "string") {
      options.url = url;
    } else {
      options = url;
    }

    options.method = method;
    return this.request(options);
  }

  get(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  get(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  get(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("GET", url, options);
  }

  post(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  post(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  post(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("POST", url, options);
  }

  put(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  put(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  put(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("PUT", url, options);
  }

  delete(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  delete(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  delete(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("DELETE", url, options);
  }

  options(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  options(
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  options(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("OPTIONS", url, options);
  }

  head(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  head(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  head(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("HEAD", url, options);
  }

  reace(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  reace(options: IUniHttpConfig): Promise<UniApp.RequestSuccessCallbackResult>;
  reace(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("TRACE", url, options);
  }

  connect(
    url: string,
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  connect(
    options: IUniHttpConfig
  ): Promise<UniApp.RequestSuccessCallbackResult>;
  connect(url: string | IUniHttpConfig, options?: IUniHttpConfig) {
    return this._request("CONNECT", url, options);
  }
}
