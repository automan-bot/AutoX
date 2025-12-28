/**
 * Jest 설정
 */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}"
  ],
  testTimeout: 120000 // 2분 (세션 시작 시간 고려)
};

