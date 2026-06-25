"use client";

import { useMemo, useState } from "react";
import CustomerRow from "./CustomerRow";
import { useCustomers } from "./CustomerContext";
import { CUSTOMER_LIST_GRID_COLS } from "./customerListGrid";

export default function CustomerList() {
  const { customers, removeCustomer } = useCustomers();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = customers.length > 0 && selectedIds.size === customers.length;

  const tableRows = useMemo(
    () =>
      customers.map((customer) => (
        <CustomerRow
          key={customer.id}
          customer={customer}
          checked={selectedIds.has(customer.id)}
          onCheckedChange={(checked) => {
            setSelectedIds((prev) => {
              const next = new Set(prev);
              if (checked) {
                next.add(customer.id);
              } else {
                next.delete(customer.id);
              }
              return next;
            });
          }}
          onDelete={() => {
            removeCustomer(customer.id);
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(customer.id);
              return next;
            });
          }}
        />
      )),
    [customers, selectedIds, removeCustomer],
  );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div
        className={`grid ${CUSTOMER_LIST_GRID_COLS} items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500`}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) =>
            setSelectedIds(
              e.target.checked ? new Set(customers.map((c) => c.id)) : new Set(),
            )
          }
          className="size-4 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
          aria-label="전체 선택"
        />
        <span>고객 이름</span>
        <span>모바일 번호</span>
        <span>태그</span>
        <span>최근 방문일</span>
        <span />
      </div>
      {customers.length > 0 ? (
        tableRows
      ) : (
        <p className="px-4 py-10 text-center text-sm text-zinc-400">
          등록된 고객이 없습니다.
        </p>
      )}
    </div>
  );
}
