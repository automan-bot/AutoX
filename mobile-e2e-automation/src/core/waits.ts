/**
 * Explicit Wait 유틸리티
 * Implicit wait 금지 - 모든 대기는 상태 기반 explicit wait만 사용
 */

import type { Browser, Element } from "webdriverio";

export interface WaitOptions {
  timeout?: number;
  interval?: number;
  timeoutMsg?: string;
}

/**
 * 엘리먼트가 표시될 때까지 대기
 * 상태 기반: 표시됨 + 활성 + 안정
 */
export async function waitVisible(
  driver: Browser,
  selector: string,
  timeoutMs: number,
  options?: WaitOptions
): Promise<Element> {
  const el = await driver.$(selector);
  await el.waitForDisplayed({
    timeout: options?.timeout ?? timeoutMs,
    interval: options?.interval ?? 250,
    timeoutMsg: options?.timeoutMsg ?? `엘리먼트가 ${timeoutMs}ms 내에 표시되지 않음: ${selector}`
  });
  
  // 활성 상태 확인 (클릭 가능한지)
  await el.waitForClickable({
    timeout: 1000,
    timeoutMsg: `엘리먼트가 클릭 가능하지 않음: ${selector}`
  }).catch(() => {
    // 클릭 불가능해도 계속 진행 (일부 엘리먼트는 클릭 불가능)
  });
  
  return el;
}

/**
 * 엘리먼트가 사라질 때까지 대기
 */
export async function waitNotVisible(
  driver: Browser,
  selector: string,
  timeoutMs: number,
  options?: WaitOptions
): Promise<void> {
  const el = await driver.$(selector);
  await el.waitForDisplayed({
    timeout: options?.timeout ?? timeoutMs,
    interval: options?.interval ?? 250,
    reverse: true,
    timeoutMsg: options?.timeoutMsg ?? `엘리먼트가 ${timeoutMs}ms 내에 사라지지 않음: ${selector}`
  });
}

/**
 * 엘리먼트가 존재할 때까지 대기 (표시 여부 무관)
 */
export async function waitExists(
  driver: Browser,
  selector: string,
  timeoutMs: number,
  options?: WaitOptions
): Promise<Element> {
  const el = await driver.$(selector);
  await el.waitForExist({
    timeout: options?.timeout ?? timeoutMs,
    interval: options?.interval ?? 250,
    timeoutMsg: options?.timeoutMsg ?? `엘리먼트가 ${timeoutMs}ms 내에 존재하지 않음: ${selector}`
  });
  return el;
}

/**
 * 조건이 참이 될 때까지 대기
 */
export async function waitUntil(
  condition: () => Promise<boolean>,
  timeoutMs: number,
  intervalMs: number = 250
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error(`조건이 ${timeoutMs}ms 내에 만족되지 않음`);
}

/**
 * sleep() 금지 원칙에 따른 최소 대기 (OS 애니메이션 등 예외 처리)
 * 300ms 이하의 짧은 대기만 허용
 */
export async function minimalSleep(ms: number): Promise<void> {
  const MAX_ALLOWED_SLEEP = 300;
  if (ms > MAX_ALLOWED_SLEEP) {
    throw new Error(`sleep() 사용 금지: ${ms}ms는 허용되지 않음 (최대 ${MAX_ALLOWED_SLEEP}ms). 대신 explicit wait 사용`);
  }
  await new Promise(resolve => setTimeout(resolve, ms));
}

