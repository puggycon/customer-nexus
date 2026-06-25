"use client";

import { createContext, useContext, useState } from "react";
import { formatToday } from "./dateUtils";
import type { Customer, Visit } from "./types";

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
};

type CustomerContextValue = {
  customers: Customer[];
  addCustomer: (input: NewCustomerInput) => void;
  removeCustomer: (id: string) => void;
  addVisit: (customerId: string, input: NewVisitInput) => void;
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

  function addCustomer(input: NewCustomerInput) {
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name: input.name,
      mobile: input.mobile,
      tags: input.tags,
      lastVisit: formatToday(),
      visits: [],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  }

  function removeCustomer(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function addVisit(customerId: string, input: NewVisitInput) {
    const newVisit: Visit = { id: crypto.randomUUID(), ...input };
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        const visits = [...c.visits, newVisit].sort((a, b) =>
          b.visitDate.localeCompare(a.visitDate),
        );
        return { ...c, visits, lastVisit: visits[0].visitDate };
      }),
    );
  }

  return (
    <CustomerContext.Provider
      value={{ customers, addCustomer, removeCustomer, addVisit }}
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
