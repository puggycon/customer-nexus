import Link from "next/link";
import SearchField from "./SearchField";
import LogoutButton from "./LogoutButton";
import { SettingsIcon } from "./icons";

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-col gap-4 p-4">
        <SearchField label="이름" placeholder="고객 이름 검색" field="name" />
        <SearchField label="제품" placeholder="제품명 검색" field="product" />
        <SearchField label="태그" placeholder="태그 검색" field="tag" />
        <SearchField label="날짜" placeholder="방문일 검색" type="date" field="date" />
        <SearchField label="폰 번호 검색" placeholder="0000-0000" type="phone" field="phone" />
        <SearchField label="마지막 상담 판매 약사" placeholder="약사명 검색" field="pharmacist" />
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="flex items-center gap-2 p-4">
          <button
            type="button"
            aria-label="설정 및 옵션"
            className="flex size-9 items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
          >
            <SettingsIcon className="size-5" />
          </button>
          <LogoutButton />
        </div>
        <Link
          href="/privacy"
          className="block px-4 pb-4 text-xs text-gray-500 hover:underline"
        >
          개인정보 처리방침
        </Link>
      </div>
    </aside>
  );
}
