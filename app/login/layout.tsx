import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "Customer Nexus 에 로그인합니다.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
