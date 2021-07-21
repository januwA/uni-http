import { Completer } from "ajanuw-completer";

/**
 * 中断请求控制器
 */
export class UniAbortController {
  completer: Completer<any>;
  constructor() {
    this.completer = new Completer();
  }

  /**
   * 中断上传任务
   */
  abort() {
    this.completer.complete(true);
  }
}
