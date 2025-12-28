/**
 * 테스트 시작 시 실행되는 훅
 * 디바이스 메타데이터 로깅, 세션 초기화 등
 */

import { Logger } from "../../src/core/logger";

export interface TestContext {
  testId: string;
  platform: string;
  deviceId: string;
  appiumSessionId?: string;
  tags: string[];
}

export async function onTestStart(context: TestContext): Promise<void> {
  const logger = new Logger(context.testId);
  
  logger.info("테스트 시작", {
    platform: context.platform,
    deviceId: context.deviceId,
    tags: context.tags,
    appiumSessionId: context.appiumSessionId
  });
  
  // 디바이스/OS/앱 빌드 메타데이터 로깅
  logger.info("디바이스 메타데이터", {
    deviceId: context.deviceId,
    platform: context.platform,
    timestamp: new Date().toISOString()
  });
}

