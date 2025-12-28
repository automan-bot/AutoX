/**
 * Android 시스템 다이얼로그 닫기 Autox.js 스크립트
 * 시스템 알림, 업데이트 다이얼로그 등 자동 처리
 */

// Autox.js 시스템 다이얼로그 닫기 예시
// 실제 구현은 Autox.js API에 맞게 조정 필요

function dismissSystemDialogs() {
  // 뒤로 가기 키로 다이얼로그 닫기 시도
  back();
  sleep(500);
  
  // "취소" 또는 "닫기" 버튼 찾아서 클릭
  const cancelButton = textMatches(/취소|닫기|닫음/).findOne(3000);
  if (cancelButton) {
    cancelButton.click();
    sleep(500);
  }
  
  // ESC 키로 닫기 시도 (키보드가 있는 경우)
  KeyCode("KEYCODE_ESCAPE");
  sleep(500);
}

// 메인 실행
dismissSystemDialogs();

