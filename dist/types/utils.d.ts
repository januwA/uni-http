/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
export declare function mergeConfig(c1: IUniHttpConfig, c2: IUniHttpConfig): IUniHttpConfig;
export declare function mergeUrl(base?: string, path?: string): string;
export declare function removeHeaderContentType(header: AnyObject): AnyObject;
export declare function jsonToSerialize(param: AnyObject): string;
export declare function parseUrlParams(url: string): {
    url: string;
    params: AnyObject;
};
export declare function urlWithParams(options: IUniHttpConfig): string;
//# sourceMappingURL=utils.d.ts.map