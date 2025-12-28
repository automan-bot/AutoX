/**
 * 플레이키 격리 정책
 * 동일 빌드에서 7일 내 비결정적 실패가 2회 이상이면 @quarantine 자동 태그
 * PR 게이트에서 제외, 야간에는 실행하되 비차단
 */

import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { TestTag } from "./tags";

export interface FailureRecord {
  testId: string;
  buildId: string;
  timestamp: string;
  error: string;
}

const QUARANTINE_DB_DIR = join(process.cwd(), "laixi", "artifacts");
const QUARANTINE_DB_PATH = join(QUARANTINE_DB_DIR, "quarantine.json");
const QUARANTINE_WINDOW_DAYS = 7;
const QUARANTINE_THRESHOLD = 2;

export function loadQuarantineDb(): FailureRecord[] {
  try {
    const data = readFileSync(QUARANTINE_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveQuarantineDb(records: FailureRecord[]): void {
  mkdirSync(QUARANTINE_DB_DIR, { recursive: true });
  writeFileSync(QUARANTINE_DB_PATH, JSON.stringify(records, null, 2), "utf-8");
}

export function shouldQuarantine(
  testId: string,
  buildId: string,
  error: string
): boolean {
  const records = loadQuarantineDb();
  const now = Date.now();
  const windowMs = QUARANTINE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  
  // 같은 빌드에서 최근 실패 기록 필터링
  const recentFailures = records.filter(record => {
    const recordTime = new Date(record.timestamp).getTime();
    const isRecent = now - recordTime < windowMs;
    const isSameBuild = record.buildId === buildId;
    const isSameTest = record.testId === testId;
    return isRecent && isSameBuild && isSameTest;
  });
  
  // 새 실패 기록 추가
  const newRecord: FailureRecord = {
    testId,
    buildId,
    timestamp: new Date().toISOString(),
    error
  };
  records.push(newRecord);
  saveQuarantineDb(records);
  
  // 임계값 확인 (기존 실패 + 새 실패)
  return recentFailures.length + 1 >= QUARANTINE_THRESHOLD;
}

export function isQuarantined(testId: string, buildId: string): boolean {
  const records = loadQuarantineDb();
  const now = Date.now();
  const windowMs = QUARANTINE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  
  const recentFailures = records.filter(record => {
    const recordTime = new Date(record.timestamp).getTime();
    const isRecent = now - recordTime < windowMs;
    const isSameBuild = record.buildId === buildId;
    const isSameTest = record.testId === testId;
    return isRecent && isSameBuild && isSameTest;
  });
  
  return recentFailures.length >= QUARANTINE_THRESHOLD;
}

