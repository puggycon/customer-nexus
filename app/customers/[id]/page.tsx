import CustomerDetailView from "@/components/CustomerDetailView";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-6xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <CustomerDetailView customerId={id} />
      </div>
    </div>
  );
}
