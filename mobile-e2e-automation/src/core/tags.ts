/**
 * 테스트 태깅 시스템
 * @smoke @regression @critical @android @ios @hybrid @native @webview @quarantine
 */

export type TestTag = 
  | "smoke" 
  | "regression" 
  | "critical" 
  | "android" 
  | "ios" 
  | "hybrid" 
  | "native" 
  | "webview" 
  | "quarantine";

export function parseTags(testName: string): TestTag[] {
  const tags: TestTag[] = [];
  const tagPattern = /@(\w+)/g;
  let match;
  
  while ((match = tagPattern.exec(testName)) !== null) {
    const tag = match[1] as TestTag;
    if (isValidTag(tag)) {
      tags.push(tag);
    }
  }
  
  return tags;
}

function isValidTag(tag: string): tag is TestTag {
  const validTags: TestTag[] = [
    "smoke", "regression", "critical",
    "android", "ios", "hybrid", "native", "webview",
    "quarantine"
  ];
  return validTags.includes(tag as TestTag);
}

export function hasTag(tags: TestTag[], tag: TestTag): boolean {
  return tags.includes(tag);
}

export function hasAnyTag(tags: TestTag[], targetTags: TestTag[]): boolean {
  return targetTags.some(tag => tags.includes(tag));
}

export function hasAllTags(tags: TestTag[], targetTags: TestTag[]): boolean {
  return targetTags.every(tag => tags.includes(tag));
}

