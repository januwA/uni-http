import { Completer } from "ajanuw-completer";
import { IUniHttpConfig } from "./http-config";
import { UniHttpInterceptors } from "./interceptors";
import { mergeConfig, removeHeaderContentType, urlWithParams } from "./utils";

const cancelResultMessage = {
  errMsg: "request:fail cancel",
};

function createPromiseList(
  interceptors: UniHttpInterceptors[],
  cb: (it: UniHttpInterceptors) => any
) {
  return {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        async next() {
          if (this.i < interceptors.length) {
            const it = interceptors[this.i++];
            await cb(it);
            return { value: it, done: false };
          }
          return { value: null, done: true };
        },
      };
    },
  };
}

function getInterceptors(
  interceptors: UniHttpInterceptors[] | undefined,
  hook: "request" | "success" | "fail" | "complete"
) {
  if (!interceptors) return [];
  return interceptors.filter((e) => hook in e && typeof e[hook] === "function");
}

async function _uniHttp(
  options: IUniHttpConfig
): Promise<UniApp.RequestSuccessCallbackResult> {
  const completer = new Completer<UniApp.RequestSuccessCallbackResult>();

  let cancel = false;

  // request 拦截器
  for await (const it of createPromiseList(
    getInterceptors(options.interceptors, "request"),
    (it) => it.request?.(options)
  )) {
    if (!it) continue;
    if (options.cancel === true) {
      cancel = true;
      it.fail?.(cancelResultMessage, options);
      it.complete?.(cancelResultMessage, options);
      break;
    }
  }

  // cancel 直接返回，不发送请求
  if (cancel) {
    completer.completeError(cancelResultMessage);
    return completer.promise;
  }

  const url = urlWithParams(options);

  const isUpfile =
    options.filePath || options.file || (options.files && options.files.length);

  const _success = async (result: UniApp.RequestSuccessCallbackResult) => {
    // success 拦截器
    for await (const it of createPromiseList(
      getInterceptors(options.interceptors, "success"),
      async (it) => (result = await it.success!(result, options))
    )) {
    }

    // 有callback就用callback，没有就用promise
    if (options.success) options.success(result);
    else completer.complete(result);
  };

  const _fail = async (result: UniApp.GeneralCallbackResult) => {
    // fail 拦截器
    for await (const it of createPromiseList(
      getInterceptors(options.interceptors, "fail"),
      async (it) => it.fail?.(result, options)
    )) {
    }

    if (options.fail) options.fail(result);
    else completer.completeError(result);
  };

  const _complete = async (result: UniApp.GeneralCallbackResult) => {
    // compilete 拦截器
    for await (const it of createPromiseList(
      getInterceptors(options.interceptors, "complete"),
      async (it) => it.complete?.(result, options)
    )) {
    }

    options.complete?.(result);
  };

  if (isUpfile) {
    // 发送文件需要删除header中的content-type
    options.header = removeHeaderContentType(options.header ?? {});
    const task = uni.uploadFile({
      url: url,
      files: options.files,
      fileType: options.fileType,
      file: options.file,
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

    options.abortController?.completer.promise.then(() => task.abort());

    if (options.onProgressUpdate)
      task.onProgressUpdate(options.onProgressUpdate);

    if (options.onHeadersReceived)
      task.onHeadersReceived(options.onHeadersReceived);

    if (options.offProgressUpdate)
      task.offProgressUpdate(options.offProgressUpdate);

    if (options.offHeadersReceived)
      task.offHeadersReceived(options.offHeadersReceived);
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

    options.abortController?.completer.promise.then(() => task.abort());

    if (options.offHeadersReceived)
      task.offHeadersReceived(options.offHeadersReceived);

    if (options.onHeadersReceived)
      task.onHeadersReceived(options.onHeadersReceived);
  }
  return completer.promise;
}

export class UniHttp {
  static create(config: IUniHttpConfig = {}): UniHttp {
    return new UniHttp(config);
  }

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
    options: IUniHttpConfig = {}
  ): Promise<UniApp.RequestSuccessCallbackResult> {
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
