/**
 * 셀렉터 전략 (안정성 우선)
 * 우선순위: Accessibility ID > Resource ID > Predicate/UiSelector > XPath (최후 수단)
 */

/**
 * Accessibility ID / content-desc / resource-id 사용
 * 가장 안정적인 셀렉터
 */
export function byA11yId(id: string): string {
  return `~${id}`;
}

/**
 * iOS -ios predicate string
 * ID가 없을 때 사용
 */
export function byIosPredicate(predicate: string): string {
  return `-ios predicate string:${predicate}`;
}

/**
 * Android UiSelector
 * ID가 없을 때 사용
 */
export function byAndroidUiSelector(selector: string): string {
  return `android=new UiSelector().${selector}`;
}

/**
 * XPath (최후 수단, 격리/개선 대상)
 * 가능한 한 사용 자제, 사용 시 문서화 필수
 */
export function byXPath(xpath: string): string {
  // 경고 로그 추가 권장
  return xpath;
}

/**
 * 리소스 ID (Android)
 */
export function byResourceId(id: string): string {
  return `id=${id}`;
}

/**
 * 클래스 이름
 */
export function byClassName(className: string): string {
  return className;
}

