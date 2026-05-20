import { describe, it, expect } from "vitest";
import {
  filterBusinessNumber,
  formatResidentNumber,
  formatPhoneNumber,
  isValidLoginId,
  isValidPassword,
  isCustomerVerifyValid,
  isCredentialsFormValid,
} from "../signupValidation";

describe("filterBusinessNumber", () => {
  it("숫자만 필터링한다", () => {
    expect(filterBusinessNumber("123-45-67890")).toBe("1234567890");
  });

  it("최대 10자리로 제한한다", () => {
    expect(filterBusinessNumber("12345678901234")).toBe("1234567890");
  });

  it("영문과 특수문자를 제거한다", () => {
    expect(filterBusinessNumber("abc123def456")).toBe("123456");
  });

  it("빈 문자열을 처리한다", () => {
    expect(filterBusinessNumber("")).toBe("");
  });

  it("숫자가 없는 문자열은 빈 문자열을 반환한다", () => {
    expect(filterBusinessNumber("abcdef")).toBe("");
  });
});

describe("formatResidentNumber", () => {
  it("7자리 숫자를 XXXXXX-X****** 형식으로 포맷팅한다", () => {
    expect(formatResidentNumber("9901011")).toBe("990101-1******");
  });

  it("6자리 이하는 그대로 반환한다", () => {
    expect(formatResidentNumber("990101")).toBe("990101");
  });

  it("3자리는 그대로 반환한다", () => {
    expect(formatResidentNumber("990")).toBe("990");
  });

  it("빈 문자열을 처리한다", () => {
    expect(formatResidentNumber("")).toBe("");
  });

  it("7자리 초과 입력은 7자리까지만 사용한다", () => {
    expect(formatResidentNumber("99010123")).toBe("990101-2******");
  });
});

describe("formatPhoneNumber", () => {
  it("11자리를 3-4-4 형식으로 포맷팅한다", () => {
    expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
  });

  it("3자리 이하는 그대로 반환한다", () => {
    expect(formatPhoneNumber("010")).toBe("010");
  });

  it("4~7자리는 3-X 형식으로 포맷팅한다", () => {
    expect(formatPhoneNumber("0101234")).toBe("010-1234");
  });

  it("8~11자리는 3-4-X 형식으로 포맷팅한다", () => {
    expect(formatPhoneNumber("01012345")).toBe("010-1234-5");
  });

  it("빈 문자열을 처리한다", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  it("11자리 초과 입력은 11자리까지만 사용한다", () => {
    expect(formatPhoneNumber("010123456789")).toBe("010-1234-5678");
  });
});

describe("isValidLoginId", () => {
  it("영문 소문자+숫자 4~20자는 유효하다", () => {
    expect(isValidLoginId("user1")).toBe(true);
    expect(isValidLoginId("abcd")).toBe(true);
    expect(isValidLoginId("a1b2c3d4")).toBe(true);
  });

  it("4자 미만은 무효하다", () => {
    expect(isValidLoginId("abc")).toBe(false);
    expect(isValidLoginId("a")).toBe(false);
  });

  it("20자 초과는 무효하다", () => {
    expect(isValidLoginId("a".repeat(21))).toBe(false);
  });

  it("대문자가 포함되면 무효하다", () => {
    expect(isValidLoginId("User1234")).toBe(false);
  });

  it("특수문자가 포함되면 무효하다", () => {
    expect(isValidLoginId("user@123")).toBe(false);
  });

  it("빈 문자열은 무효하다", () => {
    expect(isValidLoginId("")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("영문+숫자+특수문자 각 1자 이상, 8~20자는 유효하다", () => {
    expect(isValidPassword("Pass1234!")).toBe(true);
    expect(isValidPassword("abcd123@")).toBe(true);
  });

  it("8자 미만은 무효하다", () => {
    expect(isValidPassword("Pa1!")).toBe(false);
  });

  it("20자 초과는 무효하다", () => {
    expect(isValidPassword("a1!" + "a".repeat(18))).toBe(false);
  });

  it("숫자가 없으면 무효하다", () => {
    expect(isValidPassword("Password!")).toBe(false);
  });

  it("특수문자가 없으면 무효하다", () => {
    expect(isValidPassword("Password1")).toBe(false);
  });

  it("영문이 없으면 무효하다", () => {
    expect(isValidPassword("12345678!")).toBe(false);
  });

  it("빈 문자열은 무효하다", () => {
    expect(isValidPassword("")).toBe(false);
  });
});

describe("isCustomerVerifyValid", () => {
  it("모든 조건을 충족하면 true를 반환한다", () => {
    expect(isCustomerVerifyValid("홍길동", "9901011", "01012345678", "123456")).toBe(true);
  });

  it("이름이 2자 미만이면 false를 반환한다", () => {
    expect(isCustomerVerifyValid("홍", "9901011", "01012345678", "123456")).toBe(false);
  });

  it("주민번호가 7자리가 아니면 false를 반환한다", () => {
    expect(isCustomerVerifyValid("홍길동", "990101", "01012345678", "123456")).toBe(false);
  });

  it("연락처가 11자리가 아니면 false를 반환한다", () => {
    expect(isCustomerVerifyValid("홍길동", "9901011", "0101234567", "123456")).toBe(false);
  });

  it("PIN이 6자리가 아니면 false를 반환한다", () => {
    expect(isCustomerVerifyValid("홍길동", "9901011", "01012345678", "12345")).toBe(false);
  });

  it("이름이 공백만 있으면 false를 반환한다", () => {
    expect(isCustomerVerifyValid("  ", "9901011", "01012345678", "123456")).toBe(false);
  });
});

describe("isCredentialsFormValid", () => {
  it("모든 조건을 충족하면 true를 반환한다", () => {
    expect(isCredentialsFormValid("user1234", "Pass123!", "Pass123!", true)).toBe(true);
  });

  it("아이디가 유효하지 않으면 false를 반환한다", () => {
    expect(isCredentialsFormValid("ab", "Pass123!", "Pass123!", true)).toBe(false);
  });

  it("중복확인이 완료되지 않으면 false를 반환한다", () => {
    expect(isCredentialsFormValid("user1234", "Pass123!", "Pass123!", false)).toBe(false);
  });

  it("비밀번호가 유효하지 않으면 false를 반환한다", () => {
    expect(isCredentialsFormValid("user1234", "pass", "pass", true)).toBe(false);
  });

  it("비밀번호가 일치하지 않으면 false를 반환한다", () => {
    expect(isCredentialsFormValid("user1234", "Pass123!", "Pass456!", true)).toBe(false);
  });
});
