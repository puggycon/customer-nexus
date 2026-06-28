"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  // 새 비밀번호와 비밀번호 확인이 모두 입력됐을 때만 버튼 활성화
  const canSubmit = password.trim() !== "" && passwordConfirm.trim() !== "";

  // 토스트 메세지는 일정 시간 후 자동으로 사라지게 함
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    // 새 비밀번호와 확인 값이 일치하는지 검사
    if (password !== passwordConfirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setToast("비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.");
        setIsSubmitting(false);
        return;
      }

      // 재설정 성공 시 인덱스 페이지로 이동
      router.push("/");
      router.refresh();
    } catch {
      setToast("비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.");
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
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-[var(--accent)]">
          비밀번호 재설정
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--text-sub)]">
          새로운 비밀번호를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              새 비밀번호
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="new-password-confirm"
              className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
            >
              새 비밀번호 확인
            </label>
            <input
              id="new-password-confirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 w-full rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--accent)] disabled:active:scale-100"
          >
            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
