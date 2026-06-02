import type { SVGProps } from "react";

/** Lucide-style line icons (24x24, currentColor) — matches the original site. */
type P = SVGProps<SVGSVGElement>;
const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-5.2-7-11a7 7 0 1114 0c0 5.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 5l2-2 4 4-2 3a14 14 0 006 6l3-2 4 4-2 2c-9 1-18-8-17-17z" />
  </svg>
);

export const Star = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Facebook = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 9h3V5h-3a4 4 0 00-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 011-1z" />
  </svg>
);

export const TikTok = (p: P) => (
  <svg {...base} {...p}>
    <path d="M16 3v3a5 5 0 005 5M9 12a4 4 0 104 4V3" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const Directions = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2 2 12l10 10 10-10z" />
    <path d="M9 13v-2a2 2 0 0 1 2-2h4" />
    <path d="m13 7 2 2-2 2" />
  </svg>
);

export const Bag = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

export const Flame = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 0-1 .5-2 1.5 1.5 2.5 3 2.5 5a5 5 0 0 1-10 0c0-4 3-6 5-10z" />
  </svg>
);

export const Wheat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 22V8" />
    <path d="M12 8c-2 0-3-1.5-3-3 2 0 3 1.5 3 3zM12 8c2 0 3-1.5 3-3-2 0-3 1.5-3 3z" />
    <path d="M12 13c-2 0-3-1.5-3-3 2 0 3 1.5 3 3zM12 13c2 0 3-1.5 3-3-2 0-3 1.5-3 3z" />
    <path d="M12 18c-2 0-3-1.5-3-3 2 0 3 1.5 3 3zM12 18c2 0 3-1.5 3-3-2 0-3 1.5-3 3z" />
  </svg>
);

export const Leaf = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 11-4 16-9 16z" />
    <path d="M4 20c2-4 6-7 12-9" />
  </svg>
);

export const ShieldCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Truck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const Gift = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 11h16v9H4z" />
    <path d="M4 7h16v4H4zM12 7v13" />
    <path d="M12 7C9 7 8 3 10 3s2 4 2 4zM12 7c3 0 4-4 2-4s-2 4-2 4z" />
  </svg>
);

export const Globe = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
);

export const Calendar = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const Users = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.6" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 21l1.6-4.8A8 8 0 1 1 12 20a8 8 0 0 1-4-1.1L3 21z" />
    <path d="M8.5 8.5c0 3 2 5 5 5 .6 0 1.2-.6 1.2-1.2 0-.3-.2-.5-.5-.6l-1.2-.4-.7.7c-1-.4-1.8-1.2-2.2-2.2l.7-.7-.4-1.2c-.1-.3-.3-.5-.6-.5-.6 0-1.2.6-1.2 1.2z" />
  </svg>
);

export const Telegram = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 4 3 11l5 2 2 6 3-4 5 4z" />
    <path d="m8 13 9-6-6 8" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Ember = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2c1.2 3.5-2.2 4.6-2.2 7.6a2.2 2.2 0 0 0 4.4 0c0-1 .1-1.4.6-2.3 1.7 1.7 2.9 3.4 2.9 5.6a5.7 5.7 0 0 1-11.4 0c0-4.4 3.3-6.7 5.7-10.9z" />
  </svg>
);

export const Sparkles = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </svg>
);

export const Download = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const LogOut = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
