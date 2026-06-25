"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CUSTOMER_LIST_GRID_COLS } from "./customerListGrid";
import { PencilIcon, TrashIcon } from "./icons";
import { useCustomers } from "./CustomerContext";
import type { Customer } from "./types";

function formatMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return raw;
}

export default function CustomerRow({
  customer,
  checked,
  onCheckedChange,
  onDelete,
}: {
  customer: Customer;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const { updateMobile } = useCustomers();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const cancelledRef = useRef(false);

  function startEdit() {
    setEditValue(customer.mobile);
    setIsEditing(true);
  }

  function confirm() {
    updateMobile(customer.id, formatMobile(editValue));
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      confirm();
    } else if (e.key === "Escape") {
      cancelledRef.current = true;
      setIsEditing(false);
    }
  }

  function handleBlur() {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    confirm();
  }

  return (
    <div
      onClick={() => router.push(`/customers/${customer.id}`)}
      className={`group grid ${CUSTOMER_LIST_GRID_COLS} items-center gap-4 border-b border-zinc-100 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-zinc-100`}
    >
      <input
        type="checkbox"
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="size-4 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
        aria-label={`${customer.name} 선택`}
      />
      <span className="truncate text-sm font-medium text-zinc-900">
        {customer.name}
      </span>
      <div
        className="flex min-w-0 items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full rounded border border-zinc-300 px-1.5 py-0.5 text-sm text-zinc-900 focus:border-[royalblue] focus:outline focus:outline-2 focus:outline-[royalblue]"
          />
        ) : (
          <>
            <span className="truncate text-sm text-zinc-600">
              {formatMobile(customer.mobile)}
            </span>
            <button
              type="button"
              aria-label="모바일 번호 수정"
              onClick={startEdit}
              className="flex size-6 shrink-0 items-center justify-center rounded text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-200 hover:text-zinc-600"
            >
              <PencilIcon className="size-3.5" />
            </button>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {customer.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="truncate text-sm text-zinc-500">
        {customer.lastVisit}
      </span>
      <span className="truncate text-sm text-zinc-500">
        {customer.lastVisitPharmacist}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`${customer.name} 삭제`}
        className="flex size-8 items-center justify-center justify-self-end rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}
