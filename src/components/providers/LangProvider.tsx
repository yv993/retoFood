"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setCurrentLang,
  initLang,
  translate,
  type Lang,
} from "@/lib/i18n";

/** Subscribe to the active language and translate keys. */
export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    lang,
    setLang: (l: Lang) => setCurrentLang(l),
    t: (key: string) => translate(lang, key),
  };
}

/** Hydrates the stored language choice once on mount. */
export default function LangProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initLang();
  }, []);
  return <>{children}</>;
}
