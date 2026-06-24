"use client";

import { createContext, useContext, useState } from "react";
import type { Customer } from "./types";

type NewCustomerInput = {
  name: string;
  mobile: string;
  tags: string[];
};

type CustomerContextValue = {
  customers: Customer[];
  addCustomer: (input: NewCustomerInput) => void;
  removeCustomer: (id: string) => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

function formatToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
    };
    setCustomers((prev) => [newCustomer, ...prev]);
  }

  function removeCustomer(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, removeCustomer }}>
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
