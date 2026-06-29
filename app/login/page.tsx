"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import kakaoLoginImage from "@/public/kakao_login_large_wide.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  // 이메일, 비밀번호가 모두 입력됐을 때만 로그인 버튼 활성화
  const canSubmit = email.trim() !== "" && password.trim() !== "";

  // 토스트 메세지는 일정 시간 후 자동으로 사라지게 함
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setToast("이메일 또는 비밀번호가 올바르지 않습니다.");
        setIsSubmitting(false);
        return;
      }

      // 로그인 성공 시 인덱스 페이지로 이동
      router.push("/");
    } catch {
      setToast("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  }

  // 카카오 OAuth 로그인. 성공 시 카카오 인증 페이지로 리다이렉트되고,
  // 인증 후 /auth/callback 에서 code 를 세션으로 교환한 뒤 인덱스로 이동한다.
  async function handleKakaoLogin() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setToast("카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        setIsSubmitting(false);
      }
    } catch {
      setToast("카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-4 font-sans">
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
        >
          {toast}
        </div>
      )}

      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--accent)]">
          탑미래약국 고객 관리 프로그램
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 w-full rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--accent)] disabled:active:scale-100"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isSubmitting}
            aria-label="카카오 로그인"
            className="block w-full overflow-hidden rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-100 disabled:active:scale-100"
          >
            <Image
              src={kakaoLoginImage}
              alt="카카오 로그인"
              className="h-auto w-full"
              priority
            />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          비밀번호를 잊으셨나요?{" "}
          <Link
            href="/forgot-password"
            className="font-bold text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
          >
            비밀번호 찾기
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-[var(--text-sub)]">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-bold text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
