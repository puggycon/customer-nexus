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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 추가 버튼 중복 클릭 방지: 저장이 진행 중이면 무시
    if (isSubmitting) return;
    if (!name.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await addCustomer({ name: name.trim(), mobile: mobile.trim(), tags: parsedTags });
      router.back();
    } catch {
      // 저장 실패 시 다시 시도할 수 있도록 잠금 해제
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[var(--text)]">새 고객 추가</h2>

      <div>
        <label
          htmlFor="customer-name"
          className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
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
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="customer-mobile"
          className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
        >
          모바일 번호
        </label>
        <input
          id="customer-mobile"
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="010-0000-0000"
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="customer-tags"
          className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
        >
          태그
        </label>
        <input
          id="customer-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="고혈압, 정기복용"
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)] disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
