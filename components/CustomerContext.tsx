"use client";

import { createContext, useContext, useState } from "react";
import {
  createCustomer,
  clearCustomer,
  createVisit,
  updateVisit as updateVisitRow,
  deleteVisit,
} from "@/app/actions";
import type { Customer } from "./types";

type NewCustomerInput = {
  name: string;
  mobile: string;
  tags: string[];
};

type NewVisitInput = {
  visitDate: string;
  product: string;
  price: number;
  durationDays: number;
  memo: string;
  pharmacist: string;
};

type CustomerContextValue = {
  customers: Customer[];
  addCustomer: (input: NewCustomerInput) => Promise<void>;
  removeCustomer: (id: string) => Promise<void>;
  updateMobile: (id: string, mobile: string) => void;
  addVisit: (customerId: string, input: NewVisitInput) => Promise<void>;
  updateVisit: (customerId: string, visitId: string, input: NewVisitInput) => Promise<void>;
  removeVisit: (customerId: string, visitId: string) => Promise<void>;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({
  children,
  initialCustomers,
}: {
  children: React.ReactNode;
  initialCustomers: Customer[];
}) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  async function addCustomer(input: NewCustomerInput) {
    // customers 테이블에 저장 후, 저장된 행(자동 부여된 id 포함)을 리스트 끝에 추가
    const created = await createCustomer(input);
    setCustomers((prev) => [...prev, created]);
  }

  async function removeCustomer(id: string) {
    // 테이블 행 값을 빈값으로 변경 후, 리스트에서 제거
    await clearCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function updateMobile(id: string, mobile: string) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mobile } : c)),
    );
  }

  async function addVisit(customerId: string, input: NewVisitInput) {
    // visits 테이블에 저장 후, 저장된 행(자동 부여된 id 포함)을 로컬 상태에 반영
    const newVisit = await createVisit(customerId, input);
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const visits = [...c.visits, newVisit].sort((a, b) =>
          b.visitDate.localeCompare(a.visitDate),
        );
        return {
          ...c,
          visits,
          lastVisit: visits[0].visitDate,
          lastVisitPharmacist: visits[0].pharmacist,
        };
      }),
    );
  }

  async function updateVisit(
    customerId: string,
    visitId: string,
    input: NewVisitInput,
  ) {
    await updateVisitRow(customerId, visitId, input);
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const visits = c.visits
          .map((v) => (v.id === visitId ? { ...v, ...input } : v))
          .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
        return {
          ...c,
          visits,
          lastVisit: visits[0].visitDate,
          lastVisitPharmacist: visits[0].pharmacist,
        };
      }),
    );
  }

  async function removeVisit(customerId: string, visitId: string) {
    await deleteVisit(customerId, visitId);
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const visits = c.visits.filter((v) => v.id !== visitId);
        return {
          ...c,
          visits,
          lastVisit: visits[0]?.visitDate ?? "",
          lastVisitPharmacist: visits[0]?.pharmacist ?? "",
        };
      }),
    );
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        removeCustomer,
        updateMobile,
        addVisit,
        updateVisit,
        removeVisit,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return ctx;
}
