"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type SearchFieldKey =
  | "name"
  | "product"
  | "tag"
  | "date"
  | "phone"
  | "pharmacist";

export type SearchCriteria = Record<SearchFieldKey, string>;

const EMPTY_CRITERIA: SearchCriteria = {
  name: "",
  product: "",
  tag: "",
  date: "",
  phone: "",
  pharmacist: "",
};

type SearchContextValue = {
  criteria: SearchCriteria;
  setField: (field: SearchFieldKey, value: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [criteria, setCriteria] = useState<SearchCriteria>(EMPTY_CRITERIA);

  const setField = useCallback((field: SearchFieldKey, value: string) => {
    setCriteria((prev) => (prev[field] === value ? prev : { ...prev, [field]: value }));
  }, []);

  return (
    <SearchContext.Provider value={{ criteria, setField }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return ctx;
}
