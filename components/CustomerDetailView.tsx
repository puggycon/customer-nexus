"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddVisitForm from "./AddVisitForm";
import ConfirmDialog from "./ConfirmDialog";
import { useCustomers } from "./CustomerContext";
import { PlusIcon } from "./icons";
import type { Visit } from "./types";
import VisitHistoryTable from "./VisitHistoryTable";

export default function CustomerDetailView({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const { customers, removeVisit } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<Visit | null>(null);
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-500">고객을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="self-end rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          닫기
        </button>
      </div>
    );
  }

  const sortedVisits = [...customer.visits].sort((a, b) =>
    b.visitDate.localeCompare(a.visitDate),
  );

  function closeForm() {
    setShowForm(false);
    setEditingVisit(null);
  }

  return (
    <div className="flex max-h-[85vh] flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {customer.name}
          </h2>
          <p className="text-sm text-zinc-500">{customer.mobile}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {customer.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          닫기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <VisitHistoryTable
          visits={sortedVisits}
          onEdit={(visit) => {
            setEditingVisit(visit);
            setShowForm(true);
          }}
          onDelete={(visit) => setDeletingVisit(visit)}
        />
      </div>

      {showForm ? (
        <AddVisitForm
          customerId={customer.id}
          visit={editingVisit ?? undefined}
          onDone={closeForm}
          onCancel={closeForm}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusIcon className="size-4" />
          새 방문/구매 기록 추가
        </button>
      )}

      {deletingVisit && (
        <ConfirmDialog
          message={`${deletingVisit.visitDate} 방문 기록(${deletingVisit.product})을 삭제하시겠습니까?`}
          onCancel={() => setDeletingVisit(null)}
          onConfirm={() => {
            removeVisit(customer.id, deletingVisit.id);
            setDeletingVisit(null);
          }}
        />
      )}
    </div>
  );
}
