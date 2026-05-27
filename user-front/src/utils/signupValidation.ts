/**
 * 회원가입 유효성 검증 유틸리티
 */

/**
 * 사업자등록번호 입력 필터링
 * 숫자만 허용하고 최대 10자리로 제한한다.
 * @param input 사용자 입력 문자열
 * @returns 숫자만 포함된 최대 10자리 문자열
 */
export function filterBusinessNumber(input: string): string {
  return input.replace(/[^0-9]/g, "").slice(0, 10);
}

/**
 * 사업자등록번호 포맷팅
 * 10자리 숫자를 "XXX-XX-XXXXX" 형식으로 포맷팅한다.
 * @param digits 숫자만 포함된 문자열 (최대 10자리)
 * @returns 하이픈이 삽입된 사업자등록번호 문자열
 */
export function formatBusinessNumber(digits: string): string {
  const cleaned = digits.replace(/[^0-9]/g, "").slice(0, 10);

  if (cleaned.length <= 3) {
    return cleaned;
  }

  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
}

/**
 * 주민번호 포맷팅
 * 7자리 숫자를 "XXXXXX-X******" 형식으로 포맷팅한다.
 * 7자리 미만인 경우 입력된 만큼만 포맷팅한다.
 * @param digits 숫자만 포함된 문자열 (최대 7자리)
 * @returns 포맷팅된 주민번호 문자열
 */
export function formatResidentNumber(digits: string): string {
  const cleaned = digits.replace(/[^0-9]/g, "").slice(0, 7);

  if (cleaned.length <= 6) {
    return cleaned;
  }

  const front = cleaned.slice(0, 6);
  const back = cleaned.slice(6, 7);
  return `${front}-${back}${"*".repeat(6)}`;
}

/**
 * 연락처 포맷팅
 * 숫자를 3-4-4 형식으로 하이픈을 자동 삽입한다.
 * @param digits 숫자만 포함된 문자열 (최대 11자리)
 * @returns 하이픈이 삽입된 연락처 문자열
 */
export function formatPhoneNumber(digits: string): string {
  const cleaned = digits.replace(/[^0-9]/g, "").slice(0, 11);

  if (cleaned.length <= 3) {
    return cleaned;
  }

  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
}

/**
 * 아이디 유효성 검증
 * 영문 소문자 + 숫자 조합, 4~20자
 * @param id 아이디 문자열
 * @returns 유효 여부
 */
export function isValidLoginId(id: string): boolean {
  return /^[a-z0-9]{4,20}$/.test(id);
}

/**
 * 비밀번호 유효성 검증
 * 영문, 숫자, 특수문자 각 1자 이상 포함, 8~20자
 * @param pw 비밀번호 문자열
 * @returns 유효 여부
 */
export function isValidPassword(pw: string): boolean {
  if (pw.length < 8 || pw.length > 20) {
    return false;
  }

  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);

  return hasLetter && hasDigit && hasSpecial;
}

/**
 * Step 2 (CustomerVerify) 폼 유효성 검증
 * 이름 2자 이상, 주민번호 7자리, 연락처 11자리, PIN 6자리
 * @param name 이름
 * @param residentNumber 주민번호 숫자 (7자리)
 * @param phone 연락처 숫자 (11자리)
 * @param pin PIN 숫자 (6자리)
 * @returns 폼 유효 여부
 */
export function isCustomerVerifyValid(
  name: string,
  residentNumber: string,
  phone: string,
  pin: string
): boolean {
  const isNameValid = name.trim().length >= 2;
  const isResidentValid = /^\d{7}$/.test(residentNumber);
  const isPhoneValid = /^\d{11}$/.test(phone);
  const isPinValid = /^\d{6}$/.test(pin);

  return isNameValid && isResidentValid && isPhoneValid && isPinValid;
}

/**
 * Step 3 (Credentials) 폼 완성도 검증
 * 아이디 유효 + 중복확인 완료 + 비밀번호 유효 + 비밀번호 일치
 * @param loginId 아이디
 * @param password 비밀번호
 * @param passwordConfirm 비밀번호 확인
 * @param isIdChecked 아이디 중복확인 완료 여부
 * @returns 폼 완성 여부
 */
export function isCredentialsFormValid(
  loginId: string,
  password: string,
  passwordConfirm: string,
  isIdChecked: boolean
): boolean {
  return (
    isValidLoginId(loginId) &&
    isIdChecked &&
    isValidPassword(password) &&
    password === passwordConfirm
  );
}
