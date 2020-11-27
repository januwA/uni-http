import { IUniHttpConfig } from "./http-config";

/**
 * 将c2合并到c1(如果c1中不存在)，并返回一个新的config
 * @param c1 config 1
 * @param c2 condifg 2
 */
export function mergeConfig(
  c1: IUniHttpConfig,
  c2: IUniHttpConfig
): IUniHttpConfig {
  const result: IUniHttpConfig = {
    baseURL: c1.baseURL ?? c2.baseURL,
    url: c1.url ?? c2.url,
    method: c1.method ?? c2.method ?? "GET",
    data: Object.assign({}, c2.data, c1.data),
    params: Object.assign({}, c2.params, c1.params),
    header: Object.assign({}, c2.header, c1.header),
    filePath: c1.filePath ?? c2.filePath,
    name: c1.name ?? c2.name,
    timeout: c1.timeout ?? c2.timeout,
    dataType: c1.dataType ?? c2.dataType,
    responseType: c1.responseType ?? c2.responseType,
    sslVerify: c1.sslVerify ?? c2.sslVerify,
    withCredentials: c1.withCredentials ?? c2.withCredentials,
    firstIpv4: c1.firstIpv4 ?? c2.firstIpv4,
    success: c1.success ?? c2.success,
    fail: c1.fail ?? c2.fail,
    complete: c1.complete ?? c2.complete,
    fileType: c1.fileType ?? c2.fileType,
    file: c1.file ?? c2.file,
    files: c1.files ?? [],
    abortController: c1.abortController ?? c2.abortController,
    offHeadersReceived: c1.offHeadersReceived ?? c2.offHeadersReceived,
    onHeadersReceived: c1.onHeadersReceived ?? c2.onHeadersReceived,
    onProgressUpdate: c1.onProgressUpdate ?? c2.onProgressUpdate,
    offProgressUpdate: c1.offProgressUpdate ?? c2.offProgressUpdate,
    interceptors: c1.interceptors ?? [],
  };

  // 合并files
  if (c2.files) result.files = result.files?.concat(c2.files);

  // 合并拦截器
  if (c2.interceptors)
    result.interceptors = result.interceptors?.concat(c2.interceptors);
  return result;
}

/**
 * @param base baseurl 以http或https开头
 * @param path 网络url path
 */
export function mergeUrl(base?: string, path: string = "") {
  const pathIsHttpHttps = path.match(/^https?:\/\//);

  // api/xxx to /api/xxx
  if (!pathIsHttpHttps && !path.startsWith("/")) path = "/" + path;

  if (!base) return path;

  // 如果path以https?开始，则不合并
  if (pathIsHttpHttps) return path;
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

export function removeHeaderContentType(header: AnyObject): AnyObject {
  Object.keys(header).forEach((k) => {
    if (k.toLowerCase().trim() === "content-type") {
      delete header[k];
    }
  });
  return header;
}

/**
 * {name: 'ajanuw'} to name=ajanuw
 * @param param {}
 */
export function jsonToSerialize(param: AnyObject): string {
  let s = "";
  for (let k in param) {
    let v = param[k];
    let vTag = Object.prototype.toString.call(v);
    if (vTag === "[object Array]") {
      v.forEach((i: any) => (s += `${k}=${i}&`));
    } else if (vTag === "[object Object]") {
      s += `${k}=${JSON.stringify(v)}&`;
    } else {
      s += `${k}=${v}&`;
    }
  }
  return s.replace(/&$/, "");
}

/**
 *
 * name=ajanuw to {name: 'ajanuw'}
 *
 * @param url string
 */
export function parseUrlParams(
  url: string
): {
  url: string;
  params: AnyObject;
} {
  const result: {
    url: string;
    params: AnyObject;
  } = {
    url: url,
    params: {},
  };
  const hasParams = url.indexOf("?") >= 0;
  if (!hasParams) return result;

  const r = url.split("?");
  result.url = r[0];
  // not params
  if (!r[1]) return result;

  r[1]
    .split("&")
    .map((it: string) => it.split("="))
    .forEach((it) => {
      if (it.length === 2) {
        const k: string = it[0];
        const v: string = it[1];

        // 如果存在多个，以数组返回
        if (result.params.hasOwnProperty(k)) {
          result.params[k] = [result.params[k]];
          result.params[k].push(v);
        } else {
          result.params[k] = v;
        }
      }
    });

  return result;
}

export function urlWithParams(options: IUniHttpConfig) {
  // 1. 将baseurl和url合并在一起
  const fullUrl = mergeUrl(options.baseURL, options.url);

  // 2. 解析出url中的params
  let r = parseUrlParams(fullUrl);

  // 3. 合并params和options.params(覆盖)
  const ps = Object.assign({}, r.params, options.params);

  const paramsString = jsonToSerialize(ps);

  // 4. 将合并后的params拼接在url上
  const url = paramsString ? r.url + "?" + paramsString : r.url;

  return url;
}
