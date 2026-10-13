"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product, ViewMode } from "@/lib/types";

interface ViewContextValue {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  /** Adds any ids the context hasn't seen yet to the end of the master order. */
  registerIds: (ids: string[]) => void;
  /** Sorts a product list according to the user's saved drag order. */
  sortByOrder: (products: Product[]) => Product[];
  /** Moves `activeId` to where `overId` currently sits in the master order. */
  reorder: (activeId: string, overId: string) => void;
}

const ViewContext = createContext<ViewContextValue | null>(null);

const STORAGE_KEY = "shop.view.v1";

interface PersistedShape {
  view: ViewMode;
  order: string[];
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<ViewMode>("grid4");
  // `order` is a superset of every product id the user has encountered,
  // kept in the user's preferred display order. Filtering the catalogue
  // never loses this ordering -- it's just re-applied to whatever subset
  // the current filters return.
  const [order, setOrder] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedShape;
        if (parsed.view) setViewState(parsed.view);
        if (Array.isArray(parsed.order)) setOrder(parsed.order);
      }
    } catch {
      // Ignore unreadable storage and start from the defaults.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedShape = { view, order };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Non-fatal: the layout choice just won't survive a reload.
    }
  }, [view, order, hydrated]);

  function setView(next: ViewMode) {
    setViewState(next);
  }

  function registerIds(ids: string[]) {
    setOrder((prev) => {
      const missing = ids.filter((id) => !prev.includes(id));
      return missing.length ? [...prev, ...missing] : prev;
    });
  }

  function sortByOrder(products: Product[]): Product[] {
    if (order.length === 0) return products;
    const rank = new Map(order.map((id, index) => [id, index]));
    return [...products].sort((a, b) => {
      const ra = rank.has(a.id) ? (rank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const rb = rank.has(b.id) ? (rank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      return ra - rb;
    });
  }

  function reorder(activeId: string, overId: string) {
    if (activeId === overId) return;
    setOrder((prev) => {
      const oldIndex = prev.indexOf(activeId);
      const newIndex = prev.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = [...prev];
      next.splice(oldIndex, 1);
      next.splice(newIndex, 0, activeId);
      return next;
    });
  }

  const value: ViewContextValue = {
    view,
    setView,
    registerIds,
    sortByOrder,
    reorder,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used inside <ViewProvider>");
  return ctx;
}
