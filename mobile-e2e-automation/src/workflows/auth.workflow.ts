/**
 * 인증 워크플로우
 * 여러 페이지를 잇는 사용자 여정
 */

import type { Browser } from "webdriverio";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { waitVisible } from "../core/waits";
import { byA11yId } from "../core/selectors";

export interface AuthCredentials {
  username: string;
  password: string;
}

export class AuthWorkflow {
  constructor(private driver: Browser) {}

  async loginAndNavigateToHome(credentials: AuthCredentials): Promise<HomePage> {
    // 로그인 페이지로 이동 및 로그인
    const loginPage = new LoginPage(this.driver);
    await loginPage.waitReady();
    await loginPage.login(credentials.username, credentials.password);
    
    // 홈 페이지로 이동 확인
    const homeMarker = byA11yId("home.title");
    await waitVisible(this.driver, homeMarker, 20000);
    
    // 홈 페이지 객체 반환
    const homePage = new HomePage(this.driver);
    await homePage.waitReady();
    
    return homePage;
  }

  async logout(): Promise<void> {
    const homePage = new HomePage(this.driver);
    await homePage.openMenu();
    
    const logoutButton = byA11yId("menu.logout");
    const logoutEl = await waitVisible(this.driver, logoutButton, 10000);
    await logoutEl.click();
    
    // 로그아웃 완료 확인 (로그인 페이지로 돌아옴)
    const loginMarker = byA11yId("login.username");
    await waitVisible(this.driver, loginMarker, 10000);
  }
}

