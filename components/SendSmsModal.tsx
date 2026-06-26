"use client";

import { useEffect, useState } from "react";
import { useCustomers } from "./CustomerContext";
import { useSelection } from "./SelectionContext";

export default function SendSmsModal({ onClose }: { onClose: () => void }) {
  const { customers } = useCustomers();
  const { selectedIds } = useSelection();
  const [message, setMessage] = useState("");

  const recipients = customers.filter((c) => selectedIds.has(c.id));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: 발송 API 연동 예정. 현재는 입력만 받고 모달을 닫는다.
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSend}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
      >
        <div>
          <h2 className="text-xl font-bold text-[var(--text)]">문자 발송</h2>
          <p className="mt-1 text-sm text-[var(--text-sub)]">
            선택한 {recipients.length}명에게 발송합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipients.map((c) => (
            <span
              key={c.id}
              className="rounded-lg bg-[var(--hover-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]"
            >
              {c.name}
            </span>
          ))}
        </div>

        <div>
          <label
            htmlFor="sms-message"
            className="mb-1 block text-xs font-bold text-[var(--text-sub)]"
          >
            메시지 내용
          </label>
          <textarea
            id="sms-message"
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="보낼 메시지를 입력하세요"
            className="w-full resize-none rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)] disabled:hover:bg-[var(--border)] disabled:active:scale-100"
          >
            발송
          </button>
        </div>
      </form>
    </div>
  );
}
