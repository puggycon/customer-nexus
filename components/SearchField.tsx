"use client";

import { useId, useState } from "react";
import { SearchIcon } from "./icons";

export default function SearchField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "date";
}) {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-2 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none"
        />
        <button
          type="button"
          aria-label={`${label} 검색 실행`}
          className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
        >
          <SearchIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
