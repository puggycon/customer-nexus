import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-4 font-sans">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--accent)]">
          탑미래약국 고객 관리 프로그램
        </h1>

        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              이메일
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              비밀번호
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password-confirm"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              비밀번호 확인
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
          >
            회원가입
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
