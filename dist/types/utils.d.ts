/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
/**
 * 将c2合并到c1(如果c1中不存在)，并返回一个新的config
 * @param c1 config 1
 * @param c2 condifg 2
 */
export declare function mergeConfig(c1: IUniHttpConfig, c2: IUniHttpConfig): IUniHttpConfig;
/**
 * @param base baseurl 以http或https开头
 * @param path 网络url path
 */
export declare function mergeUrl(base?: string, path?: string): string;
export declare function removeHeaderContentType(header: AnyObject): AnyObject;
/**
 * {name: 'ajanuw'} to name=ajanuw
 * @param param {}
 */
export declare function jsonToSerialize(param: AnyObject): string;
/**
 *
 * name=ajanuw to {name: 'ajanuw'}
 *
 * @param url string
 */
export declare function parseUrlParams(url: string): {
    url: string;
    params: AnyObject;
};
export declare function urlWithParams(options: IUniHttpConfig): string;
//# sourceMappingURL=utils.d.ts.map