/**
 * 테스트 실패 시 실행되는 훅
 * 아티팩트 캡처 (스크린샷, 페이지 소스, 로그 등)
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { Logger } from "../../src/core/logger";
import { captureArtifacts } from "../../src/core/artifacts";
import type { Browser } from "webdriverio";

export interface TestFailureContext {
  testId: string;
  platform: string;
  deviceId: string;
  error: Error;
  driver?: Browser;
  appiumSessionId?: string;
}

export async function onTestFail(context: TestFailureContext): Promise<void> {
  const logger = new Logger(context.testId);
  
  logger.error("테스트 실패", {
    error: context.error.message,
    stack: context.error.stack,
    platform: context.platform,
    deviceId: context.deviceId,
    appiumSessionId: context.appiumSessionId
  });
  
  // 아티팩트 캡처
  if (context.driver) {
    const artifactsDir = join(process.cwd(), "laixi", "artifacts", "tests", context.testId);
    mkdirSync(artifactsDir, { recursive: true });
    
    await captureArtifacts(context.driver, artifactsDir);
    
    logger.info("아티팩트 캡처 완료", { artifactsDir });
  }
}

