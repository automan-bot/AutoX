/**
 * 로그인 회귀 테스트
 * @regression @critical @native
 */

import { createDriver } from "../../core/driverFactory";
import { LoginPage } from "../../pages/LoginPage";
import { AuthWorkflow } from "../../workflows/auth.workflow";
import { config } from "../../config/env";
import { getE2ECredentials } from "../../config/secrets";
import { closeSession } from "../../core/session";

const platform = config.platform as "android" | "ios";

describe("@regression @critical @native", () => {
  it("login with invalid credentials shows error", async () => {
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

      // 잘못된 자격 증명으로 로그인 시도
      await loginPage.login("invalid_user", "invalid_password");

      // 에러 메시지 확인
      const errorText = await loginPage.getErrorText();
      expect(errorText).toBeTruthy();
      expect(errorText).toContain("로그인");
      
    } finally {
      await closeSession(driver);
    }
  });

  it("login and logout flow", async () => {
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
      const credentials = getE2ECredentials();
      const authWorkflow = new AuthWorkflow(driver);
      
      // 로그인
      const homePage = await authWorkflow.loginAndNavigateToHome(credentials);
      const title = await homePage.getTitle();
      expect(title).toBeTruthy();
      
      // 로그아웃
      await authWorkflow.logout();
      
      // 로그인 페이지로 돌아왔는지 확인
      const loginPage = new LoginPage(driver);
      await loginPage.waitReady();
      
    } finally {
      await closeSession(driver);
    }
  });
});

