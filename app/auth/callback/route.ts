import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// 이메일의 비밀번호 리셋 링크가 향하는 경로. URL의 code 를 세션으로 교환한 뒤
// next 파라미터(기본: 비밀번호 재설정 페이지)로 이동시킨다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // code 가 없거나 교환에 실패하면 링크가 만료된 것으로 보고 비밀번호 찾기 페이지로 보낸다.
  return NextResponse.redirect(`${origin}/forgot-password`);
}
