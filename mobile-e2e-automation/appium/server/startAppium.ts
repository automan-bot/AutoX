/**
 * Appium 서버 시작 스크립트
 */

import { execa } from "execa";
import { Logger } from "../../src/core/logger";

const logger = new Logger("appium-server");

export interface AppiumServerOptions {
  port?: number;
  host?: string;
  logLevel?: "error" | "warn" | "info" | "debug";
}

export async function startAppiumServer(options: AppiumServerOptions = {}): Promise<void> {
  const port = options.port ?? 4723;
  const host = options.host ?? "127.0.0.1";
  const logLevel = options.logLevel ?? "info";

  logger.info("Appium 서버 시작", { port, host, logLevel });

  try {
    // Appium 서버 시작 (백그라운드)
    const appiumProcess = execa("appium", [
      "--port", port.toString(),
      "--address", host,
      "--log-level", logLevel
    ], {
      stdio: "inherit",
      detached: true
    });

    // 서버가 시작될 때까지 대기 (간단한 헬스 체크)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Appium 서버 시작 타임아웃"));
      }, 30000);

      // 간단한 헬스 체크 로직 추가 필요
      appiumProcess.on("spawn", () => {
        clearTimeout(timeout);
        setTimeout(resolve, 3000); // 서버 시작 대기
      });

      appiumProcess.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    logger.info("Appium 서버 시작 완료", { port, host });
  } catch (error) {
    logger.error("Appium 서버 시작 실패", { error });
    throw error;
  }
}

// CLI 실행 시
if (require.main === module) {
  startAppiumServer().catch((error) => {
    logger.error("Appium 서버 실행 중 오류", { error });
    process.exit(1);
  });
}

