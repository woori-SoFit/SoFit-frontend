import mainLogo from "@/assets/mainLogo.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-card">
        {/* 로고 */}
        <div className="flex justify-center mb-4">
          <img src={mainLogo} alt="SoFit 로고" className="h-14" />
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
              아이디
            </label>
            <input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
