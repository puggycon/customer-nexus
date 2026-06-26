"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { addDaysToDate } from "@/components/dateUtils";
import type { Customer, Visit } from "@/components/types";

type SupabaseClient = ReturnType<typeof createClient>;

type NewCustomerInput = {
  name: string;
  mobile: string;
  tags: string[];
};

type VisitInput = {
  visitDate: string;
  product: string;
  price: number;
  durationDays: number;
  memo: string;
  pharmacist: string;
};

// 방문 기록 변경 후, 해당 고객의 최근 방문일/마지막 상담 약사를 최신 방문 기준으로 갱신
async function syncCustomerLatestVisit(supabase: SupabaseClient, customerId: number) {
  const { data } = await supabase
    .from("visits")
    .select("visit_date, pharmacist")
    .eq("customer_id", customerId)
    .order("visit_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase
    .from("customers")
    .update({
      last_visit: data?.visit_date ?? null,
      last_visit_pharmacist: data?.pharmacist ?? null,
    })
    .eq("id", customerId);
}

// 사용자가 추가한 고객을 customers 테이블에 저장하고, 저장된 행을 반환한다.
export async function createCustomer(input: NewCustomerInput): Promise<Customer> {
  const supabase = createClient(await cookies());

  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: input.name,
      mobile: input.mobile || null,
      tags: input.tags,
    })
    .select("id, name, mobile, tags, last_visit, last_visit_pharmacist")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: String(data.id),
    name: data.name,
    mobile: data.mobile ?? "",
    tags: data.tags ?? [],
    lastVisit: data.last_visit ?? "",
    lastVisitPharmacist: data.last_visit_pharmacist ?? "",
    visits: [],
  };
}

// 메인 리스트에서 고객 삭제 시: 행(id)은 남기고 테이블 값만 빈값으로 변경
export async function clearCustomer(id: string): Promise<void> {
  const supabase = createClient(await cookies());
  const cid = Number(id);

  // 연결된 방문 기록 삭제 (트리거가 customers.visits_id 를 '{}' 로 동기화)
  const { error: visitError } = await supabase.from("visits").delete().eq("customer_id", cid);
  if (visitError) throw new Error(visitError.message);

  // 고객 행의 값들을 빈값으로 변경 (id 는 유지)
  const { error } = await supabase
    .from("customers")
    .update({
      name: "",
      mobile: null,
      tags: [],
      last_visit: null,
      last_visit_pharmacist: null,
    })
    .eq("id", cid);
  if (error) throw new Error(error.message);
}

// 고객 세부 정보(방문/구매 기록)를 visits 테이블에 저장
export async function createVisit(
  customerId: string,
  input: VisitInput,
): Promise<Visit> {
  const supabase = createClient(await cookies());
  const cid = Number(customerId);

  const { data, error } = await supabase
    .from("visits")
    .insert({
      customer_id: cid,
      visit_date: input.visitDate,
      product: input.product,
      price: input.price,
      duration_days: input.durationDays,
      next_expected_visit: addDaysToDate(input.visitDate, input.durationDays),
      memo: input.memo,
      pharmacist: input.pharmacist || null,
    })
    .select("id, visit_date, product, price, duration_days, memo, pharmacist")
    .single();

  if (error) throw new Error(error.message);

  await syncCustomerLatestVisit(supabase, cid);

  return {
    id: String(data.id),
    visitDate: data.visit_date ?? "",
    product: data.product ?? "",
    price: data.price ?? 0,
    durationDays: data.duration_days ?? 0,
    memo: data.memo ?? "",
    pharmacist: data.pharmacist ?? "",
  };
}

// 기존 방문 기록 수정
export async function updateVisit(
  customerId: string,
  visitId: string,
  input: VisitInput,
): Promise<void> {
  const supabase = createClient(await cookies());
  const cid = Number(customerId);

  const { error } = await supabase
    .from("visits")
    .update({
      visit_date: input.visitDate,
      product: input.product,
      price: input.price,
      duration_days: input.durationDays,
      next_expected_visit: addDaysToDate(input.visitDate, input.durationDays),
      memo: input.memo,
      pharmacist: input.pharmacist || null,
    })
    .eq("id", Number(visitId));

  if (error) throw new Error(error.message);

  await syncCustomerLatestVisit(supabase, cid);
}

// 방문 기록 삭제
export async function deleteVisit(customerId: string, visitId: string): Promise<void> {
  const supabase = createClient(await cookies());
  const cid = Number(customerId);

  const { error } = await supabase.from("visits").delete().eq("id", Number(visitId));

  if (error) throw new Error(error.message);

  await syncCustomerLatestVisit(supabase, cid);
}
