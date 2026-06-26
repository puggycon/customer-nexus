"use client";

import { useEffect } from "react";
import { useCustomers } from "./CustomerContext";
import { addDaysToDate, formatToday } from "./dateUtils";
import { CloseIcon } from "./icons";

// 재구매 예정일을 현재 날짜 기준 D-3 ~ D-day 범위로 본다.
const WINDOW_DAYS = 3;

function daysBetween(fromStr: string, toStr: string) {
  const from = new Date(`${fromStr}T00:00:00`);
  const to = new Date(`${toStr}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export default function RepurchaseModal({ onClose }: { onClose: () => void }) {
  const { customers } = useCustomers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const today = formatToday();

  // 각 방문 구매내역마다 재구매 예정일(구매일 + 복용기간)을 구하고, D-3 ~ D-day 범위만 추린다.
  const items = customers
    .flatMap((c) =>
      c.visits
        .filter((v) => v.visitDate)
        .map((v) => {
          const expectedDate = addDaysToDate(v.visitDate, v.durationDays);
          return {
            key: `${c.id}-${v.id}`,
            name: c.name,
            product: v.product,
            expectedDate,
            daysUntil: daysBetween(today, expectedDate),
          };
        }),
    )
    .filter((item) => item.daysUntil >= 0 && item.daysUntil <= WINDOW_DAYS)
    .sort((a, b) => a.expectedDate.localeCompare(b.expectedDate));

  const gridCols = "grid-cols-[1.2fr_2fr_1.3fr_3.5rem]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-lg flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">
              재구매 예상 고객
            </h2>
            <p className="mt-1 text-sm text-[var(--text-sub)]">
              재구매 예정일이 오늘부터 D-{WINDOW_DAYS} ~ D-day인 고객입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <div
              className={`grid ${gridCols} gap-3 border-b border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--text-sub)]`}
            >
              <span>고객 이름</span>
              <span>제품 이름</span>
              <span>재구매 예정일</span>
              <span className="text-right">D-Day</span>
            </div>
            <div className="max-h-[55vh] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`grid ${gridCols} items-center gap-3 border-b border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] last:border-b-0`}
                >
                  <span className="truncate font-bold">{item.name}</span>
                  <span className="truncate text-[var(--text-sub)]">
                    {item.product}
                  </span>
                  <span className="text-[var(--text-sub)]">
                    {item.expectedDate}
                  </span>
                  <span
                    className={`justify-self-end rounded-full px-2 py-0.5 text-xs font-bold ${
                      item.daysUntil === 0
                        ? "bg-[#fdecee] text-[var(--error)]"
                        : "bg-[var(--hover-bg)] text-[var(--accent)]"
                    }`}
                  >
                    {item.daysUntil === 0 ? "D-DAY" : `D-${item.daysUntil}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-sub)]">
            재구매 예정 고객이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
