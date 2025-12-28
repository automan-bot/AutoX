/**
 * HTML 요약 리포트 생성기
 * 테스트 실행 결과 시각화
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { TestSuite, TestResult } from "./junit";

export function generateHTMLSummary(suite: TestSuite, outputPath: string): void {
  const summaryDir = join(outputPath, "summary");
  mkdirSync(summaryDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>테스트 실행 요약</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 15px; border-radius: 5px; }
    .passed { background: #d4edda; color: #155724; }
    .failed { background: #f8d7da; color: #721c24; }
    .skipped { background: #fff3cd; color: #856404; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
    th { background: #f8f9fa; }
    .failed-row { background: #f8d7da; }
  </style>
</head>
<body>
  <div class="header">
    <h1>테스트 실행 요약</h1>
    <p>Suite: ${escapeHtml(suite.name)}</p>
    <p>실행 시간: ${new Date().toLocaleString("ko-KR")}</p>
  </div>
  
  <div class="stats">
    <div class="stat">
      <strong>전체</strong><br>${suite.tests}
    </div>
    <div class="stat passed">
      <strong>통과</strong><br>${suite.tests - suite.failures - suite.skipped - suite.errors}
    </div>
    <div class="stat failed">
      <strong>실패</strong><br>${suite.failures + suite.errors}
    </div>
    <div class="stat skipped">
      <strong>건너뜀</strong><br>${suite.skipped}
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>테스트 ID</th>
        <th>이름</th>
        <th>플랫폼</th>
        <th>상태</th>
        <th>소요 시간 (초)</th>
        <th>에러</th>
      </tr>
    </thead>
    <tbody>
${suite.testCases.map(tc => `      <tr class="${tc.status === "failed" ? "failed-row" : ""}">
        <td>${escapeHtml(tc.testId)}</td>
        <td>${escapeHtml(tc.name)}</td>
        <td>${escapeHtml(tc.platform)}</td>
        <td>${tc.status}</td>
        <td>${(tc.duration / 1000).toFixed(2)}</td>
        <td>${tc.error ? escapeHtml(tc.error) : "-"}</td>
      </tr>`).join("\n")}
    </tbody>
  </table>
</body>
</html>`;

  writeFileSync(join(summaryDir, "index.html"), html, "utf-8");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

