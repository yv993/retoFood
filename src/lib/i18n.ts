/**
 * Minimal i18n. English is the source/default; RU and HY cover key strings and
 * fall back to English for anything not yet translated. Backed by a tiny
 * external store (works with useSyncExternalStore — no hydration mismatch).
 */
export type Lang = "en" | "ru" | "hy";

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "hy", label: "HY", name: "Հայերեն" },
];

type Dict = Record<string, string>;

export const STRINGS: Record<Lang, Dict> = {
  en: {
    "nav.menu": "Menu",
    "nav.about": "Our Story",
    "nav.gallery": "Gallery",
    "nav.reserve": "Reserve",
    "nav.catering": "Catering",
    "nav.gift": "Gift Cards",
    "nav.contact": "Contact",
    "nav.home": "Home",
    "cta.order": "Order Online",
    "cta.reserve": "Reserve a Table",
    "cta.book": "Book a Table",
    "cta.exploreMenu": "Explore the Menu",
    "cta.add": "Add to order",
    "cta.review": "Review your order",
    "cart.title": "Your cart",
    "cart.empty": "Your cart is empty",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Checkout",
    "cart.browse": "Browse the menu",
    "footer.vip": "Join the VIP list",
    "footer.rights": "All rights reserved.",
  },
  ru: {
    "nav.menu": "Меню",
    "nav.about": "О нас",
    "nav.gallery": "Галерея",
    "nav.reserve": "Бронь",
    "nav.catering": "Кейтеринг",
    "nav.gift": "Подарочные карты",
    "nav.contact": "Контакты",
    "nav.home": "Главная",
    "cta.order": "Заказать онлайн",
    "cta.reserve": "Забронировать стол",
    "cta.book": "Забронировать стол",
    "cta.exploreMenu": "Смотреть меню",
    "cta.add": "В корзину",
    "cta.review": "Перейти к заказу",
    "cart.title": "Корзина",
    "cart.empty": "Корзина пуста",
    "cart.subtotal": "Подытог",
    "cart.checkout": "Оформить заказ",
    "cart.browse": "Открыть меню",
    "footer.vip": "Вступить в VIP-клуб",
    "footer.rights": "Все права защищены.",
  },
  hy: {
    "nav.menu": "Մենյու",
    "nav.about": "Մեր պատմությունը",
    "nav.gallery": "Պատկերասրահ",
    "nav.reserve": "Ամրագրել",
    "nav.catering": "Քեյթրինգ",
    "nav.gift": "Նվեր քարտեր",
    "nav.contact": "Կապ",
    "nav.home": "Գլխավոր",
    "cta.order": "Պատվիրել",
    "cta.reserve": "Ամրագրել սեղան",
    "cta.book": "Ամրագրել սեղան",
    "cta.exploreMenu": "Դիտել մենյուն",
    "cta.add": "Ավելացնել պատվերին",
    "cta.review": "Դիտել պատվերը",
    "cart.title": "Զամբյուղ",
    "cart.empty": "Զամբյուղը դատարկ է",
    "cart.subtotal": "Ընդամենը",
    "cart.checkout": "Ձևակերպել պատվերը",
    "cart.browse": "Բացել մենյուն",
    "footer.vip": "Միանալ VIP ցանկին",
    "footer.rights": "Բոլոր իրավունքները պաշտպանված են։",
  },
};

export function translate(lang: Lang, key: string): string {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

/* ---- tiny external store ---- */
let current: Lang = "en";
const listeners = new Set<() => void>();

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getSnapshot(): Lang {
  return current;
}
export function getServerSnapshot(): Lang {
  return "en";
}
function isLang(v: unknown): v is Lang {
  return v === "en" || v === "ru" || v === "hy";
}
export function setCurrentLang(l: Lang): void {
  current = l;
  try {
    localStorage.setItem("bh-lang", l);
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") document.documentElement.lang = l;
  listeners.forEach((f) => f());
}
/** Read a previously stored choice on mount (notifies subscribers). */
export function initLang(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("bh-lang");
  if (isLang(stored) && stored !== current) {
    current = stored;
    if (typeof document !== "undefined") document.documentElement.lang = stored;
    listeners.forEach((f) => f());
  }
}
