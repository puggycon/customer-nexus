"use client";

import { useEffect, useMemo, useState } from "react";
import { useCustomers } from "./CustomerContext";
import { addDaysToDate, formatToday } from "./dateUtils";
import { CloseIcon } from "./icons";

type Tab = "monthly" | "customer" | "product";
type Granularity = "day" | "month" | "year";

type ProductRank = { product: string; count: number; revenue: number };

// 구매 기록 묶음을 제품별로 집계해 판매 횟수 순위로 정렬한다.
function rankProducts(
  visits: { product: string; price: number }[],
): ProductRank[] {
  const map = new Map<string, { count: number; revenue: number }>();
  for (const v of visits) {
    const name = v.product?.trim();
    if (!name) continue;
    const cur = map.get(name) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += v.price;
    map.set(name, cur);
  }
  return [...map.entries()]
    .map(([product, { count, revenue }]) => ({ product, count, revenue }))
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue);
}

// "YYYY-MM"을 delta 개월만큼 이동.
function shiftMonth(ym: string, delta: number) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${y}년 ${Number(m)}월`;
}

function formatDayLabel(ymd: string) {
  const [y, m, d] = ymd.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "monthly", label: "당월 통계" },
  { key: "customer", label: "고객별 매출액" },
  { key: "product", label: "다빈도 판매 제품" },
];

const GRANULARITIES: { key: Granularity; label: string }[] = [
  { key: "day", label: "일별" },
  { key: "month", label: "월별" },
  { key: "year", label: "년도별" },
];

export default function SalesStatsModal({ onClose }: { onClose: () => void }) {
  const { customers } = useCustomers();
  const today = formatToday();

  const [tab, setTab] = useState<Tab>("monthly");
  // 당월 통계용 기준 월
  const [statMonth, setStatMonth] = useState(() => today.slice(0, 7));
  // 다빈도 판매 제품용 기간 단위와 기준값
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [day, setDay] = useState(today);
  const [month, setMonth] = useState(() => today.slice(0, 7));
  const [year, setYear] = useState(() => today.slice(0, 4));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // 모든 구매 기록을 고객 정보와 함께 평탄화.
  const allVisits = useMemo(
    () =>
      customers.flatMap((c) =>
        c.visits
          .filter((v) => v.visitDate)
          .map((v) => ({
            ...v,
            customerId: c.id,
            customerName: c.name,
          })),
      ),
    [customers],
  );

  // 당월 통계
  const monthly = useMemo(() => {
    const visits = allVisits.filter((v) => v.visitDate.startsWith(statMonth));
    return {
      visitCount: visits.length,
      revenue: visits.reduce((s, v) => s + v.price, 0),
      products: rankProducts(visits),
    };
  }, [allVisits, statMonth]);

  // 고객별 매출액 (높은 순)
  const customerSales = useMemo(
    () =>
      customers
        .map((c) => ({
          id: c.id,
          name: c.name,
          total: c.visits.reduce((s, v) => s + v.price, 0),
          count: c.visits.length,
        }))
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total),
    [customers],
  );

  // 다빈도 판매 제품 (선택한 기간 단위 기준)
  const productRanking = useMemo(() => {
    const visits = allVisits.filter((v) => {
      if (granularity === "day") return v.visitDate === day;
      if (granularity === "month") return v.visitDate.startsWith(month);
      return v.visitDate.startsWith(year);
    });
    return rankProducts(visits);
  }, [allVisits, granularity, day, month, year]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">매출 통계</h2>
            <p className="mt-1 text-sm text-[var(--text-sub)]">
              방문 기록을 기준으로 매출과 판매 제품을 확인합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 rounded-xl bg-[var(--background)] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 ${
                tab === t.key
                  ? "bg-[var(--card)] text-[var(--accent)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-[var(--text-sub)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "monthly" && (
            <MonthlyTab
              statMonth={statMonth}
              onPrev={() => setStatMonth((m) => shiftMonth(m, -1))}
              onNext={() => setStatMonth((m) => shiftMonth(m, 1))}
              {...monthly}
            />
          )}
          {tab === "customer" && <CustomerTab rows={customerSales} />}
          {tab === "product" && (
            <ProductTab
              granularity={granularity}
              setGranularity={setGranularity}
              day={day}
              month={month}
              year={year}
              setDay={setDay}
              setMonth={setMonth}
              setYear={setYear}
              ranking={productRanking}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PeriodNav({
  label,
  onPrev,
  onNext,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전"
        className="flex size-8 cursor-pointer items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
      >
        ‹
      </button>
      <span className="min-w-32 text-center text-base font-bold text-[var(--text)]">
        {label}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="다음"
        className="flex size-8 cursor-pointer items-center justify-center rounded-xl text-[var(--text-sub)] transition-all duration-200 hover:bg-[var(--hover-bg)] hover:text-[var(--accent)]"
      >
        ›
      </button>
    </div>
  );
}

function ProductRankList({ ranking }: { ranking: ProductRank[] }) {
  if (ranking.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-sub)]">
        판매 기록이 없습니다.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="grid grid-cols-[2.5rem_1fr_4rem_6rem] gap-3 border-b border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--text-sub)]">
        <span className="text-center">순위</span>
        <span>제품 이름</span>
        <span className="text-right">판매 수</span>
        <span className="text-right">매출액</span>
      </div>
      <div>
        {ranking.map((p, i) => (
          <div
            key={p.product}
            className="grid grid-cols-[2.5rem_1fr_4rem_6rem] items-center gap-3 border-b border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] last:border-b-0"
          >
            <span
              className={`justify-self-center rounded-full px-2 py-0.5 text-xs font-bold ${
                i < 3
                  ? "bg-[var(--hover-bg)] text-[var(--accent)]"
                  : "text-[var(--text-sub)]"
              }`}
            >
              {i + 1}
            </span>
            <span className="truncate font-bold">{p.product}</span>
            <span className="text-right text-[var(--text-sub)]">
              {p.count}건
            </span>
            <span className="text-right text-[var(--text-sub)]">
              {p.revenue.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyTab({
  statMonth,
  onPrev,
  onNext,
  visitCount,
  revenue,
  products,
}: {
  statMonth: string;
  onPrev: () => void;
  onNext: () => void;
  visitCount: number;
  revenue: number;
  products: ProductRank[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <PeriodNav
        label={formatMonthLabel(statMonth)}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <p className="text-xs font-bold text-[var(--text-sub)]">방문 고객 수</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text)]">
            {visitCount.toLocaleString()}
            <span className="ml-1 text-sm font-bold text-[var(--text-sub)]">
              건
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <p className="text-xs font-bold text-[var(--text-sub)]">월별 매출액</p>
          <p className="mt-1 text-2xl font-bold text-[var(--accent)]">
            {revenue.toLocaleString()}
            <span className="ml-1 text-sm font-bold text-[var(--text-sub)]">
              원
            </span>
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-[var(--text)]">
          월별 다빈도 판매 제품
        </p>
        <ProductRankList ranking={products} />
      </div>
    </div>
  );
}

function CustomerTab({
  rows,
}: {
  rows: { id: string; name: string; total: number; count: number }[];
}) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-sub)]">
        매출 기록이 없습니다.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="grid grid-cols-[2.5rem_1fr_4rem_7rem] gap-3 border-b border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--text-sub)]">
        <span className="text-center">순위</span>
        <span>고객 이름</span>
        <span className="text-right">방문 수</span>
        <span className="text-right">누적 매출액</span>
      </div>
      <div>
        {rows.map((c, i) => (
          <div
            key={c.id}
            className="grid grid-cols-[2.5rem_1fr_4rem_7rem] items-center gap-3 border-b border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] last:border-b-0"
          >
            <span
              className={`justify-self-center rounded-full px-2 py-0.5 text-xs font-bold ${
                i < 3
                  ? "bg-[var(--hover-bg)] text-[var(--accent)]"
                  : "text-[var(--text-sub)]"
              }`}
            >
              {i + 1}
            </span>
            <span className="truncate font-bold">{c.name}</span>
            <span className="text-right text-[var(--text-sub)]">
              {c.count}건
            </span>
            <span className="text-right font-bold text-[var(--accent)]">
              {c.total.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductTab({
  granularity,
  setGranularity,
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear,
  ranking,
}: {
  granularity: Granularity;
  setGranularity: (g: Granularity) => void;
  day: string;
  month: string;
  year: string;
  setDay: (updater: (v: string) => string) => void;
  setMonth: (updater: (v: string) => string) => void;
  setYear: (updater: (v: string) => string) => void;
  ranking: ProductRank[];
}) {
  let label: string;
  let onPrev: () => void;
  let onNext: () => void;
  if (granularity === "day") {
    label = formatDayLabel(day);
    onPrev = () => setDay((d) => addDaysToDate(d, -1));
    onNext = () => setDay((d) => addDaysToDate(d, 1));
  } else if (granularity === "month") {
    label = formatMonthLabel(month);
    onPrev = () => setMonth((m) => shiftMonth(m, -1));
    onNext = () => setMonth((m) => shiftMonth(m, 1));
  } else {
    label = `${year}년`;
    onPrev = () => setYear((y) => String(Number(y) - 1));
    onNext = () => setYear((y) => String(Number(y) + 1));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-xl bg-[var(--background)] p-1">
        {GRANULARITIES.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setGranularity(g.key)}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
              granularity === g.key
                ? "bg-[var(--card)] text-[var(--accent)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[var(--text-sub)] hover:text-[var(--text)]"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <PeriodNav label={label} onPrev={onPrev} onNext={onNext} />

      <ProductRankList ranking={ranking} />
    </div>
  );
}
