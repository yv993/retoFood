"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, CloseIcon } from "@/components/ui/icons";

type Tone = "success" | "error";
interface Toast {
  id: number;
  title: string;
  desc?: string;
  tone: Tone;
}

interface ToastApi {
  toast: (t: { title: string; desc?: string; tone?: Tone }) => void;
}

const ToastContext = createContext<ToastApi>({ toast: () => {} });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastApi["toast"]>(
    ({ title, desc, tone = "success" }) => {
      const id = ++idRef.current;
      setToasts((s) => [...s, { id, title, desc, tone }]);
      setTimeout(() => remove(id), 4800);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-(--z-toast) flex flex-col items-center gap-2 px-4 sm:left-auto sm:right-4 sm:items-end sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-char/95 p-4 shadow-2xl shadow-black/50 backdrop-blur"
          >
            <span
              className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                t.tone === "success"
                  ? "bg-gold/15 text-gold"
                  : "bg-ember/15 text-ember"
              }`}
            >
              <Check width={16} height={16} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-cream">{t.title}</p>
              {t.desc && <p className="mt-0.5 text-sm text-muted">{t.desc}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted hover:text-cream"
            >
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
