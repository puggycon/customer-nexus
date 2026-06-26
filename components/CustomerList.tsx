"use client";

import { useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import CustomerRow from "./CustomerRow";
import { useCustomers } from "./CustomerContext";
import { useSelection } from "./SelectionContext";
import { useSearch, type SearchCriteria } from "./SearchContext";
import { CUSTOMER_LIST_GRID_COLS } from "./customerListGrid";
import { SortIcon } from "./icons";
import type { Customer } from "./types";

type SortKey = "name" | "lastVisit";
type SortState = { key: SortKey; direction: "asc" | "desc" } | null;

const digitsOnly = (value: string) => value.replace(/\D/g, "");

// 검색 기준에 맞는 고객인지 판별 (입력된 기준만 AND 로 적용)
function matchesCriteria(customer: Customer, criteria: SearchCriteria): boolean {
  // 이름·날짜·폰번호·약사: 일치(완전 일치)
  if (criteria.name && customer.name !== criteria.name) return false;
  if (criteria.date && customer.lastVisit !== criteria.date) return false;
  if (criteria.phone && digitsOnly(customer.mobile) !== criteria.phone) return false;
  if (criteria.pharmacist && customer.lastVisitPharmacist !== criteria.pharmacist) {
    return false;
  }
  // 태그·제품: 일치 또는 포함
  if (criteria.tag && !customer.tags.some((tag) => tag.includes(criteria.tag))) {
    return false;
  }
  if (
    criteria.product &&
    !customer.visits.some((visit) => visit.product.includes(criteria.product))
  ) {
    return false;
  }
  return true;
}

export default function CustomerList() {
  const { customers, removeCustomer } = useCustomers();
  const { selectedIds, toggle, replace, clear } = useSelection();
  const { criteria } = useSearch();
  const [sort, setSort] = useState<SortState>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const hasActiveSearch = Object.values(criteria).some((value) => value !== "");

  const filteredCustomers = useMemo(
    () => customers.filter((c) => matchesCriteria(c, criteria)),
    [customers, criteria],
  );

  const allSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every((c) => selectedIds.has(c.id));

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  const sortedCustomers = useMemo(() => {
    if (!sort) return filteredCustomers;
    const sorted = [...filteredCustomers].sort((a, b) =>
      sort.key === "name"
        ? a.name.localeCompare(b.name, "ko")
        : a.lastVisit.localeCompare(b.lastVisit),
    );
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [filteredCustomers, sort]);

  const tableRows = useMemo(
    () =>
      sortedCustomers.map((customer: Customer) => (
        <CustomerRow
          key={customer.id}
          customer={customer}
          checked={selectedIds.has(customer.id)}
          onCheckedChange={(checked) => toggle(customer.id, checked)}
          onDelete={() => setDeletingCustomer(customer)}
        />
      )),
    [sortedCustomers, selectedIds, toggle],
  );

  async function confirmDelete() {
    if (!deletingCustomer) return;
    await removeCustomer(deletingCustomer.id);
    toggle(deletingCustomer.id, false);
    setDeletingCustomer(null);
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div
        className={`grid ${CUSTOMER_LIST_GRID_COLS} items-center gap-4 border-b border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--text-sub)]`}
      >
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) =>
            e.target.checked
              ? replace(filteredCustomers.map((c) => c.id))
              : clear()
          }
          className="size-4 cursor-pointer rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          aria-label="전체 선택"
        />
        <span className="flex items-center gap-1">
          고객 이름
          <button
            type="button"
            onClick={() => toggleSort("name")}
            aria-label="고객 이름 가나다순 정렬"
            className={`flex size-5 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[var(--hover-bg)] ${
              sort?.key === "name" ? "text-[var(--accent)]" : "text-[var(--text-sub)]"
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
            className={`flex size-5 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[var(--hover-bg)] ${
              sort?.key === "lastVisit" ? "text-[var(--accent)]" : "text-[var(--text-sub)]"
            }`}
          >
            <SortIcon
              className={`size-3.5 ${sort?.key === "lastVisit" && sort.direction === "desc" ? "scale-y-[-1]" : ""}`}
            />
          </button>
        </span>
        <span>마지막 상담 판매 약사</span>
        <span />
      </div>
      {filteredCustomers.length > 0 ? (
        tableRows
      ) : (
        <p className="px-4 py-10 text-center text-sm text-[var(--text-sub)]">
          {hasActiveSearch ? "검색 결과가 없습니다." : "등록된 고객이 없습니다."}
        </p>
      )}
      {deletingCustomer && (
        <ConfirmDialog
          message={`${deletingCustomer.name} 고객을 삭제하시겠습니까?`}
          onCancel={() => setDeletingCustomer(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
