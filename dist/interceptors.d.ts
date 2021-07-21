/// <reference types="@dcloudio/types/uni-app" />
import { IUniHttpConfig } from "./http-config";
export declare abstract class UniHttpInterceptors {
    abstract request(options: IUniHttpConfig): IUniHttpConfig;
    abstract success(result: UniApp.RequestSuccessCallbackResult): UniApp.RequestSuccessCallbackResult;
    abstract fail(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
    abstract complete(result: UniApp.GeneralCallbackResult): UniApp.GeneralCallbackResult;
}
//# sourceMappingURL=interceptors.d.ts.map