"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LogoutIcon } from "./icons";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    // 로그아웃 진행 중 중복 클릭 방지
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // 로그아웃 후 로그인 페이지로 이동하고 서버 상태를 갱신한다.
      router.push("/login");
      router.refresh();
    } catch {
      // 로그아웃 실패 시 다시 시도할 수 있도록 잠금 해제
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      aria-label="로그아웃"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex size-9 items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogoutIcon className="size-5" />
    </button>
  );
}
