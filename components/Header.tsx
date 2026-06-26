"use client";

import Link from "next/link";
import { useState } from "react";
import SendSmsModal from "./SendSmsModal";
import RepurchaseModal from "./RepurchaseModal";
import { useSelection } from "./SelectionContext";
import { CalendarIcon, MessageIcon, PlusIcon } from "./icons";

export default function Header() {
  const { selectedIds } = useSelection();
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showRepurchaseModal, setShowRepurchaseModal] = useState(false);
  const selectedCount = selectedIds.size;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="페이지 새로고침"
          className="cursor-pointer transition-colors duration-200 hover:text-[var(--accent)]"
        >
          탑미래약국 고객 관리 프로그램
        </button>
      </h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowRepurchaseModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--hover-bg)] px-5 py-2.5 text-sm font-bold text-[var(--accent)] cursor-pointer transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
        >
          <CalendarIcon className="size-4" />
          재구매 예상 고객 확인
        </button>
        <button
          type="button"
          onClick={() => setShowSmsModal(true)}
          disabled={selectedCount === 0}
          title={selectedCount === 0 ? "고객을 선택해 주세요" : undefined}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--hover-bg)] px-5 py-2.5 text-sm font-bold text-[var(--accent)] transition-all duration-200 cursor-pointer hover:brightness-95 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)] disabled:hover:brightness-100 disabled:active:scale-100"
        >
          <MessageIcon className="size-4" />
          문자 발송
          {selectedCount > 0 && (
            <span className="rounded-full bg-[var(--accent)] px-1.5 text-xs font-bold text-white">
              {selectedCount}
            </span>
          )}
        </button>
        <Link
          href="/new"
          className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
        >
          <PlusIcon className="size-4" />
          새 고객 추가
        </Link>
      </div>
      {showSmsModal && <SendSmsModal onClose={() => setShowSmsModal(false)} />}
      {showRepurchaseModal && (
        <RepurchaseModal onClose={() => setShowRepurchaseModal(false)} />
      )}
    </header>
  );
}
