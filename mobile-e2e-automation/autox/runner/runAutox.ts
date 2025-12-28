/**
 * Autox.js 스크립트 실행기
 * Laixi에서 호출하는 Autox 사이드카 액션 러너
 */

import { execa } from "execa";
import { join } from "path";
import { getAutoxBind } from "./deviceBind";
import { Logger } from "../../src/core/logger";

const logger = new Logger("autox-runner");

export interface RunAutoxOptions {
  scriptPath: string;
  timeout?: number;
}

export async function runAutox(options: RunAutoxOptions): Promise<void> {
  const { serial } = getAutoxBind();
  const scriptAbsPath = join(process.cwd(), options.scriptPath);
  const timeout = options.timeout ?? 30000;

  logger.info("Autox 스크립트 실행 시작", {
    scriptPath: scriptAbsPath,
    serial,
    timeout
  });

  try {
    // Autox CLI 실행 예시 (실제 CLI 명령은 Autox.js 배포 방식에 맞게 조정 필요)
    // 예상 명령: autox --serial <serial> run <script>
    const result = await execa(
      "autox",
      ["--serial", serial, "run", scriptAbsPath],
      {
        stdio: "inherit",
        timeout
      }
    );

    logger.info("Autox 스크립트 실행 완료", {
      scriptPath: scriptAbsPath,
      serial
    });
  } catch (error) {
    logger.error("Autox 스크립트 실행 실패", {
      error,
      scriptPath: scriptAbsPath,
      serial
    });
    throw error;
  }
}

