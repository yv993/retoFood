"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface CartAddon {
  name: string;
  price: number;
}

export interface CartLine {
  /** unique per (slug + chosen add-ons) */
  id: string;
  slug: string;
  name: string;
  img: string;
  /** base unit price in dram */
  price: number;
  qty: number;
  addons: CartAddon[];
}

export interface AddPayload {
  slug: string;
  name: string;
  img: string;
  price: number;
  qty?: number;
  addons?: CartAddon[];
}

interface State {
  lines: CartLine[];
}

type Action =
  | { type: "ADD"; payload: AddPayload }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; lines: CartLine[] };

const STORAGE_KEY = "bh-cart";

function lineId(slug: string, addons: CartAddon[]): string {
  const a = [...addons].map((x) => x.name).sort().join(",");
  return a ? `${slug}::${a}` : slug;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { lines: action.lines };
    case "ADD": {
      const { slug, name, img, price, qty = 1, addons = [] } = action.payload;
      const id = lineId(slug, addons);
      const existing = state.lines.find((l) => l.id === id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l,
          ),
        };
      }
      return { lines: [...state.lines, { id, slug, name, img, price, qty, addons }] };
    }
    case "SET_QTY":
      return {
        lines: state.lines
          .map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l))
          .filter((l) => l.qty > 0),
      };
    case "REMOVE":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "CLEAR":
      return { lines: [] };
    default:
      return state;
  }
}

export function lineTotal(l: CartLine): number {
  const addonSum = l.addons.reduce((s, a) => s + a.price, 0);
  return (l.price + addonSum) * l.qty;
}

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (p: AddPayload) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** incremented on every add — lets UI react (badge bounce etc.) */
  lastAddedAt: number;
}

const CartContext = createContext<CartApi | null>(null);

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [open, setOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const skipFirstSave = useRef(true);

  // Hydrate from localStorage once on mount (deferred → no SSR mismatch / no
  // synchronous setState in effect).
  useEffect(() => {
    let raf = 0;
    raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const lines = JSON.parse(raw) as CartLine[];
          if (Array.isArray(lines)) dispatch({ type: "HYDRATE", lines });
        }
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Persist (skip the very first run so we don't overwrite stored data on mount).
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines]);

  const api = useMemo<CartApi>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + lineTotal(l), 0);
    return {
      lines: state.lines,
      count,
      subtotal,
      addItem: (p) => {
        dispatch({ type: "ADD", payload: p });
        setLastAddedAt((n) => n + 1);
      },
      removeItem: (id) => dispatch({ type: "REMOVE", id }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      lastAddedAt,
    };
  }, [state.lines, open, lastAddedAt]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
