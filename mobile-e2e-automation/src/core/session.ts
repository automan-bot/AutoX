/**
 * 세션 관리
 * Appium 세션 라이프사이클 관리
 */

import type { Browser } from "webdriverio";

export interface SessionInfo {
  sessionId: string;
  platform: string;
  deviceId?: string;
  capabilities: Record<string, unknown>;
}

export async function getSessionInfo(driver: Browser): Promise<SessionInfo> {
  const session = await driver.getSession();
  const capabilities = session.capabilities as Record<string, unknown>;
  
  return {
    sessionId: session.id || "",
    platform: (capabilities.platformName as string) || "",
    deviceId: capabilities.udid as string,
    capabilities
  };
}

export async function closeSession(driver: Browser): Promise<void> {
  try {
    await driver.deleteSession();
  } catch (error) {
    // 세션이 이미 종료된 경우 무시
    if (!(error instanceof Error && error.message.includes("session"))) {
      throw error;
    }
  }
}

