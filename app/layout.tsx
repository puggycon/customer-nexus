import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { CustomerProvider } from "@/components/CustomerContext";
import { SelectionProvider } from "@/components/SelectionContext";
import { SearchProvider } from "@/components/SearchContext";
import AuthWatcher from "@/components/AuthWatcher";
import { createClient } from "@/utils/supabase/server";
import { getCustomers } from "@/utils/customers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Customer Nexus";
const siteDescription = "고객 정보와 방문 이력을 한곳에서 관리하는 고객 관리 서비스";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // 각 페이지에서 title 을 지정하면 "페이지명 | Customer Nexus" 형태로 합쳐진다.
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName,
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    // public/thumbnail.png 을 공유 시 노출되는 썸네일(오픈그래프 이미지)로 사용한다.
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/thumbnail.png"],
  },
  // 파비콘은 app/favicon.ico 파일 컨벤션으로 자동 인식된다.
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  // 현재 로그인한 사용자를 확인하고, 본인 데이터만 불러온다.
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const customers = user ? await getCustomers(user.id) : [];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthWatcher currentUserId={user?.id ?? null} />
        {/* key 를 사용자 id 로 지정해, 계정이 바뀌면 Provider 가 새로 마운트되어
            데이터(클라이언트 상태)가 처음부터 다시 초기화되도록 한다. */}
        <CustomerProvider key={user?.id ?? "logged-out"} initialCustomers={customers}>
          <SelectionProvider>
            <SearchProvider>
              {children}
              {modal}
            </SearchProvider>
          </SelectionProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
