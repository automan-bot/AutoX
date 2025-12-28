/**
 * 홈 페이지 오브젝트 (POM)
 * Promise 기반 메서드만 사용
 */

import type { Browser } from "webdriverio";
import { byA11yId } from "../core/selectors";
import { waitVisible } from "../core/waits";

export class HomePage {
  constructor(private driver: Browser) {}

  private title = byA11yId("home.title");
  private menu = byA11yId("home.menu");

  async waitReady(timeoutMs: number = 20000): Promise<void> {
    await waitVisible(this.driver, this.title, timeoutMs);
  }

  async getTitle(): Promise<string> {
    const titleEl = await waitVisible(this.driver, this.title, 20000);
    return await titleEl.getText();
  }

  async openMenu(): Promise<void> {
    const menuEl = await waitVisible(this.driver, this.menu, 20000);
    await menuEl.click();
  }
}

