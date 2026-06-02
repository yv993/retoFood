/**
 * BurgerHouse — single source of truth for content.
 * Ported verbatim from the original index.html (copy, prices, images, sections).
 */

/* ============================================================================
   SINGLE SOURCE OF TRUTH — REAL BUSINESS VALUES
   ----------------------------------------------------------------------------
   Every line tagged `TODO: REPLACE WITH REAL VALUE` is placeholder content the
   owner must replace before launch. Edit ONLY this object — components read
   from it, so you never have to touch the UI code. Menu prices live in the
   SIGNATURES and MENU arrays further down (also flagged).
   ========================================================================== */
export const SITE = {
  name: "BurgerHouse", // TODO: REPLACE WITH REAL VALUE — legal/brand name
  tagline: "Gourmet Burgers · Yerevan",
  description:
    "BurgerHouse — Yerevan's gourmet burger house. Dry-aged Angus beef, house-baked brioche, and craft sauces, flame-grilled in the heart of the city.",
  url: "https://burgerhouse.am", // TODO: REPLACE WITH REAL VALUE — production domain (also set NEXT_PUBLIC_SITE_URL)
  themeColor: "#0E0E0F",
  est: "2019", // TODO: REPLACE WITH REAL VALUE — year established
  locale: { default: "en" as const },
  contact: {
    addressLine: "14 Saryan St, Yerevan 0002, Armenia", // TODO: REPLACE WITH REAL VALUE — full address
    street: "14 Saryan St", // TODO: REPLACE WITH REAL VALUE
    city: "Yerevan", // TODO: REPLACE WITH REAL VALUE
    postal: "0002", // TODO: REPLACE WITH REAL VALUE
    country: "Armenia", // TODO: REPLACE WITH REAL VALUE
    phoneDisplay: "+374 10 00 00 00", // TODO: REPLACE WITH REAL VALUE — phone (display)
    phoneHref: "+37410000000", // TODO: REPLACE WITH REAL VALUE — phone (tel: digits, no spaces)
    email: "hello@burgerhouse.am", // TODO: REPLACE WITH REAL VALUE — public email (also set CONTACT_EMAIL)
    whatsappHref: "https://wa.me/37410000000", // TODO: REPLACE WITH REAL VALUE — wa.me/<countrycode+number>
    whatsappDisplay: "WhatsApp",
    telegramHref: "https://t.me/burgerhouse_am", // TODO: REPLACE WITH REAL VALUE — Telegram handle URL
    telegramDisplay: "@burgerhouse_am", // TODO: REPLACE WITH REAL VALUE
    hoursDisplay: "Mon–Thu 11:00–23:00 · Fri–Sun 11:00–01:00", // TODO: REPLACE WITH REAL VALUE — see HOURS / HOURS_TABLE below
    geo: { lat: 40.186, lng: 44.512 }, // TODO: REPLACE WITH REAL VALUE — exact map coordinates
    mapEmbed:
      "https://www.openstreetmap.org/export/embed.html?bbox=44.505%2C40.182%2C44.520%2C40.190&layer=mapnik&marker=40.186%2C44.512", // TODO: REPLACE WITH REAL VALUE — embed for your exact location
    mapLink: "https://www.openstreetmap.org/?mlat=40.186&mlon=44.512#map=17/40.186/44.512", // TODO: REPLACE WITH REAL VALUE
    social: {
      instagram: "https://instagram.com/burgerhouse.am", // TODO: REPLACE WITH REAL VALUE
      facebook: "https://facebook.com/burgerhouse.am", // TODO: REPLACE WITH REAL VALUE
      tiktok: "https://tiktok.com/@burgerhouse.am", // TODO: REPLACE WITH REAL VALUE
    },
  },
} as const;

/* ============================================================================
   LEGAL — registered-entity placeholders for the legal pages.
   These are deliberately bracketed so they're impossible to miss. Replace each
   with your real registered details (the legal entity often differs from the
   trading/brand name above) and have the pages reviewed by counsel.
   ========================================================================== */
export const LEGAL = {
  entity: "[REGISTERED BUSINESS ENTITY — e.g. “BurgerHouse LLC”]", // TODO: REPLACE WITH REAL VALUE
  regNumber: "[COMPANY / TAX REGISTRATION NUMBER]", // TODO: REPLACE WITH REAL VALUE
  address: "[REGISTERED BUSINESS ADDRESS]", // TODO: REPLACE WITH REAL VALUE
  email: "[LEGAL / PRIVACY CONTACT EMAIL]", // TODO: REPLACE WITH REAL VALUE
  /** Update when you revise the legal copy. */
  updated: "June 2026", // TODO: REPLACE WITH REAL VALUE
} as const;

import { LOCAL_IMAGE_IDS } from "@/lib/localImages";

/** Photo ids self-hosted under /public/img (run `npm run fetch:images` to refresh). */
const LOCAL_IMAGES = new Set(LOCAL_IMAGE_IDS);

/**
 * Image helper. Returns a LOCAL self-hosted path (/img/<id>.jpg) for any photo
 * we've downloaded, so the site doesn't depend on Unsplash at runtime; falls
 * back to the original Unsplash URL otherwise. (SafeImage adds a further
 * fallback so an image never breaks.)
 */
export function unsplash(id: string, w = 1600): string {
  if (LOCAL_IMAGES.has(id)) return `/img/${id}.jpg`;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Tiny shared blur placeholder (warm charcoal) — URL-encoded so it works in the
 *  browser bundle too (no Node `Buffer`). */
export const BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23161514'/%3E%3C/svg%3E";

export const IMAGES = {
  hero: "1568901346375-23c9450c58cd",
  story: "1606131731446-5568d87113aa",
} as const;

export const NAV_LINKS = [
  { href: "/menu", label: "Menu", key: "nav.menu" },
  { href: "/about", label: "Our Story", key: "nav.about" },
  { href: "/gallery", label: "Gallery", key: "nav.gallery" },
  { href: "/reserve", label: "Reserve", key: "nav.reserve" },
  { href: "/catering", label: "Catering", key: "nav.catering" },
  { href: "/gift-cards", label: "Gift Cards", key: "nav.gift" },
] as const;

/** Home in-page anchors (kept working via Lenis). */
export const HOME_ANCHORS = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Our Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
] as const;

export type DietTag = "Veg" | "Spicy" | "Halal" | "Chef" | "Bestseller";

export interface SignatureBurger {
  name: string;
  price: number;
  img: string;
  desc: string;
  badge: string;
  badgeTone: "gold" | "ember";
}

// TODO: REPLACE WITH REAL VALUE — every `price` below is in dram (֏). Confirm
// each signature burger's real menu price before launch.
export const SIGNATURES: SignatureBurger[] = [
  {
    name: "The Ararat",
    price: 4900,
    img: "1571091718767-18b5b1457add",
    desc: "Double dry-aged patty, aged cheddar, smoked bacon, caramelised onion, house burger sauce.",
    badge: "Bestseller",
    badgeTone: "gold",
  },
  {
    name: "Smoky Ember",
    price: 5200,
    img: "1549611016-3a70d82b5040",
    desc: "Chipotle-glazed patty, pepper jack, charred jalapeño, crispy onion, smoked aioli.",
    badge: "Spicy",
    badgeTone: "ember",
  },
  {
    name: "Truffle Noir",
    price: 6400,
    img: "1607013251379-e6eecfffe234",
    desc: "Wagyu blend, black truffle mayo, gruyère, wild mushroom, brioche noir bun.",
    badge: "Chef's pick",
    badgeTone: "gold",
  },
];

export interface Addon {
  name: string;
  price: number;
}

export interface MenuItem {
  name: string;
  /** Stable kebab-case slug for /menu/[slug]. */
  slug: string;
  price: number;
  desc?: string;
  tags?: DietTag[];
  /** Unsplash photo id (used with unsplash()) for the menu card image. */
  img: string;
  calories?: number;
  /** e.g. "8–10 min" */
  prepTime?: string;
  /** 0 = none … 3 = hot */
  spice?: 0 | 1 | 2 | 3;
  ingredients?: string[];
  allergens?: string[];
  addons?: Addon[];
}

export interface MenuCategory {
  id: string;
  index: string;
  title: string;
  items: MenuItem[];
}

/** kebab-case slug from a display name (stable + deterministic). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Shared add-on sets (reused across items). */
const BURGER_ADDONS: Addon[] = [
  { name: "Extra smash patty", price: 1500 },
  { name: "Smoked bacon", price: 700 },
  { name: "Smashed avocado", price: 800 },
  { name: "Extra cheese", price: 500 },
];
const FRIES_ADDONS: Addon[] = [
  { name: "Melted cheese", price: 500 },
  { name: "Truffle drizzle", price: 400 },
  { name: "Smoked bacon bits", price: 600 },
];
const SHAKE_ADDONS: Addon[] = [
  { name: "Extra scoop", price: 500 },
  { name: "Whipped cream", price: 300 },
  { name: "Oreo crumb", price: 300 },
];
const COFFEE_ADDONS: Addon[] = [
  { name: "Extra shot", price: 400 },
  { name: "Oat milk", price: 300 },
  { name: "Vanilla syrup", price: 300 },
];

// TODO: REPLACE WITH REAL VALUE — every menu item's `price` is in dram (֏).
// Review and confirm all prices (and dish names/descriptions) before launch.
export const MENU: MenuCategory[] = [
  {
    id: "starters",
    index: "01",
    title: "Starters",
    items: [
      {
        name: "Loaded Truffle Fries",
        slug: "loaded-truffle-fries",
        price: 2600,
        desc: "Hand-cut fries, truffle oil, shaved parmesan, garlic aioli, chives.",
        tags: ["Veg"],
        img: "1630384060421-cb20d0e0649d",
        calories: 540,
        prepTime: "6–8 min",
        spice: 0,
        ingredients: ["Hand-cut potatoes", "Truffle oil", "Parmesan", "Garlic aioli", "Chives"],
        allergens: ["Milk", "Egg"],
        addons: FRIES_ADDONS,
      },
      {
        name: "Mozzarella Sticks",
        slug: "mozzarella-sticks",
        price: 2300,
        desc: "Golden-crumbed mozzarella with a slow-cooked marinara dip.",
        tags: ["Veg"],
        img: "1623653387945-2fd25214f8fc",
        calories: 480,
        prepTime: "7–9 min",
        spice: 0,
        ingredients: ["Mozzarella", "Crispy crumb", "Marinara dip", "Italian herbs"],
        allergens: ["Milk", "Gluten", "Egg"],
        addons: [
          { name: "Extra marinara", price: 300 },
          { name: "Spicy arrabbiata dip", price: 400 },
        ],
      },
      {
        name: "Mini Sliders ×3",
        slug: "mini-sliders-3",
        price: 3400,
        desc: "Three smashed beef sliders, cheddar, pickle, house burger sauce.",
        tags: ["Halal"],
        img: "1565299507177-b0ac66763828",
        calories: 620,
        prepTime: "8–10 min",
        spice: 0,
        ingredients: ["Smashed beef", "Cheddar", "Pickle", "House sauce", "Mini brioche buns"],
        allergens: ["Gluten", "Milk", "Egg", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Smoked Nachos",
        slug: "smoked-nachos",
        price: 2900,
        desc: "Tortilla chips, smoked cheese, charred jalapeño, salsa, sour cream.",
        tags: ["Veg", "Spicy"],
        img: "1582169296194-e4d644c48063",
        calories: 590,
        prepTime: "6–8 min",
        spice: 1,
        ingredients: ["Tortilla chips", "Smoked cheese", "Charred jalapeño", "Salsa", "Sour cream"],
        allergens: ["Milk"],
        addons: [
          { name: "Guacamole", price: 600 },
          { name: "Extra jalapeño", price: 300 },
        ],
      },
    ],
  },
  {
    id: "burgers",
    index: "02",
    title: "Signature Burgers",
    items: [
      {
        name: "The Ararat",
        slug: "the-ararat",
        price: 4900,
        desc: "Double patty, aged cheddar, smoked bacon, burger sauce.",
        tags: ["Bestseller", "Halal"],
        img: "1571091718767-18b5b1457add",
        calories: 920,
        prepTime: "9–12 min",
        spice: 0,
        ingredients: ["Double dry-aged patty", "Aged cheddar", "Smoked bacon", "Caramelised onion", "House burger sauce", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Egg", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Smoky Ember",
        slug: "smoky-ember",
        price: 5200,
        desc: "Chipotle glaze, pepper jack, charred jalapeño, smoked aioli.",
        tags: ["Spicy", "Halal"],
        img: "1549611016-3a70d82b5040",
        calories: 880,
        prepTime: "9–12 min",
        spice: 2,
        ingredients: ["Chipotle-glazed patty", "Pepper jack", "Charred jalapeño", "Crispy onion", "Smoked aioli", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Egg", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Truffle Noir",
        slug: "truffle-noir",
        price: 6400,
        desc: "Wagyu blend, black truffle mayo, gruyère, wild mushroom.",
        tags: ["Chef", "Halal"],
        img: "1607013251379-e6eecfffe234",
        calories: 1010,
        prepTime: "10–13 min",
        spice: 0,
        ingredients: ["Wagyu blend patty", "Black truffle mayo", "Gruyère", "Wild mushroom", "Brioche noir bun"],
        allergens: ["Gluten", "Milk", "Egg"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Garden Smash",
        slug: "garden-smash",
        price: 4300,
        desc: "House black-bean patty, smoked gouda, avocado, harissa mayo.",
        tags: ["Veg"],
        img: "1586190848861-99aa4a171e90",
        calories: 640,
        prepTime: "8–10 min",
        spice: 1,
        ingredients: ["Black-bean patty", "Smoked gouda", "Avocado", "Harissa mayo", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Soy", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Crispy Chicken Deluxe",
        slug: "crispy-chicken-deluxe",
        price: 4600,
        desc: "Buttermilk-fried chicken, slaw, pickles, honey-mustard mayo.",
        tags: ["Halal"],
        img: "1610440042657-612c34d95e9f",
        calories: 860,
        prepTime: "9–12 min",
        spice: 0,
        ingredients: ["Buttermilk-fried chicken", "Slaw", "Pickles", "Honey-mustard mayo", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Egg", "Mustard", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "Double Smash",
        slug: "double-smash",
        price: 5400,
        desc: "Two smashed patties, double cheddar, grilled onion, house sauce.",
        tags: ["Bestseller", "Halal"],
        img: "1565299624946-b28f40a0ae38",
        calories: 990,
        prepTime: "9–12 min",
        spice: 0,
        ingredients: ["Two smashed patties", "Double cheddar", "Grilled onion", "House sauce", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Egg", "Sesame"],
        addons: BURGER_ADDONS,
      },
      {
        name: "BBQ Bacon Stack",
        slug: "bbq-bacon-stack",
        price: 5600,
        desc: "Triple-stacked beef, smoked bacon, onion rings, bourbon BBQ.",
        tags: ["Halal"],
        img: "1551782450-a2132b4ba21d",
        calories: 1080,
        prepTime: "10–13 min",
        spice: 1,
        ingredients: ["Triple beef patties", "Smoked bacon", "Onion rings", "Bourbon BBQ", "Brioche bun"],
        allergens: ["Gluten", "Milk", "Egg", "Sesame"],
        addons: BURGER_ADDONS,
      },
    ],
  },
  {
    id: "sides",
    index: "03",
    title: "Sides",
    items: [
      {
        name: "Truffle Parmesan Fries",
        slug: "truffle-parmesan-fries",
        price: 2200,
        desc: "Hand-cut fries tossed in truffle oil and shaved parmesan.",
        tags: ["Veg"],
        img: "1518013431117-eb1465fa5752",
        calories: 480,
        prepTime: "6–8 min",
        spice: 0,
        ingredients: ["Hand-cut potatoes", "Truffle oil", "Parmesan", "Sea salt"],
        allergens: ["Milk"],
        addons: FRIES_ADDONS,
      },
      {
        name: "Crispy Onion Rings",
        slug: "crispy-onion-rings",
        price: 1800,
        desc: "Sweet onion in a shatter-crisp batter, with a dip of choice.",
        tags: ["Veg"],
        img: "1639024471283-03518883512d",
        calories: 420,
        prepTime: "6–8 min",
        spice: 0,
        ingredients: ["Sweet onion", "Crispy batter", "Sea salt"],
        allergens: ["Gluten"],
        addons: [
          { name: "Smoked aioli dip", price: 400 },
          { name: "Bourbon BBQ dip", price: 400 },
        ],
      },
      {
        name: "Smoked Buffalo Wings",
        slug: "smoked-buffalo-wings",
        price: 2900,
        desc: "Smoked, fried and tossed in fiery buffalo with blue-cheese dip.",
        tags: ["Spicy"],
        img: "1567620832903-9fc6debc209f",
        calories: 560,
        prepTime: "10–12 min",
        spice: 3,
        ingredients: ["Chicken wings", "Buffalo sauce", "Smoked spice rub", "Blue-cheese dip"],
        allergens: ["Milk"],
        addons: [
          { name: "Extra blue-cheese dip", price: 400 },
          { name: "Extra-hot sauce", price: 300 },
        ],
      },
    ],
  },
  {
    id: "milkshakes",
    index: "04",
    title: "Milkshakes",
    items: [
      {
        name: "Salted Caramel",
        slug: "salted-caramel",
        price: 2000,
        desc: "Hand-spun, salted caramel swirl, whipped cream.",
        tags: ["Veg"],
        img: "1572490122747-3968b75cc699",
        calories: 620,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Vanilla ice cream", "Salted caramel", "Whipped cream", "Whole milk"],
        allergens: ["Milk"],
        addons: SHAKE_ADDONS,
      },
      {
        name: "Oreo Cookies & Cream",
        slug: "oreo-cookies-cream",
        price: 2100,
        desc: "Blended Oreo, vanilla soft serve, cookie crumb.",
        tags: ["Veg"],
        img: "1553787499-6f9133860278",
        calories: 660,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Vanilla soft serve", "Oreo cookies", "Whole milk", "Whipped cream"],
        allergens: ["Milk", "Gluten", "Soy"],
        addons: SHAKE_ADDONS,
      },
      {
        name: "Pistachio",
        slug: "pistachio",
        price: 2200,
        desc: "Roasted pistachio with a hint of white chocolate.",
        tags: ["Veg"],
        img: "1577805947697-89e18249d767",
        calories: 640,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Roasted pistachio", "White chocolate", "Vanilla ice cream", "Whole milk"],
        allergens: ["Milk", "Nuts"],
        addons: SHAKE_ADDONS,
      },
      {
        name: "Strawberry Field",
        slug: "strawberry-field",
        price: 2000,
        desc: "Fresh strawberry and vanilla bean.",
        tags: ["Veg"],
        img: "1611928237590-087afc90c6fd",
        calories: 580,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Fresh strawberry", "Vanilla bean", "Vanilla ice cream", "Whole milk"],
        allergens: ["Milk"],
        addons: SHAKE_ADDONS,
      },
      {
        name: "Vanilla Bean",
        slug: "vanilla-bean",
        price: 1900,
        desc: "Madagascar vanilla — classic, thick and creamy.",
        tags: ["Veg"],
        img: "1594488506255-a8bbfdeedbaf",
        calories: 560,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Madagascar vanilla", "Vanilla ice cream", "Whole milk", "Whipped cream"],
        allergens: ["Milk"],
        addons: SHAKE_ADDONS,
      },
    ],
  },
  {
    id: "drinks",
    index: "05",
    title: "Craft Drinks",
    items: [
      {
        name: "House Lemonade · Tarragon",
        slug: "house-lemonade-tarragon",
        price: 1400,
        desc: "House lemonade infused with fragrant tarragon.",
        tags: ["Veg"],
        img: "1523677011781-c91d1bbe2f9e",
        calories: 120,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Lemon", "Tarragon", "Cane sugar", "Sparkling water"],
        allergens: [],
      },
      {
        name: "Pomegranate Spritz · Mocktail",
        slug: "pomegranate-spritz-mocktail",
        price: 1700,
        desc: "Armenian pomegranate, soda, lime, mint.",
        tags: ["Veg"],
        img: "1602860637860-fa3d04533a07",
        calories: 150,
        prepTime: "3–4 min",
        spice: 0,
        ingredients: ["Armenian pomegranate", "Soda", "Lime", "Mint"],
        allergens: [],
      },
      {
        name: "Cucumber Cooler · Mocktail",
        slug: "cucumber-cooler-mocktail",
        price: 1600,
        desc: "Cucumber, elderflower, tonic.",
        tags: ["Veg"],
        img: "1551024709-8f23befc6f87",
        calories: 110,
        prepTime: "3–4 min",
        spice: 0,
        ingredients: ["Cucumber", "Elderflower", "Tonic", "Lime"],
        allergens: [],
      },
      {
        name: "Fresh Orange Juice",
        slug: "fresh-orange-juice",
        price: 1500,
        desc: "Cold-pressed, no sugar added.",
        tags: ["Veg"],
        img: "1600271886742-f049cd451bba",
        calories: 130,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Cold-pressed orange"],
        allergens: [],
      },
      {
        name: "Apricot Nectar",
        slug: "apricot-nectar",
        price: 1500,
        desc: "Armenian apricot, pressed daily.",
        tags: ["Veg"],
        img: "1582979512210-99b6a53386f9",
        calories: 140,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Armenian apricot"],
        allergens: [],
      },
      {
        name: "Espresso",
        slug: "espresso",
        price: 900,
        desc: "Single-origin, double shot.",
        tags: ["Veg"],
        img: "1595434091143-b375ced5fe5c",
        calories: 8,
        prepTime: "3–5 min",
        spice: 0,
        ingredients: ["Single-origin espresso"],
        allergens: [],
        addons: COFFEE_ADDONS,
      },
      {
        name: "Cappuccino",
        slug: "cappuccino",
        price: 1200,
        desc: "Espresso, steamed milk, velvet foam.",
        tags: ["Veg"],
        img: "1509042239860-f550ce710b93",
        calories: 90,
        prepTime: "3–5 min",
        spice: 0,
        ingredients: ["Espresso", "Steamed milk", "Velvet foam"],
        allergens: ["Milk"],
        addons: COFFEE_ADDONS,
      },
      {
        name: "Flat White",
        slug: "flat-white",
        price: 1200,
        desc: "Double ristretto, silky micro-foam.",
        tags: ["Veg"],
        img: "1511920170033-f8396924c348",
        calories: 110,
        prepTime: "3–5 min",
        spice: 0,
        ingredients: ["Double ristretto", "Micro-foam milk"],
        allergens: ["Milk"],
        addons: COFFEE_ADDONS,
      },
      {
        name: "Herbal Tea",
        slug: "herbal-tea",
        price: 1100,
        desc: "Mountain thyme & rosehip from the highlands.",
        tags: ["Veg"],
        img: "1571934811356-5cc061b6821f",
        calories: 5,
        prepTime: "3–5 min",
        spice: 0,
        ingredients: ["Mountain thyme", "Rosehip"],
        allergens: [],
      },
      {
        name: "Cold Brew · Single Origin",
        slug: "cold-brew-single-origin",
        price: 1500,
        desc: "Slow-steeped single-origin, smooth and bold.",
        tags: ["Veg"],
        img: "1549652127-2e5e59e86a7a",
        calories: 15,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Single-origin coffee", "Slow-steeped 18h"],
        allergens: [],
        addons: COFFEE_ADDONS,
      },
      {
        name: "Yerevan Craft Lager",
        slug: "yerevan-craft-lager",
        price: 1600,
        desc: "Crisp, locally brewed craft lager.",
        img: "1608270586620-248524c67de9",
        calories: 180,
        prepTime: "1–2 min",
        spice: 0,
        ingredients: ["Craft lager"],
        allergens: ["Gluten"],
      },
    ],
  },
  {
    id: "extras",
    index: "06",
    title: "Sauces & Extras",
    items: [
      {
        name: "House Burger Sauce",
        slug: "house-burger-sauce",
        price: 400,
        desc: "Our signature tangy-sweet burger sauce.",
        tags: ["Veg"],
        img: "1563599175592-c58dc214deff",
        calories: 90,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["House burger sauce"],
        allergens: ["Egg"],
      },
      {
        name: "Smoked Aioli",
        slug: "smoked-aioli",
        price: 400,
        desc: "Smoked garlic aioli, rich and creamy.",
        tags: ["Veg"],
        img: "1612451290298-c799c8a4df5f",
        calories: 100,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["Smoked garlic aioli"],
        allergens: ["Egg"],
      },
      {
        name: "Bourbon BBQ",
        slug: "bourbon-bbq",
        price: 400,
        desc: "Sweet, smoky bourbon barbecue sauce.",
        tags: ["Veg"],
        img: "1605494708467-59cc8ebbe337",
        calories: 70,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["Bourbon BBQ sauce"],
        allergens: [],
      },
      {
        name: "Garlic Truffle Mayo",
        slug: "garlic-truffle-mayo",
        price: 500,
        desc: "Garlic mayo lifted with black truffle.",
        tags: ["Veg"],
        img: "1612451291797-1e54193fa344",
        calories: 110,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["Garlic truffle mayo"],
        allergens: ["Egg"],
      },
      {
        name: "Extra Smash Patty",
        slug: "extra-smash-patty",
        price: 1500,
        desc: "Add a smashed dry-aged Angus patty.",
        tags: ["Halal"],
        img: "1615937691194-97dbd3f3dc29",
        calories: 220,
        prepTime: "4–6 min",
        spice: 0,
        ingredients: ["Smashed Angus beef"],
        allergens: [],
      },
      {
        name: "Extra Cheese",
        slug: "extra-cheese",
        price: 500,
        desc: "An extra slice of melted aged cheddar.",
        tags: ["Veg"],
        img: "1683314573422-649a3c6ad784",
        calories: 90,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["Aged cheddar"],
        allergens: ["Milk"],
      },
      {
        name: "Smoked Bacon",
        slug: "smoked-bacon",
        price: 700,
        desc: "Two rashers of crisp smoked bacon.",
        img: "1694983361629-0363ab0d1b49",
        calories: 130,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Smoked bacon"],
        allergens: [],
      },
      {
        name: "Smashed Avocado",
        slug: "smashed-avocado",
        price: 800,
        desc: "Fresh smashed avocado with lime and salt.",
        tags: ["Veg"],
        img: "1593967858253-7eeb1c661706",
        calories: 120,
        prepTime: "1 min",
        spice: 0,
        ingredients: ["Smashed avocado", "Lime", "Sea salt"],
        allergens: [],
      },
    ],
  },
  {
    id: "kids",
    index: "07",
    title: "Kids",
    items: [
      {
        name: "Lil' Smash Meal",
        slug: "lil-smash-meal",
        price: 3200,
        desc: "Mini beef burger, small fries, and a juice of choice.",
        tags: ["Halal"],
        img: "1599474151439-9f3c4e972009",
        calories: 560,
        prepTime: "8–10 min",
        spice: 0,
        ingredients: ["Mini beef burger", "Small fries", "Juice of choice"],
        allergens: ["Gluten", "Milk", "Sesame"],
        addons: [
          { name: "Add cheese", price: 300 },
          { name: "Swap to apple juice", price: 0 },
        ],
      },
    ],
  },
  {
    id: "sweet",
    index: "08",
    title: "Sweet",
    items: [
      {
        name: "Burnt Basque Cheesecake",
        slug: "burnt-basque-cheesecake",
        price: 2400,
        desc: "Caramelised, crackly top with a molten-soft centre.",
        tags: ["Veg"],
        img: "1524351199678-941a58a3df50",
        calories: 450,
        prepTime: "2–3 min",
        spice: 0,
        ingredients: ["Cream cheese", "Vanilla", "Eggs", "Cream"],
        allergens: ["Milk", "Egg"],
        addons: [
          { name: "Berry compote", price: 400 },
          { name: "Scoop of ice cream", price: 600 },
        ],
      },
      {
        name: "Dark Chocolate Lava",
        slug: "dark-chocolate-lava",
        price: 2600,
        desc: "Warm dark-chocolate cake with a molten centre.",
        tags: ["Veg"],
        img: "1605807646983-377bc5a76493",
        calories: 560,
        prepTime: "8–10 min",
        spice: 0,
        ingredients: ["Dark chocolate", "Molten centre", "Cocoa", "Butter"],
        allergens: ["Milk", "Egg", "Gluten"],
        addons: [
          { name: "Scoop of ice cream", price: 600 },
          { name: "Salted caramel drizzle", price: 300 },
        ],
      },
    ],
  },
];

export interface FlatMenuItem {
  item: MenuItem;
  category: MenuCategory;
}

/** Flattened list of every menu item paired with its category. */
export const ALL_ITEMS: FlatMenuItem[] = MENU.flatMap((category) =>
  category.items.map((item) => ({ item, category })),
);

export function getMenuItemBySlug(slug: string): FlatMenuItem | undefined {
  return ALL_ITEMS.find((f) => f.item.slug === slug);
}

/** Deterministic 4.5–4.9 rating derived from the slug (stable, no RNG). */
export function itemRating(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return Math.round((4.5 + (h % 5) / 10) * 10) / 10;
}

export const COMBO = {
  title: "The Full House Combo",
  desc: "Any signature burger + fries + craft drink.",
  was: 8300,
  now: 6900,
};

/** Spend this much (dram) for free delivery — used by the cart upsell hint. */
export const FREE_DELIVERY_THRESHOLD = 8000;

/** Before/after image pair for the "raw → flame-grilled" comparison slider. */
export const BEFORE_AFTER = {
  before: { id: "1615937691194-97dbd3f3dc29", alt: "Raw smashed Angus patty before grilling" },
  after: { id: "1568901346375-23c9450c58cd", alt: "The same patty, flame-grilled into a finished burger" },
};

/** "Chef's special today" featured banner (visual/content only). */
export const CHEF_SPECIAL = {
  name: "Truffle Noir Deluxe",
  slug: "truffle-noir",
  desc: "Tonight only — Wagyu blend, double black truffle, gruyère and wild mushroom.",
  img: "1607013251379-e6eecfffe234",
  price: 6900,
  was: 8400,
  badge: "Chef's special",
};

export interface Review {
  text: string;
  name: string;
  initial: string;
  meta: string;
}

export const REVIEWS: Review[] = [
  {
    text:
      "Hands down the best burger in Yerevan. The Truffle Noir is unreal and the room feels like a proper restaurant, not a fast-food joint.",
    name: "Anna G.",
    initial: "A",
    meta: "Local Guide · 47 reviews",
  },
  {
    text:
      "Came for a quick bite, stayed two hours. Smashed patties, perfect brioche, and the truffle fries are dangerously good.",
    name: "David M.",
    initial: "D",
    meta: "Tourist · 12 reviews",
  },
  {
    text:
      "The Garden Smash converted my vegetarian friend into a regular. Beautiful interior, attentive staff, fair prices.",
    name: "Lilit H.",
    initial: "L",
    meta: "Local Guide · 89 reviews",
  },
  {
    text:
      "We booked for a birthday of ten — they handled it flawlessly. The Smoky Ember has the perfect amount of heat. Coming back.",
    name: "Narek S.",
    initial: "N",
    meta: "Local Guide · 31 reviews",
  },
  {
    text:
      "Cosy, golden-lit, and that brioche is baked in-house — you can taste it. Easily a top-three burger I've had anywhere.",
    name: "Sona P.",
    initial: "S",
    meta: "Local Guide · 64 reviews",
  },
];

export const RATING = { value: 4.9, count: 2400 };

export interface Stat {
  value: string;
  label: string;
  /** numeric target + suffix for count-up; omit to render value as-is */
  countTo?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const HERO_STATS: Stat[] = [
  { value: "4.9★", label: "2,400+ reviews", countTo: 4.9, suffix: "★", decimals: 1 },
  { value: "100%", label: "Angus beef", countTo: 100, suffix: "%" },
  { value: "7 min", label: "from Republic Sq.", countTo: 7, suffix: " min" },
];

export const STORY_STATS: Stat[] = [
  { value: "12", label: "Hour dry-age", countTo: 12 },
  { value: "100%", label: "Local produce", countTo: 100, suffix: "%" },
  { value: "5★", label: "Hygiene rating", countTo: 5, suffix: "★" },
];

/** Marquee strip words (✦ separators added in component). */
export const MARQUEE = [
  "Dry-aged Angus",
  "House-baked brioche",
  "Smashed to order",
  "Local Armenian produce",
  "Craft sauces",
];

/** Gallery — original 6 photos first, plus extras for the full /gallery page. */
export const GALLERY: { id: string; alt: string }[] = [
  { id: "1586190848861-99aa4a171e90", alt: "Stacked cheeseburger close-up" },
  { id: "1572802419224-296b0aeee0d9", alt: "Burger and golden fries on a board" },
  { id: "1521305916504-4a1121188589", alt: "Crispy seasoned fries" },
  { id: "1565299624946-b28f40a0ae38", alt: "Burger with melted cheese on dark background" },
  { id: "1610440042657-612c34d95e9f", alt: "Bacon cheeseburger" },
  { id: "1551782450-a2132b4ba21d", alt: "Juicy burger held in hand" },
  { id: "1607013251379-e6eecfffe234", alt: "Gourmet truffle burger" },
  { id: "1549611016-3a70d82b5040", alt: "Spicy burger with jalapeños" },
  { id: "1571091718767-18b5b1457add", alt: "Double-stacked cheeseburger" },
  { id: "1606131731446-5568d87113aa", alt: "Chef flame-grilling patties in the open kitchen" },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Is there parking nearby?",
    a: "Yes — metered street parking runs the length of Saryan Street, and the Northern Avenue underground garage is a 4-minute walk away.",
  },
  {
    q: "Is the beef halal?",
    a: "All of our beef is halal-certified Angus. Halal items are marked on the menu, and our kitchen team is happy to talk you through any dish.",
  },
  {
    q: "Do you take group bookings?",
    a: "Absolutely. We host groups of up to 30 and can arrange set menus for birthdays and events — just note your party size in the reservation form or call us.",
  },
  {
    q: "Do you deliver?",
    a: "We deliver across central Yerevan through the usual apps, and you can also order ahead for pickup by phone. Delivery hours match our kitchen hours.",
  },
];

/** Weekly opening hours. Minutes from midnight; close > 1440 means after-midnight. */
// TODO: REPLACE WITH REAL VALUE — full weekly opening hours. `open`/`close` are
// minutes from midnight (660 = 11:00, 1380 = 23:00, 1500 = 01:00 next day).
// Keep HOURS, HOURS_TABLE and SITE.contact.hoursDisplay in sync.
export const HOURS: { open: number; close: number }[] = [
  { open: 660, close: 1500 }, // Sun 11:00–01:00
  { open: 660, close: 1380 }, // Mon 11:00–23:00
  { open: 660, close: 1380 }, // Tue
  { open: 660, close: 1380 }, // Wed
  { open: 660, close: 1380 }, // Thu
  { open: 660, close: 1500 }, // Fri 11:00–01:00
  { open: 660, close: 1500 }, // Sat 11:00–01:00
];

// TODO: REPLACE WITH REAL VALUE — display version of the weekly hours above.
export const HOURS_TABLE = [
  { day: "Monday", hours: "11:00 – 23:00" },
  { day: "Tuesday", hours: "11:00 – 23:00" },
  { day: "Wednesday", hours: "11:00 – 23:00" },
  { day: "Thursday", hours: "11:00 – 23:00" },
  { day: "Friday", hours: "11:00 – 01:00" },
  { day: "Saturday", hours: "11:00 – 01:00" },
  { day: "Sunday", hours: "11:00 – 01:00" },
];

/** Format dram price, e.g. 4900 → "֏4,900". */
export function dram(n: number): string {
  return "֏" + n.toLocaleString("en-US");
}

/* ============================================================
   ORDER ONLINE — delivery partners (placeholder URLs to edit)
   ============================================================ */
export interface DeliveryPartner {
  name: string;
  url: string;
  /** brand accent used for the hover state */
  color: string;
  eta: string;
}

export const DELIVERY: { partners: DeliveryPartner[] } = {
  partners: [
    { name: "Wolt", url: "https://wolt.com/en/arm/yerevan", color: "#00C2E8", eta: "25–35 min" },
    { name: "Glovo", url: "https://glovoapp.com/am/en/yerevan/", color: "#FFC244", eta: "20–30 min" },
    { name: "Yandex Eats", url: "https://eda.yandex/", color: "#FC3F1D", eta: "30–40 min" },
  ],
};

/* ============================================================
   BUILD-YOUR-OWN-BURGER configurator options
   ============================================================ */
export interface BuilderOption {
  id: string;
  name: string;
  price: number;
  tags?: DietTag[];
}
export interface BuilderStep {
  id: "bun" | "patty" | "cheese" | "toppings" | "sauce";
  title: string;
  multiple?: boolean;
  options: BuilderOption[];
}

/** Base price covers bun + one patty + cheese + sauce; options add on top. */
export const BUILDER_BASE_PRICE = 3200;

export const BUILDER: BuilderStep[] = [
  {
    id: "bun",
    title: "Bun",
    options: [
      { id: "brioche", name: "Toasted Brioche", price: 0 },
      { id: "sesame", name: "Sesame Classic", price: 0 },
      { id: "noir", name: "Brioche Noir", price: 300 },
      { id: "lettuce", name: "Lettuce Wrap", price: 0, tags: ["Veg"] },
    ],
  },
  {
    id: "patty",
    title: "Patty",
    options: [
      { id: "angus", name: "Dry-aged Angus", price: 0, tags: ["Halal"] },
      { id: "double", name: "Double Smash", price: 1500, tags: ["Halal"] },
      { id: "chicken", name: "Crispy Chicken", price: 0, tags: ["Halal"] },
      { id: "bean", name: "Black-bean Patty", price: 0, tags: ["Veg"] },
    ],
  },
  {
    id: "cheese",
    title: "Cheese",
    options: [
      { id: "cheddar", name: "Aged Cheddar", price: 0, tags: ["Veg"] },
      { id: "gruyere", name: "Gruyère", price: 300, tags: ["Veg"] },
      { id: "pepperjack", name: "Pepper Jack", price: 200, tags: ["Veg", "Spicy"] },
      { id: "gouda", name: "Smoked Gouda", price: 300, tags: ["Veg"] },
      { id: "none", name: "No Cheese", price: 0, tags: ["Veg"] },
    ],
  },
  {
    id: "toppings",
    title: "Toppings",
    multiple: true,
    options: [
      { id: "bacon", name: "Smoked Bacon", price: 700 },
      { id: "avocado", name: "Avocado", price: 800, tags: ["Veg"] },
      { id: "onion", name: "Caramelised Onion", price: 300, tags: ["Veg"] },
      { id: "jalapeno", name: "Charred Jalapeño", price: 300, tags: ["Veg", "Spicy"] },
      { id: "mushroom", name: "Wild Mushroom", price: 400, tags: ["Veg"] },
      { id: "rings", name: "Onion Rings", price: 500, tags: ["Veg"] },
      { id: "egg", name: "Fried Egg", price: 500, tags: ["Veg"] },
    ],
  },
  {
    id: "sauce",
    title: "Sauce",
    options: [
      { id: "house", name: "House Burger Sauce", price: 0, tags: ["Veg"] },
      { id: "aioli", name: "Smoked Aioli", price: 0, tags: ["Veg"] },
      { id: "bbq", name: "Bourbon BBQ", price: 0, tags: ["Veg"] },
      { id: "truffle", name: "Garlic Truffle Mayo", price: 200, tags: ["Veg"] },
      { id: "harissa", name: "Harissa Mayo", price: 200, tags: ["Veg", "Spicy"] },
    ],
  },
];

/* ============================================================
   HAPPY HOUR — daily window (minutes from midnight, local time)
   ============================================================ */
export const HAPPY_HOUR = {
  label: "Happy Hour",
  blurb: "20% off all burgers & milkshakes",
  /** 0 = Sun … 6 = Sat */
  days: [1, 2, 3, 4, 5],
  start: 16 * 60, // 16:00
  end: 19 * 60, // 19:00
  startLabel: "16:00",
  endLabel: "19:00",
  daysLabel: "Mon–Fri",
};

/* ============================================================
   PRESS / AWARDS strip
   ============================================================ */
export const PRESS: string[] = [
  "TripAdvisor",
  "Google",
  "EVN Report",
  "Time Out",
  "CJN Awards",
  "Yerevan Eats",
];

/* ============================================================
   CATERING & EVENTS
   ============================================================ */
export interface CateringPackage {
  id: "essential" | "signature" | "premium";
  name: string;
  /** Price per guest, in dram. */
  perGuest: number;
  tagline: string;
  /** Recommended group size. */
  guests: string;
  inclusions: string[];
  popular?: boolean;
}

export interface CateringAddOn {
  id: string;
  name: string;
  /** Flat add-on price in dram, unless `perGuest` is true. */
  price: number;
  perGuest?: boolean;
  desc: string;
}

export interface CateringProcessStep {
  step: string;
  title: string;
  body: string;
}

export interface CateringTestimonial {
  quote: string;
  name: string;
  role: string;
}

export const CATERING = {
  /** Minimum group size we cater for. */
  minGuests: 10,
  /** Minimum lead time before the event date. */
  minLeadDays: 5,
  minLeadLabel: "5 days",
  /** Refundable deposit to lock a date (overridable via CATERING_DEPOSIT_AMD). */
  defaultDepositAmd: 50000,
  /** Placeholder catering menu PDF served from /public. */
  menuPdf: "/catering-menu.pdf", // TODO: REPLACE WITH REAL VALUE — replace public/catering-menu.pdf with the real menu

  // TODO: REPLACE WITH REAL VALUE — confirm per-guest catering prices (dram) + add-on prices below.
  packages: [
    {
      id: "essential",
      name: "Essential",
      perGuest: 5500,
      tagline: "Crowd-pleasing burgers, delivered hot and handled.",
      guests: "10–30 guests",
      inclusions: [
        "Choice of 3 signature burgers (incl. veg & halal)",
        "Hand-cut fries & house slaw",
        "Soft drinks & still water",
        "Eco serveware, napkins & condiments",
        "Delivery & setup in central Yerevan",
      ],
    },
    {
      id: "signature",
      name: "Signature",
      perGuest: 8900,
      tagline: "Our most-booked package — a proper flame-grilled spread.",
      guests: "25–80 guests",
      popular: true,
      inclusions: [
        "Choice of 5 burgers + loaded sides bar",
        "Truffle fries, onion rings & two salads",
        "Craft sodas, lemonade & still/sparkling water",
        "Dessert minis (brownies & mini shakes)",
        "Uniformed setup crew + premium serveware",
        "Custom menu cards with your event name",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      perGuest: 13500,
      tagline: "The full live-fire experience, start to finish.",
      guests: "50–150 guests",
      inclusions: [
        "Everything in Signature, plus:",
        "On-site live flame station — grilled to order",
        "Dedicated chef + full service team",
        "Milkshake & dessert bar",
        "Welcome drinks & curated sauce flight",
        "Full styling, signage & event-day coordinator",
      ],
    },
  ] as CateringPackage[],

  addOns: [
    { id: "flame-station", name: "Live flame station", price: 120000, desc: "Our chefs smash & grill in front of your guests." },
    { id: "milkshake-bar", name: "Milkshake bar", price: 1800, perGuest: true, desc: "Self-serve shakes with mix-ins, per guest." },
    { id: "dessert-table", name: "Dessert table", price: 1500, perGuest: true, desc: "Brownies, mini cakes & seasonal fruit, per guest." },
    { id: "staff", name: "Servers & staff", price: 45000, desc: "Extra uniformed server for 4 hours of service." },
    { id: "custom-cake", name: "Custom cake", price: 28000, desc: "Bespoke celebration cake, your design." },
    { id: "branded-packaging", name: "Branded packaging", price: 600, perGuest: true, desc: "Your logo on boxes & cups, per guest." },
  ] as CateringAddOn[],

  serviceStyles: [
    "Delivery (drop & go)",
    "Drop-off + setup",
    "On-site live station",
    "Full-service (staff + service)",
  ],

  budgets: ["Under ֏300k", "֏300k–600k", "֏600k–1.2M", "֏1.2M+", "Not sure yet"],

  eventTypes: ["Birthday", "Corporate", "Wedding", "Conference", "Private party", "Other"],

  process: [
    { step: "01", title: "Inquire", body: "Tell us your date, headcount and vibe. Use the estimator for a ballpark, then send the form." },
    { step: "02", title: "Custom quote", body: "Our events team replies within 24 hours with a tailored menu and an itemised quote." },
    { step: "03", title: "Tasting", body: "For 50+ guests, come in for a complimentary tasting and lock the final menu." },
    { step: "04", title: "Event day", body: "We arrive early, set up, grill, and tidy away — you just enjoy the party." },
  ] as CateringProcessStep[],

  faqs: [
    { q: "What's the minimum group size?", a: "We cater for 10 guests and up. For very large events (150+), we'll build a fully bespoke proposal." },
    { q: "How far in advance should I book?", a: "At least 5 days for delivery packages, and 2–3 weeks for the live flame station so we can staff and source properly." },
    { q: "Can you handle dietary needs?", a: "Yes — every package includes vegetarian and halal options, and we can do vegan and gluten-conscious builds. Note headcounts and allergies in the form." },
    { q: "Do you travel outside central Yerevan?", a: "We cover greater Yerevan and nearby venues. Out-of-city events are welcome with a small travel fee — just ask." },
    { q: "How does payment work?", a: "A refundable deposit locks your date; the balance is due after the event by invoice or card. The estimator is a guide — your final quote comes by email." },
  ] as Faq[],

  testimonials: [
    { quote: "The live flame station completely stole the show at our company offsite. Eighty people, zero stress, and the best burgers in Yerevan.", name: "Anahit S.", role: "People Lead, TechCorp" },
    { quote: "They handled our wedding of 130 like absolute pros — on time, beautifully styled, and the halal and veg guests were just as spoiled.", name: "Narek & Mariam", role: "Newlyweds" },
    { quote: "We use BurgerHouse for every quarterly all-hands now. Invoiced, punctual, and the team always remembers our vegan headcount.", name: "Davit G.", role: "Office Manager, Orbi" },
  ] as CateringTestimonial[],

  /** Logos for the 'trusted by' strip. */
  trustedBy: ["TechCorp", "Orbi", "EVN Report", "Ucom", "Picsart", "SAS Group"],
} as const;

