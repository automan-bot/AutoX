/**
 * 드라이버 팩토리
 * Appium WebDriver 세션 생성 및 설정
 */

import { remote, Browser } from "webdriverio";
import { androidNativeCaps } from "../../appium/capabilities/android.native";
import { iosNativeCaps } from "../../appium/capabilities/ios.native";

export type Platform = "android" | "ios";

export interface DriverConfig {
  appPath: string;
  appiumUrl: string;
  platform: Platform;
  deviceName?: string;
  platformVersion?: string;
  udid?: string;
}

export async function createDriver(cfg: DriverConfig): Promise<Browser> {
  const capabilities =
    cfg.platform === "android"
      ? androidNativeCaps({
          appPath: cfg.appPath,
          deviceName: cfg.deviceName,
          platformVersion: cfg.platformVersion,
          udid: cfg.udid
        })
      : iosNativeCaps({
          appPath: cfg.appPath,
          deviceName: cfg.deviceName,
          platformVersion: cfg.platformVersion,
          udid: cfg.udid
        });

  const url = new URL(cfg.appiumUrl);
  const driver: Browser = await remote({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: Number(url.port || 4723),
    path: url.pathname || "/",
    capabilities
  });

  // 하드 룰: implicit wait 금지 (0으로 고정)
  await driver.setTimeout({ implicit: 0, pageLoad: 0, script: 30000 });
  
  return driver;
}

