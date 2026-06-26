"use client";

import { createContext, useContext, useState } from "react";

type SelectionContextValue = {
  selectedIds: Set<string>;
  toggle: (id: string, selected: boolean) => void;
  replace: (ids: Iterable<string>) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggle(id: string, selected: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function replace(ids: Iterable<string>) {
    setSelectedIds(new Set(ids));
  }

  function clear() {
    setSelectedIds(new Set());
  }

  return (
    <SelectionContext.Provider value={{ selectedIds, toggle, replace, clear }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return ctx;
}
