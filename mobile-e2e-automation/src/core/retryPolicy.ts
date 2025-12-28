/**
 * 재시도 정책
 * smoke: 1회, regression: 2회 (태그/프로파일로 조정)
 */

export interface RetryConfig {
  smoke: number;
  regression: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  smoke: 1,
  regression: 2
};

export function getRetryCount(scope: "smoke" | "regression", config?: RetryConfig): number {
  const retryConfig = config ?? DEFAULT_RETRY_CONFIG;
  return retryConfig[scope];
}

export async function retryWithPolicy<T>(
  fn: () => Promise<T>,
  scope: "smoke" | "regression",
  config?: RetryConfig
): Promise<T> {
  const maxRetries = getRetryCount(scope, config);
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        // 재시도 전 대기 (지수 백오프)
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError ?? new Error("재시도 실패: 알 수 없는 오류");
}

