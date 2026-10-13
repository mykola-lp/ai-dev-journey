"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAllProducts } from "@/lib/products";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "shop.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  // Cart state only stores id + quantity. Prices/names are always looked
  // up live from the product catalogue below, so the cart never shows a
  // stale price if the catalogue changes.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously saved cart once, on the client only. Guarded so it
  // never runs during SSR, where `window`/`localStorage` don't exist.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // Corrupt or unavailable storage: start with an empty cart instead
      // of crashing the page.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore quota / privacy-mode failures -- the cart still works for
      // the current session, it just won't survive a reload.
    }
  }, [lines, hydrated]);

  function addItem(productId: string, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId
            ? { ...l, quantity: l.quantity + quantity }
            : l
        );
      }
      return [...prev, { productId, quantity }];
    });
  }

  function removeItem(productId: string) {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    );
  }

  function clear() {
    setLines([]);
  }

  const { totalItems, totalPrice } = useMemo(() => {
    const products = getAllProducts();
    let items = 0;
    let price = 0;
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId);
      items += line.quantity;
      if (product) price += product.price * line.quantity;
    }
    return { totalItems: items, totalPrice: price };
  }, [lines]);

  const value: CartContextValue = {
    lines,
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
