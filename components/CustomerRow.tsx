"use client";

import { useRouter } from "next/navigation";
import { CUSTOMER_LIST_GRID_COLS } from "./customerListGrid";
import { TrashIcon } from "./icons";
import type { Customer } from "./types";

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

  return (
    <div
      onClick={() => router.push(`/customers/${customer.id}`)}
      className={`grid ${CUSTOMER_LIST_GRID_COLS} items-center gap-4 border-b border-zinc-100 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-zinc-100`}
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
      <span className="truncate text-sm text-zinc-600">{customer.mobile}</span>
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
