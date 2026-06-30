import type { Metadata } from "next";
import CustomerDetailView from "@/components/CustomerDetailView";

export const metadata: Metadata = {
  title: "고객 상세",
  description: "고객의 상세 정보와 방문 이력을 확인합니다.",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-6xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <CustomerDetailView customerId={id} />
      </div>
    </div>
  );
}
