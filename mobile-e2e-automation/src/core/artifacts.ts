/**
 * 아티팩트 캡처
 * 실패 시 스크린샷, 페이지 소스, 로그 등 수집
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { Browser } from "webdriverio";
import { Logger } from "./logger";

const logger = new Logger("artifacts");

export async function captureArtifacts(driver: Browser, outputDir: string): Promise<void> {
  mkdirSync(outputDir, { recursive: true });
  
  try {
    // 스크린샷 캡처
    const screenshot = await driver.takeScreenshot();
    const screenshotPath = join(outputDir, "screenshot.png");
    writeFileSync(screenshotPath, screenshot, "base64");
    logger.info("스크린샷 캡처 완료", { screenshotPath });
    
    // 페이지 소스 덤프 (XML/JSON)
    const pageSource = await driver.getPageSource();
    const sourcePath = join(outputDir, "source.xml");
    writeFileSync(sourcePath, pageSource, "utf-8");
    logger.info("페이지 소스 캡처 완료", { sourcePath });
    
    // 세션 정보 저장
    const session = await driver.getSession();
    const sessionInfo = {
      sessionId: session.id,
      capabilities: session.capabilities,
      timestamp: new Date().toISOString()
    };
    const sessionPath = join(outputDir, "session.json");
    writeFileSync(sessionPath, JSON.stringify(sessionInfo, null, 2), "utf-8");
    logger.info("세션 정보 캡처 완료", { sessionPath });
    
  } catch (error) {
    logger.error("아티팩트 캡처 실패", { error, outputDir });
    // 아티팩트 캡처 실패가 테스트 실패를 방해하지 않도록 에러는 던지지 않음
  }
}

