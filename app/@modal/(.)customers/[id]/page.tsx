import CustomerDetailView from "@/components/CustomerDetailView";
import Modal from "@/components/Modal";

export default async function CustomerDetailModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal widthClassName="max-w-3xl">
      <CustomerDetailView customerId={id} />
    </Modal>
  );
}
