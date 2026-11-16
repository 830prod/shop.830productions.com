// The shop catalogue. The shelf on the home page and every product page read from this one list.
//
// To add a product: add an entry here with a unique `slug`, add its Stripe Payment Link to
// STRIPE_PAYMENT_LINKS under the same `linkId`, and put its photos in public/img/products/<slug>/.
// For the shelf it also needs a cut-out (a PNG with a transparent background) in public/img/cutouts/.
// The product page at /<slug> is built automatically.
//
// The LUT boxes come from lib/lut-boxes.ts; their prices and Stripe links are set further down.
//
// `price: null` shows "Coming soon" and keeps the buy button off.
// `comingSoon: true` shows the price but says "Coming soon" until the product has a Stripe link.
// `shelf: "hidden"` keeps a product off the shelf but leaves its page at /<slug> (used for the test product).
// `hidden: true` takes a product off the site (shelf and its own page) without deleting it.
// A color can carry its own `linkId` if it has a separate Stripe link; otherwise every color checks
// out through the product's `linkId`.

import { LUT_BOXES } from "./lut-boxes";

export type ProductImage = { src: string; alt: string };

export type ProductColor = {
  name: string;
  swatch: string;
  cutout: string;
  images: ProductImage[];
  linkId?: string;
};

export type Product = {
  slug: string;
  name: string;
  /** Short name under the item on the shelf. */
  short: string;
  category: "digital" | "merch";
  /** Which shelf it stands on. `featured` stands in the hero; `hidden` is reachable only by its address. */
  shelf: "boxes" | "studio" | "hidden";
  featured?: boolean;
  tag: string;
  /** For LUT boxes: the box number and what is inside. */
  number?: string;
  lutCount?: number;
  luts?: { group?: string; names: string[] }[];
  /** Priced, but not on sale until it has a Stripe link. */
  comingSoon?: boolean;
  price: number | null;
  linkId: string;
  blurb: string;
  description: string;
  details: string[];
  checkoutNote: string;
  /** Transparent PNG that stands on the shelf. Colors override it. */
  cutout: string;
  /** The cut-out's width divided by its height (every color shares it). */
  cutoutRatio: number;
  images: ProductImage[];
  colors?: ProductColor[];
  /** How much of its shelf slot the cut-out fills, so a hat isn't drawn as tall as a box. */
  shelfScale?: number;
  hidden?: boolean;
};

// Stripe Payment Links, keyed by each product's `linkId`.
// Leave a value empty ("") to show a priced product as "Out of Stock".
export const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  "flat-bill-hat": "https://buy.stripe.com/14A28l1pXb1QdWJd4AeUU04",
  sweatshirt: "https://buy.stripe.com/28E5kxd8F4DsaKx3u0eUU05",
  "whiskey-glass": "",
  "desk-mat": "https://buy.stripe.com/9B66oBc4B5Hw5qdfcIeUU06",

  // LUT boxes. Order is the box number (01 Wedding & Romance ... 15 Mix & Match Starter), then Complete.
  "complete-lut-box": "https://buy.stripe.com/eVq6oB4C96LA6uhggMeUU0b",
  "wedding-and-romance-lut-box": "https://buy.stripe.com/cNi14hfgN5HwdWJaWseUU0q",
  "vlog-and-creator-lut-box": "https://buy.stripe.com/6oU6oB4C99XM8Cp0hOeUU0p",
  "cinematic-film-lut-box": "https://buy.stripe.com/eVq00d3y57PEbOB6GceUU0o",
  "soft-cinema-lut-box": "https://buy.stripe.com/8x2eV74C99XM05TggMeUU0n",
  "dark-and-moody-lut-box": "https://buy.stripe.com/4gM7sF1pXfi6aKx9SoeUU0m",
  "moody-tones-lut-box": "https://buy.stripe.com/4gMbIV9Wtee22e1aWseUU0l",
  "travel-and-outdoors-lut-box": "https://buy.stripe.com/eVqcMZ7Olfi66uh7KgeUU0k",
  "urban-and-night-lut-box": "https://buy.stripe.com/3cIcMZ1pXd9Y8Cp0hOeUU0j",
  "noir-and-faded-lut-box": "https://buy.stripe.com/eVqfZb0lT3zo5qd5C8eUU0i",
  "cold-and-winter-lut-box": "https://buy.stripe.com/28EfZb2u1fi67yle8EeUU0h",
  "warm-and-golden-hour-lut-box": "https://buy.stripe.com/4gMdR3d8F5Hw2e19SoeUU0g",
  "real-estate-and-clean-commercial-lut-box": "https://buy.stripe.com/28EdR30lT3zo6uh1lSeUU0f",
  "color-pop-lut-box": "https://buy.stripe.com/28E5kx7Olgma8Cpc0weUU0e",
  "everyday-collection-lut-box": "https://buy.stripe.com/5kQbIVb0x4Dsg4R2pWeUU0d",
  "mix-and-match-starter-lut-box": "https://buy.stripe.com/fZu00d0lTfi65qd0hOeUU0c",

  // Test-mode link for the unlisted /test-order page (see below). Sandbox payments only.
  "test-order": "https://buy.stripe.com/test_aFa9AT4QCbTD19d6WM0oM00",
};

// LUT box prices: every single box costs the same, the Complete box has its own price.
const LUT_BOX_PRICE = 5;
const COMPLETE_LUT_BOX_PRICE = 49.99;
export const COMPLETE_LUT_BOX = "complete-lut-box";

const lutBoxProducts: Product[] = LUT_BOXES.map((box) => {
  const complete = box.slug === COMPLETE_LUT_BOX;
  return {
    slug: box.slug,
    name: complete ? box.name : `${box.name} LUT Box`,
    short: box.name,
    category: "digital",
    shelf: "boxes",
    featured: complete,
    tag: complete ? "The full set" : `LUT Box ${box.number}`,
    number: box.number,
    lutCount: box.count,
    // "Night CIty" is how the files are named; show it properly.
    luts: box.groups.map((g) => ({ ...g, names: g.names.map((n) => n.replace("CIty", "City")) })),
    price: complete ? COMPLETE_LUT_BOX_PRICE : LUT_BOX_PRICE,
    linkId: box.slug,
    blurb: box.tagline,
    description: box.description,
    details: [
      `${box.count} video LUTs (.cube)`,
      "Works in Premiere Pro, DaVinci Resolve, Final Cut Pro, CapCut and most editors",
      "Made for standard Rec.709 footage",
      "Instant download, saved to your account",
    ],
    checkoutNote: "Instant download after checkout. Your files stay in your account.",
    cutout: `/img/cutouts/lut-boxes/${box.slug}.png`,
    cutoutRatio: complete ? 518 / 720 : 471 / 720,
    images: [{ src: `/img/products/lut-boxes/${box.slug}.jpg`, alt: `${box.name} LUT Box cover` }],
  };
});

const sweatshirtColors: [string, string, string][] = [
  ["Navy", "navy", "#1f2a44"],
  ["Army Green", "army-green", "#5b6142"],
  ["Light Blue", "light-blue", "#7ea6dc"],
  ["Sand", "sand", "#d8ccb4"],
  ["Pink", "pink", "#f6d2e0"],
  ["Safety Pink", "safety-pink", "#ef6b86"],
];

const ALL_PRODUCTS: Product[] = [
  ...lutBoxProducts,
  {
    slug: "crewneck-sweatshirt",
    name: "830 Crewneck Sweatshirt",
    short: "Crewneck",
    category: "merch",
    shelf: "studio",
    tag: "Apparel",
    price: 40.99,
    linkId: "sweatshirt",
    blurb: "Heavy blend crewneck. Reel on the chest, lockup on the back.",
    description:
      "The sweatshirt the crew wears on cold shoots and late edit nights. Reel mark on the chest, the full 830 Productions lockup across the back and a print down the sleeve.",
    details: [
      "Unisex heavy blend crewneck",
      "Reel mark front, 830 Productions lockup back, sleeve print",
      "Choose your size at checkout",
    ],
    checkoutNote: "Choose your color and size at checkout. Ground shipping $5.99.",
    cutout: "/img/cutouts/sweatshirt-navy.png",
    cutoutRatio: 656 / 568,
    shelfScale: 0.62,
    images: [],
    colors: sweatshirtColors.map(([name, file, swatch]) => ({
      name,
      swatch,
      cutout: `/img/cutouts/sweatshirt-${file}.png`,
      images: ["front", "back", "model", "folded"].map((view) => ({
        src: `/img/products/sweatshirt/${file}-${view}.jpg`,
        alt: `830 Crewneck Sweatshirt in ${name.toLowerCase()}, ${view} view`,
      })),
    })),
  },
  {
    slug: "flat-bill-hat",
    name: "830 Flat Bill Hat",
    short: "Flat Bill Hat",
    category: "merch",
    shelf: "studio",
    tag: "Headwear",
    price: 45.0,
    linkId: "flat-bill-hat",
    blurb: "Structured flat bill with an embroidered reel.",
    description:
      "A structured flat bill cap for set days, events and everything in between. Raised reel embroidery on the front, the 830 Productions lockup on the side and a flag on the other.",
    details: [
      "Structured, flat bill cap",
      "Embroidered reel on the front",
      "830 Productions lockup on one side, US flag on the other",
    ],
    checkoutNote: "Choose your color at checkout. Ground shipping $5.99.",
    cutout: "/img/cutouts/flat-bill-hat-royal-blue.png",
    cutoutRatio: 656 / 583,
    shelfScale: 0.5,
    images: [],
    colors: [
      {
        name: "Royal Blue",
        swatch: "#1f2f8c",
        cutout: "/img/cutouts/flat-bill-hat-royal-blue.png",
        images: [
          { src: "/img/products/flat-bill-hat/blue-front.jpg", alt: "830 Flat Bill Hat in royal blue, front" },
          { src: "/img/products/flat-bill-hat/blue-side.jpg", alt: "830 Flat Bill Hat in royal blue, side with 830 Productions lockup" },
          { src: "/img/products/flat-bill-hat/blue-flag.jpg", alt: "830 Flat Bill Hat in royal blue, side with US flag" },
        ],
      },
      {
        name: "Black",
        swatch: "#15171a",
        cutout: "/img/cutouts/flat-bill-hat-black.png",
        images: [{ src: "/img/products/flat-bill-hat/black-front.jpg", alt: "830 Flat Bill Hat in black, front" }],
      },
    ],
  },
  {
    slug: "whiskey-glass",
    hidden: true,
    name: "830 Rocks Glass",
    short: "Rocks Glass",
    category: "merch",
    shelf: "studio",
    tag: "Barware",
    price: null,
    linkId: "whiskey-glass",
    blurb: "A heavy rocks glass with the 830 Productions lockup.",
    description: "For the wrap drink. A heavy-bottomed rocks glass printed with the 830 Productions lockup.",
    details: ["Heavy-base rocks glass", "830 Productions lockup print"],
    checkoutNote: "Shipping details are collected at checkout.",
    cutout: "/img/cutouts/whiskey-glass.png",
    cutoutRatio: 528 / 656,
    shelfScale: 0.55,
    images: [{ src: "/img/products/whiskey-glass/bar.jpg", alt: "830 Productions rocks glass with an old fashioned on a bar" }],
  },
  {
    slug: "desk-mat",
    name: "830 Stepped Stripe Desk Mat",
    short: "Desk Mat",
    category: "merch",
    shelf: "studio",
    tag: "Desk",
    price: 26.99,
    linkId: "desk-mat",
    blurb: "The brand's stepped stripes, sized for your whole desk.",
    description:
      "Our stepped stripes, four blues from Midnight to Haze, across a full-size desk mat. Room for a keyboard, a mouse and a coffee during the edit.",
    details: ["Full-size desk mat", "Stepped stripes in four brand blues"],
    checkoutNote: "Ground shipping $5.99, added at checkout.",
    cutout: "/img/cutouts/desk-mat.png",
    cutoutRatio: 776 / 420,
    shelfScale: 0.5,
    images: [
      { src: "/img/products/desk-mat/desk.jpg", alt: "830 stepped stripe desk mat on a dark desk with a laptop and coffee" },
      { src: "/img/products/desk-mat/table.jpg", alt: "830 stepped stripe desk mat on a wooden table" },
    ],
  },
  {
    slug: "test-order",
    name: "830 Pack (test)",
    short: "Test",
    category: "digital",
    shelf: "hidden",
    tag: "Sandbox test",
    price: 5,
    linkId: "test-order",
    blurb: "Not for sale. Checks that logging in, checkout and saving the order work.",
    description:
      "A test product that uses Stripe's sandbox, so no real money moves. Pay with the test card 4242 4242 4242 4242, any future expiry and any CVC.",
    details: ["Stripe sandbox checkout", "Test card 4242 4242 4242 4242", "Not listed anywhere on the shop"],
    checkoutNote: "Sandbox checkout. Use the test card 4242 4242 4242 4242, any future date and any CVC.",
    cutout: "/img/cutouts/lut-boxes/complete-lut-box.png",
    cutoutRatio: 518 / 720,
    shelfScale: 1,
    images: [],
  },
];

export const PRODUCTS = ALL_PRODUCTS.filter((p) => !p.hidden);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const colorSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const formatPrice = (price: number | null) =>
  typeof price === "number" ? (Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`) : "Coming soon";

/** Why a product can't be bought right now, or "" when it can. */
export function unavailableLabel(p: Product, color?: ProductColor | null) {
  if (checkoutUrlFor(p, color)) return "";
  return p.price === null || p.comingSoon ? "Coming soon" : "Out of Stock";
}

export const imagesFor = (p: Product, color?: ProductColor | null) => (color ? color.images : p.images);

export const cutoutFor = (p: Product, color?: ProductColor | null) => color?.cutout ?? p.cutout;

/** The Stripe Payment Link for a product (and color), or "" when it can't be bought right now. */
export function checkoutUrlFor(p: Product, color?: ProductColor | null) {
  const url = (STRIPE_PAYMENT_LINKS[color?.linkId ?? p.linkId] ?? "").trim();
  return p.price !== null && url.startsWith("https://") ? url : "";
}
