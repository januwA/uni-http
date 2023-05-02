import { Completer } from "ajanuw-completer";

/**
 * 中断请求控制器
 */
export class UniAbortController {
  completer = new Completer();

  /**
   * 中断上传任务
   */
  abort() {
    if (!this.completer.isCompleted) this.completer.complete(true);
  }
}
