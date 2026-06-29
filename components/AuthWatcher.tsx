"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// 로그인 계정이 바뀌면(다른 사용자로 로그인 / 로그아웃) 서버 컴포넌트를 다시 실행해
// 데이터를 처음부터 다시 불러오게 한다. currentUserId 는 서버에서 렌더링된 시점의 사용자.
export default function AuthWatcher({
  currentUserId,
}: {
  currentUserId: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUserId = session?.user?.id ?? null;
      // 토큰 갱신 등 같은 계정 이벤트는 무시하고, 계정이 실제로 바뀐 경우에만 새로고침
      if (newUserId !== currentUserId) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [currentUserId, router]);

  return null;
}
