"use client";

import { useState } from "react";
import { useCustomers } from "./CustomerContext";
import { formatToday } from "./dateUtils";
import type { Visit } from "./types";

export default function AddVisitForm({
  customerId,
  visit,
  onDone,
  onCancel,
}: {
  customerId: string;
  visit?: Visit;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { addVisit, updateVisit } = useCustomers();
  const [visitDate, setVisitDate] = useState(visit?.visitDate ?? formatToday());
  const [product, setProduct] = useState(visit?.product ?? "");
  const [price, setPrice] = useState(visit ? String(visit.price) : "");
  const [durationDays, setDurationDays] = useState(
    visit ? String(visit.durationDays) : "",
  );
  const [memo, setMemo] = useState(visit?.memo ?? "");
  const [pharmacist, setPharmacist] = useState(visit?.pharmacist ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!visitDate || !product.trim()) return;

    const input = {
      visitDate,
      product: product.trim(),
      price: Number(price) || 0,
      durationDays: Number(durationDays) || 0,
      memo: memo.trim(),
      pharmacist: pharmacist.trim(),
    };

    if (visit) {
      updateVisit(customerId, visit.id, input);
    } else {
      addVisit(customerId, input);
    }
    onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
            방문 날짜
          </label>
          <input
            type="date"
            required
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
            구매 내역 (제품명)
          </label>
          <input
            type="text"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="예: 암로디핀정 5mg"
            className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
            판매가격 (원)
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="18000"
            className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
            복용 기간 (일수)
          </label>
          <input
            type="number"
            min={0}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder="30"
            className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
          상담 내역 및 메모
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="상담 내용을 입력하세요"
          className="w-full resize-none rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
          상담 판매 약사
        </label>
        <input
          type="text"
          value={pharmacist}
          onChange={(e) => setPharmacist(e.target.value)}
          placeholder="예: 홍길동"
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
        >
          {visit ? "수정 완료" : "저장"}
        </button>
      </div>
    </form>
  );
}
