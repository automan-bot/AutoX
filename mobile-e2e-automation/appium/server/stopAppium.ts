/**
 * Appium 서버 종료 스크립트
 */

import { execa } from "execa";
import { Logger } from "../../src/core/logger";

const logger = new Logger("appium-server");

export async function stopAppiumServer(port: number = 4723): Promise<void> {
  logger.info("Appium 서버 종료", { port });

  try {
    // 특정 포트에서 실행 중인 Appium 프로세스 찾아서 종료
    // 간단한 구현 예시 (실제로는 더 안전한 방법 권장)
    await execa("pkill", ["-f", `appium.*--port.*${port}`], {
      stdio: "inherit"
    }).catch(() => {
      // 프로세스가 없으면 무시
      logger.info("실행 중인 Appium 서버 없음");
    });

    logger.info("Appium 서버 종료 완료");
  } catch (error) {
    logger.error("Appium 서버 종료 실패", { error });
    throw error;
  }
}

// CLI 실행 시
if (require.main === module) {
  const port = parseInt(process.env.APPIUM_PORT || "4723", 10);
  stopAppiumServer(port).catch((error) => {
    logger.error("Appium 서버 종료 중 오류", { error });
    process.exit(1);
  });
}

