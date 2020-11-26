/**
 * 中断请求控制器
 */
export class UniAbortController {
  promise: Promise<any>;
  private _res!: any;
  constructor() {
    this.promise = new Promise<any>((res) => (this._res = res));
  }
  abort() {
    this._res();
  }
}
