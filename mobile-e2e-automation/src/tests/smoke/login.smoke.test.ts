/**
 * 로그인 스모크 테스트
 * @smoke @critical @native
 */

import { createDriver } from "../../core/driverFactory";
import { LoginPage } from "../../pages/LoginPage";
import { HomePage } from "../../pages/HomePage";
import { config } from "../../config/env";
import { getE2ECredentials } from "../../config/secrets";
import { closeSession } from "../../core/session";

const platform = config.platform as "android" | "ios";

describe("@smoke @critical @native", () => {
  it("login succeeds and reaches home", async () => {
    const appiumUrl = config.appiumUrl;
    const appPath = config.appPath;
    
    if (!appPath) {
      throw new Error("APP_PATH 환경 변수가 필요합니다");
    }
    
    const driver = await createDriver({
      platform,
      appPath,
      appiumUrl
    });

    try {
      const loginPage = new LoginPage(driver);
      await loginPage.waitReady();

      const credentials = getE2ECredentials();
      await loginPage.login(credentials.username, credentials.password);

      // 홈 마커 존재 확인
      const homeMarker = await driver.$("~home.title");
      await homeMarker.waitForDisplayed({ timeout: 20000 });
      
      // 홈 페이지 객체로 확인
      const homePage = new HomePage(driver);
      await homePage.waitReady();
      const title = await homePage.getTitle();
      
      expect(title).toBeTruthy();
      
    } finally {
      await closeSession(driver);
    }
  });
});

