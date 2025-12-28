/**
 * 로그인 페이지 오브젝트 (POM)
 * Promise 기반 메서드만 사용
 */

import type { Browser } from "webdriverio";
import { byA11yId } from "../core/selectors";
import { waitVisible } from "../core/waits";

export class LoginPage {
  constructor(private driver: Browser) {}

  private username = byA11yId("login.username");
  private password = byA11yId("login.password");
  private submit = byA11yId("login.submit");
  private error = byA11yId("login.error");

  async waitReady(timeoutMs: number = 20000): Promise<void> {
    await waitVisible(this.driver, this.username, timeoutMs);
  }

  async login(user: string, pass: string): Promise<void> {
    const usernameEl = await waitVisible(this.driver, this.username, 20000);
    await usernameEl.setValue(user);
    
    const passwordEl = await waitVisible(this.driver, this.password, 20000);
    await passwordEl.setValue(pass);
    
    const submitEl = await waitVisible(this.driver, this.submit, 20000);
    await submitEl.click();
  }

  async getErrorText(): Promise<string | null> {
    try {
      const el = await this.driver.$(this.error);
      if (await el.isExisting()) {
        return await el.getText();
      }
    } catch {
      // 에러 엘리먼트가 없으면 null 반환
    }
    return null;
  }
}

