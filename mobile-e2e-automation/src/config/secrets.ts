/**
 * 시크릿 관리
 * 절대 git에 커밋하지 말 것. 환경 변수로만 주입.
 */

import { config } from "./env";

export function getE2ECredentials(): { username: string; password: string } {
  if (!config.e2eUsername || !config.e2ePassword) {
    throw new Error("E2E_USERNAME 및 E2E_PASSWORD 환경 변수가 필요합니다");
  }
  return {
    username: config.e2eUsername,
    password: config.e2ePassword
  };
}

export function getDeviceFarmToken(): string | undefined {
  return config.deviceFarmToken;
}

