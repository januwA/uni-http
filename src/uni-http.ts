import { IUniHttpConfig } from "./http-config";
import {
  jsonToSerialize,
  mergeConfig,
  mergeUrl,
  parseUrlParams,
  removeHeaderContentType,
} from "./utils";

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

  // request 拦截器
  options.interceptors?.forEach((it) => {
    options = it.request(options);
  });

  // 1. 将baseurl和url合并在一起
  const fullUrl = mergeUrl(options.baseURL, options.url);

  // 2. 解析出url中的params
  let r = parseUrlParams(fullUrl);

  // 3. 合并params和options.params(覆盖)
  const ps = Object.assign({}, r.params, options.params);

  // 4. 将合并后的params拼接在url上
  const url = r.url + "?" + jsonToSerialize(ps);

  const isUpfile =
    options.filePath || options.file || (options.files && options.files.length);
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
        let result: UniApp.RequestSuccessCallbackResult = {
          statusCode: res.statusCode,
          header: {},
          cookies: [],
          data,
        };

        // success 拦截器
        options.interceptors?.forEach((it) => {
          result = it.success(result);
        });

        if (options.success) options.success(result);
        else _res(result);
      },
      fail: (result) => {
        // fail 拦截器
        options.interceptors?.forEach((it) => {
          result = it.fail(result);
        });

        if (options.fail) options.fail(result);
        else _rej(result);
      },
      complete: (result) => {
        // compilete 拦截器
        options.interceptors?.forEach((it) => {
          result = it.complete(result);
        });

        if (options.complete) options.complete(result);
      },
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
      success: (result) => {
        // success 拦截器
        options.interceptors?.forEach((it) => {
          result = it.success(result);
        });

        if (options.success) options.success(result);
        else _res(result);
      },
      fail: (result) => {
        // fail 拦截器
        options.interceptors?.forEach((it) => {
          result = it.fail(result);
        });

        if (options.fail) options.fail(result);
        else _rej(result);
      },
      complete: (result) => {
        // compilete 拦截器
        options.interceptors?.forEach((it) => {
          result = it.complete(result);
        });
        if (options.complete) options.complete(result);
      },
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

  get(url: string, options: IUniHttpConfig = {}) {
    options.method = "GET";
    options.url = url;
    return this.request(options);
  }

  post(url: string, options: IUniHttpConfig = {}) {
    options.method = "POST";
    options.url = url;
    return this.request(options);
  }

  put(url: string, options: IUniHttpConfig = {}) {
    options.method = "PUT";
    options.url = url;
    return this.request(options);
  }

  delete(url: string, options: IUniHttpConfig = {}) {
    options.method = "DELETE";
    options.url = url;
    return this.request(options);
  }

  options(url: string, options: IUniHttpConfig = {}) {
    options.method = "OPTIONS";
    options.url = url;
    return this.request(options);
  }

  head(url: string, options: IUniHttpConfig = {}) {
    options.method = "HEAD";
    options.url = url;
    return this.request(options);
  }

  reace(url: string, options: IUniHttpConfig = {}) {
    options.method = "TRACE";
    options.url = url;
    return this.request(options);
  }

  connect(url: string, options: IUniHttpConfig = {}) {
    options.method = "CONNECT";
    options.url = url;
    return this.request(options);
  }
}
