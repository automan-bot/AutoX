/**
 * 테스트 종료 시 실행되는 훅
 * 정리 작업, 리소스 해제 등
 */

import { Logger } from "../../src/core/logger";

export interface TestEndContext {
  testId: string;
  platform: string;
  deviceId: string;
  duration: number;
  status: "passed" | "failed" | "skipped";
  appiumSessionId?: string;
}

export async function onTestEnd(context: TestEndContext): Promise<void> {
  const logger = new Logger(context.testId);
  
  logger.info("테스트 종료", {
    status: context.status,
    duration: context.duration,
    platform: context.platform,
    deviceId: context.deviceId,
    appiumSessionId: context.appiumSessionId
  });
}

