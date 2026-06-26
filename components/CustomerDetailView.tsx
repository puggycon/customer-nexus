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
        <p className="text-sm text-[var(--text-sub)]">고객을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="self-end rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
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
          <h2 className="text-xl font-bold text-[var(--text)]">
            {customer.name}
          </h2>
          <p className="text-sm text-[var(--text-sub)]">{customer.mobile}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {customer.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[var(--hover-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl px-3 py-1.5 text-sm font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
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
          className="flex items-center justify-center gap-1.5 self-start rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
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
