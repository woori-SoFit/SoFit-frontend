import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { StepIndicator } from '../StepIndicator';
import { useSignupStore } from '../../../stores/signupStore';

describe('StepIndicator', () => {
  beforeEach(() => {
    // 스토어를 초기 상태로 리셋
    useSignupStore.getState().reset();
  });

  it('5개의 스텝 인디케이터를 렌더링한다', () => {
    render(<StepIndicator />);
    // 5개의 스텝 버튼이 존재해야 함
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('현재 스텝 번호와 총 스텝 수를 표시한다', () => {
    render(<StepIndicator />);
    // 초기 상태: "1 / 5" 형태로 표시됨
    const stepInfo = screen.getByText((_, element) => {
      return element?.tagName === 'P' && element.textContent === '1 / 5';
    });
    expect(stepInfo).toBeInTheDocument();
  });

  it('현재 스텝이 변경되면 스텝 번호가 업데이트된다', () => {
    // 2번째 스텝으로 이동
    useSignupStore.getState().nextStep();
    render(<StepIndicator />);
    const stepInfo = screen.getByText((_, element) => {
      return element?.tagName === 'P' && element.textContent === '2 / 5';
    });
    expect(stepInfo).toBeInTheDocument();
  });

  it('현재 스텝에 aria-current="step" 속성이 설정된다', () => {
    render(<StepIndicator />);
    const currentButton = screen.getByRole('button', { current: 'step' });
    expect(currentButton).toBeInTheDocument();
  });

  it('미완료 스텝 클릭 시 스텝이 변경되지 않는다', async () => {
    const user = userEvent.setup();
    render(<StepIndicator />);

    // 초기 상태(KYC)에서 미완료 스텝(약관동의) 클릭
    const incompleteButton = screen.getByLabelText('약관동의 단계 (미완료)');
    await user.click(incompleteButton);

    // 스텝이 변경되지 않아야 함
    expect(useSignupStore.getState().currentStep).toBe('KYC');
  });

  it('완료된 스텝 클릭 시 해당 스텝으로 이동한다', async () => {
    const user = userEvent.setup();
    // 3번째 스텝(CREDENTIALS)으로 이동
    useSignupStore.getState().nextStep(); // KYC → CUSTOMER_VERIFY
    useSignupStore.getState().nextStep(); // CUSTOMER_VERIFY → CREDENTIALS

    render(<StepIndicator />);

    // 완료된 첫 번째 스텝(KYC) 클릭
    const completedButton = screen.getByLabelText('KYC 단계 (완료)');
    await user.click(completedButton);

    // KYC 스텝으로 이동해야 함
    expect(useSignupStore.getState().currentStep).toBe('KYC');
  });

  it('미완료 스텝 버튼이 disabled 상태이다', () => {
    render(<StepIndicator />);
    // 초기 상태에서 2~5번째 스텝은 미완료
    const incompleteButton = screen.getByLabelText('완료 단계 (미완료)');
    expect(incompleteButton).toBeDisabled();
  });

  it('스텝 라벨이 올바르게 표시된다', () => {
    render(<StepIndicator />);
    expect(screen.getByText('KYC')).toBeInTheDocument();
    expect(screen.getByText('본인인증')).toBeInTheDocument();
    expect(screen.getByText('계정설정')).toBeInTheDocument();
    expect(screen.getByText('약관동의')).toBeInTheDocument();
    expect(screen.getByText('완료')).toBeInTheDocument();
  });
});
