/**
 * JUnit XML 리포트 생성기
 * CI/CD 파이프라인 통합용
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export interface TestResult {
  testId: string;
  name: string;
  duration: number;
  status: "passed" | "failed" | "skipped";
  error?: string;
  platform: string;
}

export interface TestSuite {
  name: string;
  tests: number;
  failures: number;
  skipped: number;
  errors: number;
  time: number;
  testCases: TestResult[];
}

export function generateJUnitXML(suite: TestSuite, outputPath: string): void {
  const artifactsDir = join(outputPath, "junit");
  mkdirSync(artifactsDir, { recursive: true });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="${escapeXml(suite.name)}" tests="${suite.tests}" failures="${suite.failures}" skipped="${suite.skipped}" errors="${suite.errors}" time="${suite.time}">
${suite.testCases.map(tc => `    <testcase name="${escapeXml(tc.name)}" classname="${escapeXml(tc.testId)}" time="${tc.duration}">
${tc.status === "failed" ? `      <failure message="${escapeXml(tc.error || "")}">${escapeXml(tc.error || "")}</failure>` : ""}
${tc.status === "skipped" ? `      <skipped/>` : ""}
    </testcase>`).join("\n")}
  </testsuite>
</testsuites>`;

  writeFileSync(join(artifactsDir, "results.xml"), xml, "utf-8");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

