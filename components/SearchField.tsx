"use client";

import { useId, useState } from "react";
import { CalendarIcon, SearchIcon } from "./icons";
import { formatDate } from "./dateUtils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

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
  const isDate = type === "date";
  const [value, setValue] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  function selectDay(day: number) {
    setValue(formatDate(new Date(year, month, day)));
    setShowCalendar(false);
  }

  function changeMonth(offset: number) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly={isDate}
          value={value}
          onChange={(e) => !isDate && setValue(e.target.value)}
          onClick={() => isDate && setShowCalendar((v) => !v)}
          placeholder={placeholder}
          className={`w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[royalblue] focus:bg-white focus:outline focus:outline-2 focus:outline-[royalblue] ${
            isDate ? "cursor-pointer pr-14" : "pr-8"
          }`}
        />
        {isDate && (
          <button
            type="button"
            aria-label="달력 열기"
            onClick={() => setShowCalendar((v) => !v)}
            className="absolute right-8 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-zinc-400 transition-all hover:scale-110 hover:bg-zinc-200 hover:text-zinc-600"
          >
            <CalendarIcon className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          aria-label={`${label} 검색 실행`}
          className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-zinc-400 transition-all hover:scale-110 hover:bg-zinc-200 hover:text-zinc-600"
        >
          <SearchIcon className="size-3.5" />
        </button>

        {isDate && showCalendar && (
          <div className="absolute left-0 top-full z-20 mt-1 w-60 rounded-md border border-zinc-200 bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => changeMonth(-1)}
                className="rounded px-1.5 py-0.5 text-zinc-500 hover:bg-zinc-100"
              >
                ‹
              </button>
              <span className="text-sm font-medium text-zinc-700">
                {year}년 {month + 1}월
              </span>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => changeMonth(1)}
                className="rounded px-1.5 py-0.5 text-zinc-500 hover:bg-zinc-100"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className="text-zinc-400">
                  {weekday}
                </span>
              ))}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selectedDate !== null &&
                  selectedDate.getFullYear() === year &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getDate() === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`rounded py-1 ${
                      isSelected
                        ? "bg-[royalblue] text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex justify-end border-t border-zinc-100 pt-2">
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="rounded-full px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
