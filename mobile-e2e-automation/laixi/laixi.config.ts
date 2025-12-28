/**
 * Laixi 오케스트레이터 설정
 * 잡 스케줄링, 환경 선택, 디바이스 할당, 병렬화, 아티팩트 수집, 리포트 집계
 */

import { readFileSync } from "fs";
import { join } from "path";

export interface LaixiConfig {
  profiles: {
    dev: string;
    stage: string;
    prod: string;
  };
  devicePools: {
    localEmulator: string;
    localReal: string;
    cloudFarm: string;
  };
  reporters: {
    junit: string;
    htmlSummary: string;
  };
}

const configPath = join(__dirname, "laixi.config.json");

export function loadLaixiConfig(): LaixiConfig {
  try {
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    return config;
  } catch (error) {
    throw new Error(`Laixi 설정 로드 실패: ${error}`);
  }
}

export function loadProfile(profileName: "dev" | "stage" | "prod") {
  const profilePath = join(__dirname, "profiles", `${profileName}.json`);
  return JSON.parse(readFileSync(profilePath, "utf-8"));
}

