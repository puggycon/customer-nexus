import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "Customer Nexus 계정을 새로 만듭니다.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
