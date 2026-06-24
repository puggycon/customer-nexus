import NewCustomerForm from "@/components/NewCustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <NewCustomerForm />
      </div>
    </div>
  );
}
