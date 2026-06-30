import type { Metadata } from "next";
import NewCustomerForm from "@/components/NewCustomerForm";

export const metadata: Metadata = {
  title: "새 고객 등록",
  description: "새로운 고객 정보를 등록합니다.",
};

export default function NewCustomerPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <NewCustomerForm />
      </div>
    </div>
  );
}
