"use client";

import { useMemo, useState } from "react";
import CustomerRow from "./CustomerRow";
import { useCustomers } from "./CustomerContext";
import { CUSTOMER_LIST_GRID_COLS } from "./customerListGrid";
import { SortIcon } from "./icons";
import type { Customer } from "./types";

type SortKey = "name" | "lastVisit";
type SortState = { key: SortKey; direction: "asc" | "desc" } | null;

export default function CustomerList() {
  const { customers, removeCustomer } = useCustomers();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>(null);

  const allSelected = customers.length > 0 && selectedIds.size === customers.length;

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  const sortedCustomers = useMemo(() => {
    if (!sort) return customers;
    const sorted = [...customers].sort((a, b) =>
      sort.key === "name"
        ? a.name.localeCompare(b.name, "ko")
        : a.lastVisit.localeCompare(b.lastVisit),
    );
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [customers, sort]);

  const tableRows = useMemo(
    () =>
      sortedCustomers.map((customer: Customer) => (
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
    [sortedCustomers, selectedIds, removeCustomer],
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
        <span className="flex items-center gap-1">
          고객 이름
          <button
            type="button"
            onClick={() => toggleSort("name")}
            aria-label="고객 이름 가나다순 정렬"
            className={`flex size-5 items-center justify-center rounded transition-colors hover:bg-zinc-200 ${
              sort?.key === "name" ? "text-zinc-900" : "text-zinc-400"
            }`}
          >
            <SortIcon
              className={`size-3.5 ${sort?.key === "name" && sort.direction === "desc" ? "scale-y-[-1]" : ""}`}
            />
          </button>
        </span>
        <span>모바일 번호</span>
        <span>태그</span>
        <span className="flex items-center gap-1">
          최근 방문일
          <button
            type="button"
            onClick={() => toggleSort("lastVisit")}
            aria-label="최근 방문일 순 정렬"
            className={`flex size-5 items-center justify-center rounded transition-colors hover:bg-zinc-200 ${
              sort?.key === "lastVisit" ? "text-zinc-900" : "text-zinc-400"
            }`}
          >
            <SortIcon
              className={`size-3.5 ${sort?.key === "lastVisit" && sort.direction === "desc" ? "scale-y-[-1]" : ""}`}
            />
          </button>
        </span>
        <span>상담 판매 약사</span>
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
