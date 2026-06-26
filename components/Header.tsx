import Link from "next/link";
import { PlusIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
        탑미래약국 고객 관리 프로그램
      </h1>
      <Link
        href="/new"
        className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
      >
        <PlusIcon className="size-4" />
        새 고객 추가
      </Link>
    </header>
  );
}
