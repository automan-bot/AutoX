/**
 * 환경 변수 설정
 */

import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  platform: (process.env.PLATFORM as "android" | "ios") ?? "android",
  appiumUrl: process.env.APPIUM_URL ?? "http://127.0.0.1:4723",
  appPath: process.env.APP_PATH ?? "",
  androidSerial: process.env.ANDROID_SERIAL,
  envProfile: (process.env.ENV_PROFILE as "dev" | "stage" | "prod") ?? "stage",
  e2eUsername: process.env.E2E_USERNAME ?? "",
  e2ePassword: process.env.E2E_PASSWORD ?? "",
  deviceFarmToken: process.env.DEVICE_FARM_TOKEN
};

