import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Customer, Visit } from "@/components/types";

// customers 테이블에 보관된 고객 리스트를 id 순서대로 불러온다.
export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient(await cookies());

  const [{ data: customerRows, error: customerError }, { data: visitRows, error: visitError }] =
    await Promise.all([
      supabase
        .from("customers")
        .select("id, name, mobile, tags, last_visit, last_visit_pharmacist")
        // 삭제(빈값 처리)된 고객은 이름이 비어 있으므로 리스트에서 제외
        .neq("name", "")
        .order("id", { ascending: true }),
      supabase
        .from("visits")
        .select("id, customer_id, visit_date, product, price, duration_days, memo, pharmacist"),
    ]);

  if (customerError) throw new Error(customerError.message);
  if (visitError) throw new Error(visitError.message);

  const visitsByCustomer = new Map<number, Visit[]>();
  for (const v of visitRows ?? []) {
    const list = visitsByCustomer.get(v.customer_id) ?? [];
    list.push({
      id: String(v.id),
      visitDate: v.visit_date ?? "",
      product: v.product ?? "",
      price: v.price ?? 0,
      durationDays: v.duration_days ?? 0,
      memo: v.memo ?? "",
      pharmacist: v.pharmacist ?? "",
    });
    visitsByCustomer.set(v.customer_id, list);
  }

  return (customerRows ?? []).map((c) => ({
    id: String(c.id),
    name: c.name,
    mobile: c.mobile ?? "",
    tags: c.tags ?? [],
    lastVisit: c.last_visit ?? "",
    lastVisitPharmacist: c.last_visit_pharmacist ?? "",
    visits: visitsByCustomer.get(c.id) ?? [],
  }));
}
