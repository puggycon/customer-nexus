import { addDaysToDate } from "./dateUtils";
import { PencilIcon, TrashIcon } from "./icons";
import type { Visit } from "./types";

const VISIT_HISTORY_GRID_COLS =
  "grid-cols-[1.1fr_1.6fr_1fr_0.9fr_1.1fr_2fr_0.8fr]";

export default function VisitHistoryTable({
  visits,
  onEdit,
  onDelete,
}: {
  visits: Visit[];
  onEdit: (visit: Visit) => void;
  onDelete: (visit: Visit) => void;
}) {
  if (visits.length === 0) {
    return (
      <p className="px-2 py-10 text-center text-sm text-[var(--text-sub)]">
        방문/구매 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div
        className={`grid ${VISIT_HISTORY_GRID_COLS} gap-3 border-b border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--text-sub)]`}
      >
        <span>방문 날짜</span>
        <span>구매 내역</span>
        <span>판매가격</span>
        <span>복용 기간</span>
        <span>다음 예상 방문일</span>
        <span>상담 내역 및 메모</span>
        <span />
      </div>
      <div className="max-h-[28rem] overflow-y-auto">
        {visits.map((visit) => (
          <div
            key={visit.id}
            className={`grid ${VISIT_HISTORY_GRID_COLS} items-center gap-3 border-b border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] transition-colors duration-200 last:border-b-0 hover:bg-[var(--hover-bg)]`}
          >
            <span>{visit.visitDate}</span>
            <span className="truncate">{visit.product}</span>
            <span>{visit.price.toLocaleString()}원</span>
            <span>{visit.durationDays}일</span>
            <span>{addDaysToDate(visit.visitDate, visit.durationDays)}</span>
            <span className="truncate text-[var(--text-sub)]">{visit.memo}</span>
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => onEdit(visit)}
                aria-label="방문 기록 수정"
                className="flex size-7 items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
              >
                <PencilIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(visit)}
                aria-label="방문 기록 삭제"
                className="flex size-7 items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[#fdecee] hover:text-[var(--error)]"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
