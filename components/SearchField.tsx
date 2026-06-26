"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarIcon, SearchIcon } from "./icons";
import { formatDate } from "./dateUtils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatPhoneSuffix(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export default function SearchField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "date" | "phone";
}) {
  const id = useId();
  const isDate = type === "date";
  const isPhone = type === "phone";
  const [value, setValue] = useState("");
  const [phoneSuffix, setPhoneSuffix] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCalendar) return;
    function handleClickOutside(e: MouseEvent) {
      if (!fieldRef.current?.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

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
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-[var(--text-sub)]">
        {label}
      </label>
      <div className="relative" ref={fieldRef}>
        {isPhone ? (
          <div className="flex w-full items-center rounded-[10px] border border-[var(--border)] bg-[var(--card)] pr-8 transition-colors duration-200 focus-within:border-[var(--accent)]">
            <span className="select-none border-r border-[var(--border)] px-2 py-1.5 text-sm text-[var(--text-sub)]">
              010
            </span>
            <input
              id={id}
              type="text"
              inputMode="numeric"
              value={phoneSuffix}
              onChange={(e) => setPhoneSuffix(formatPhoneSuffix(e.target.value))}
              placeholder={placeholder}
              className="w-full bg-transparent px-2 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] focus:outline-none"
            />
          </div>
        ) : (
          <input
            id={id}
            type="text"
            readOnly={isDate}
            value={value}
            onChange={(e) => !isDate && setValue(e.target.value)}
            onClick={() => isDate && setShowCalendar((v) => !v)}
            placeholder={placeholder}
            className={`w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] py-1.5 pl-2 text-sm text-[var(--text)] placeholder:text-[var(--placeholder)] transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none ${
              isDate ? "cursor-pointer pr-14" : "pr-8"
            }`}
          />
        )}
        {isDate && (
          <button
            type="button"
            aria-label="달력 열기"
            onClick={() => setShowCalendar((v) => !v)}
            className="absolute right-8 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--text-sub)] transition-all duration-200 hover:scale-110 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
          >
            <CalendarIcon className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          aria-label={`${label} 검색 실행`}
          className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--text-sub)] transition-all duration-200 hover:scale-110 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
        >
          <SearchIcon className="size-3.5" />
        </button>

        {isDate && showCalendar && (
          <div className="absolute left-0 top-full z-20 mt-1 w-60 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => changeMonth(-1)}
                className="rounded-lg px-1.5 py-0.5 text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
              >
                ‹
              </button>
              <span className="text-sm font-bold text-[var(--text)]">
                {year}년 {month + 1}월
              </span>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => changeMonth(1)}
                className="rounded-lg px-1.5 py-0.5 text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className="text-[var(--text-sub)]">
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
                    className={`rounded-lg py-1 transition-colors duration-200 ${
                      isSelected
                        ? "bg-[var(--accent)] font-bold text-white"
                        : "text-[var(--text)] hover:bg-[var(--hover-bg)]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex justify-end border-t border-[var(--border)] pt-2">
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="rounded-full px-3 py-1 text-xs font-bold text-[var(--text-sub)] transition-colors duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
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
