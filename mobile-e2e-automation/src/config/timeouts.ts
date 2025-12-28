/**
 * 표준 타임아웃 설정
 * Implicit wait 금지: 모든 타임아웃은 explicit wait로만 사용
 */

export interface TimeoutConfig {
  elementMs: number;
  actionMs: number;
  sessionMs: number;
}

// 표준 타임아웃: smoke 10s, regression 20s
export const TIMEOUTS = {
  SMOKE: {
    elementMs: 10000,
    actionMs: 5000,
    sessionMs: 60000
  },
  REGRESSION: {
    elementMs: 20000,
    actionMs: 5000,
    sessionMs: 90000
  }
} as const;

export function getTimeoutForScope(scope: "smoke" | "regression"): TimeoutConfig {
  return TIMEOUTS[scope === "smoke" ? "SMOKE" : "REGRESSION"];
}

