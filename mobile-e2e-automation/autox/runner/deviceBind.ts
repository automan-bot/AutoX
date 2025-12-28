/**
 * Autox.js 디바이스 바인딩
 * Android 디바이스 시리얼 번호 관리
 */

export type AutoxBind = { serial: string };

export function getAutoxBind(): AutoxBind {
  const serial = process.env.ANDROID_SERIAL;
  if (!serial) {
    throw new Error("ANDROID_SERIAL 환경 변수가 필요합니다 (Autox 바인딩용)");
  }
  return { serial };
}

export function setAutoxBind(serial: string): void {
  process.env.ANDROID_SERIAL = serial;
}

