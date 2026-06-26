import CustomerDetailView from "@/components/CustomerDetailView";

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
