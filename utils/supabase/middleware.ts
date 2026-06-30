import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not run code between createServerClient and getUser().
  // A simple mistake could make it very hard to debug issues with users
  // being randomly logged out. This call refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 사용자는 보호된 페이지(상단 헤더/사이드바/메인/고객 입력창)에
  // 접근할 수 없도록 로그인 페이지로 리다이렉트한다. 로그인/회원가입/비밀번호 찾기
  // 페이지는 예외이며, 비밀번호 리셋 링크를 처리하는 /auth 경로도 허용한다.
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");
  const isAuthCallback = pathname.startsWith("/auth");
  // 개인정보 처리방침은 인증 여부와 무관하게 누구나 접근할 수 있어야 한다.
  const isPublicPage = pathname.startsWith("/privacy");

  if (!user && !isAuthPage && !isAuthCallback && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 로그인/회원가입/비밀번호 찾기 페이지로 접근하면 인덱스로 보낸다.
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: Return the supabaseResponse object as-is so the refreshed
  // session cookies are preserved.
  return supabaseResponse;
};
