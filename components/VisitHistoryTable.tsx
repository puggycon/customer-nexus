import { addDaysToDate } from "./dateUtils";
import type { Visit } from "./types";

const VISIT_HISTORY_GRID_COLS =
  "grid-cols-[1.2fr_1.6fr_1.1fr_1fr_1.2fr_2fr]";

export default function VisitHistoryTable({ visits }: { visits: Visit[] }) {
  if (visits.length === 0) {
    return (
      <p className="px-2 py-10 text-center text-sm text-zinc-400">
        방문/구매 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      <div
        className={`grid ${VISIT_HISTORY_GRID_COLS} gap-3 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-500`}
      >
        <span>방문 날짜</span>
        <span>구매 내역</span>
        <span>판매가격</span>
        <span>복용 기간</span>
        <span>다음 예상 방문일</span>
        <span>상담 내역 및 메모</span>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {visits.map((visit) => (
          <div
            key={visit.id}
            className={`grid ${VISIT_HISTORY_GRID_COLS} gap-3 border-b border-zinc-100 px-3 py-2.5 text-sm text-zinc-700 last:border-b-0`}
          >
            <span>{visit.visitDate}</span>
            <span className="truncate">{visit.product}</span>
            <span>{visit.price.toLocaleString()}원</span>
            <span>{visit.durationDays}일</span>
            <span>{addDaysToDate(visit.visitDate, visit.durationDays)}</span>
            <span className="truncate text-zinc-500">{visit.memo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
