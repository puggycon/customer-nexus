import Link from "next/link";
import { PlusIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
        탑미래약국 고객 관리 프로그램
      </h1>
      <Link
        href="/new"
        className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        <PlusIcon className="size-4" />
        새 고객 추가
      </Link>
    </header>
  );
}
