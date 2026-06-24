"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomers } from "./CustomerContext";

export default function NewCustomerForm() {
  const router = useRouter();
  const { addCustomer } = useCustomers();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [tags, setTags] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    addCustomer({ name: name.trim(), mobile: mobile.trim(), tags: parsedTags });
    router.back();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900">새 고객 추가</h2>

      <div>
        <label
          htmlFor="customer-name"
          className="mb-1 block text-xs font-medium text-zinc-500"
        >
          고객 이름
        </label>
        <input
          id="customer-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="customer-mobile"
          className="mb-1 block text-xs font-medium text-zinc-500"
        >
          모바일 번호
        </label>
        <input
          id="customer-mobile"
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="010-0000-0000"
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="customer-tags"
          className="mb-1 block text-xs font-medium text-zinc-500"
        >
          태그
        </label>
        <input
          id="customer-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="고혈압, 정기복용"
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          저장
        </button>
      </div>
    </form>
  );
}
