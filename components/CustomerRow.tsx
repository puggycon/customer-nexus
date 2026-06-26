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
  const { updateMobile, updateTags } = useCustomers();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const cancelledRef = useRef(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagsValue, setTagsValue] = useState("");
  const tagsCancelledRef = useRef(false);

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

  function startTagEdit() {
    setTagsValue(customer.tags.join(", "));
    setIsEditingTags(true);
  }

  function confirmTags() {
    const parsedTags = tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    updateTags(customer.id, parsedTags);
    setIsEditingTags(false);
  }

  function handleTagsKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      confirmTags();
    } else if (e.key === "Escape") {
      tagsCancelledRef.current = true;
      setIsEditingTags(false);
    }
  }

  function handleTagsBlur() {
    if (tagsCancelledRef.current) {
      tagsCancelledRef.current = false;
      return;
    }
    confirmTags();
  }

  return (
    <div
      onClick={() => router.push(`/customers/${customer.id}`)}
      className={`group grid ${CUSTOMER_LIST_GRID_COLS} items-center gap-4 border-b border-[var(--border)] px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-[var(--hover-bg)]`}
    >
      <input
        type="checkbox"
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="size-4 cursor-pointer rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
        aria-label={`${customer.name} 선택`}
      />
      <span className="flex min-w-0 items-baseline gap-2">
        <span className="shrink-0 text-xs font-bold text-[var(--text-sub)] tabular-nums">
          No.{customer.id}
        </span>
        <span className="truncate text-sm font-bold text-[var(--text)]">
          {customer.name}
        </span>
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
            className="w-full rounded-lg border border-[var(--border)] px-1.5 py-0.5 text-sm text-[var(--text)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        ) : (
          <>
            <span className="truncate text-sm text-[var(--text-sub)]">
              {formatMobile(customer.mobile)}
            </span>
            <button
              type="button"
              aria-label="모바일 번호 수정"
              onClick={startEdit}
              className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[var(--text-sub)] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
            >
              <PencilIcon className="size-3.5" />
            </button>
          </>
        )}
      </div>
      <div
        className="flex min-w-0 flex-wrap items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditingTags ? (
          <input
            autoFocus
            type="text"
            value={tagsValue}
            onChange={(e) => setTagsValue(e.target.value)}
            onKeyDown={handleTagsKeyDown}
            onBlur={handleTagsBlur}
            placeholder="태그 (쉼표로 구분)"
            className="w-full rounded-lg border border-[var(--border)] px-1.5 py-0.5 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        ) : (
          <>
            {customer.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[var(--hover-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
            <button
              type="button"
              aria-label="태그 수정"
              onClick={startTagEdit}
              className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[var(--text-sub)] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
            >
              <PencilIcon className="size-3.5" />
            </button>
          </>
        )}
      </div>
      <span className="truncate text-sm text-[var(--text-sub)]">
        {customer.lastVisit}
      </span>
      <span className="truncate text-sm text-[var(--text-sub)]">
        {customer.lastVisitPharmacist}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`${customer.name} 삭제`}
        className="flex size-8 items-center justify-center justify-self-end rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[#fdecee] hover:text-[var(--error)]"
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  );
}
