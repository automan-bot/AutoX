/**
 * 구조화된 로거 (JSONL 형식)
 * testId, tagSet, platform, deviceId, step, durationMs, result, error 필드 포함
 */

export interface LogFields {
  testId?: string;
  tagSet?: string[];
  platform?: string;
  deviceId?: string;
  step?: string;
  durationMs?: number;
  result?: "passed" | "failed" | "skipped";
  error?: string;
  appiumSessionId?: string;
  [key: string]: unknown;
}

export class Logger {
  constructor(private testId: string = "global") {}

  private log(level: "info" | "warn" | "error", message: string, fields: LogFields = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      testId: this.testId,
      message,
      ...fields
    };
    
    // JSONL 형식으로 출력
    const jsonLine = JSON.stringify(logEntry);
    const output = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    output(jsonLine);
  }

  info(message: string, fields: LogFields = {}): void {
    this.log("info", message, fields);
  }

  warn(message: string, fields: LogFields = {}): void {
    this.log("warn", message, fields);
  }

  error(message: string, fields: LogFields = {}): void {
    this.log("error", message, fields);
  }
}

