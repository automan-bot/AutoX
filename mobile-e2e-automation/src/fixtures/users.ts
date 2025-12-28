/**
 * 테스트 사용자 픽스처
 * 테스트 데이터 관리 (비밀값 금지)
 */

export interface TestUser {
  username: string;
  password: string;
  role?: string;
}

// 예시 사용자 (실제 환경에서는 환경 변수나 별도 설정 파일에서 로드)
export const TEST_USERS: Record<string, TestUser> = {
  valid: {
    username: "test_user", // 실제로는 환경 변수에서 주입
    password: "test_password", // 실제로는 환경 변수에서 주입
    role: "user"
  },
  admin: {
    username: "admin_user", // 실제로는 환경 변수에서 주입
    password: "admin_password", // 실제로는 환경 변수에서 주입
    role: "admin"
  }
};

