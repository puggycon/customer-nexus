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
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            방문 날짜
          </label>
          <input
            type="date"
            required
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            구매 내역 (제품명)
          </label>
          <input
            type="text"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="예: 암로디핀정 5mg"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            판매가격 (원)
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="18000"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            복용 기간 (일수)
          </label>
          <input
            type="number"
            min={0}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            placeholder="30"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">
          상담 내역 및 메모
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="상담 내용을 입력하세요"
          className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">
          상담 판매 약사
        </label>
        <input
          type="text"
          value={pharmacist}
          onChange={(e) => setPharmacist(e.target.value)}
          placeholder="예: 홍길동"
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none"
        />
      </div>
      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          {visit ? "수정 완료" : "저장"}
        </button>
      </div>
    </form>
  );
}
