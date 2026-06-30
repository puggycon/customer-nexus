"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  // 이메일을 입력해야만 발송 버튼 활성화
  const canSubmit = email.trim() !== "";

  // 토스트 메세지는 일정 시간 후 자동으로 사라지게 함
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      // 리셋 링크 클릭 시 /auth/callback 에서 세션을 교환한 뒤
      // 비밀번호 재설정 페이지(/reset-password)로 이동시킨다.
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setToast({ message: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.", type: "error" });
        setIsSubmitting(false);
        return;
      }

      setToast({
        message: "비밀번호 재설정 링크를 이메일로 보냈습니다. 메일함을 확인해 주세요.",
        type: "success",
      });
      setIsSubmitting(false);
    } catch {
      setToast({ message: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.", type: "error" });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center bg-[var(--background)] px-4 font-sans">
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
          style={{
            backgroundColor: toast.type === "error" ? "var(--error)" : "var(--success)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-[var(--accent)]">
          약국 고객 관리
          <br />
          Customer Nexus
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--text-sub)]">
          가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              이메일
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 w-full rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--accent)] disabled:active:scale-100"
          >
            {isSubmitting ? "발송 중..." : "비밀번호 리셋 링크 발송"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          <Link
            href="/login"
            className="font-bold text-[var(--accent)] transition-colors duration-200 hover:text-[var(--accent-hover)]"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
