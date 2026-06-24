import { PlusIcon } from "./icons";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
        탑미래약국 고객 관리 프로그램
      </h1>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        <PlusIcon className="size-4" />
        새 고객 추가
      </button>
    </header>
  );
}
