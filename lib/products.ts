// The shop catalogue. The shelf on the home page and every product page read from this one list.
//
// To add a product: add an entry here with a unique `slug`, add its Stripe Payment Link to
// STRIPE_PAYMENT_LINKS under the same `linkId`, and put its photos in public/img/products/<slug>/.
// For the shelf it also needs a cut-out (a PNG with a transparent background) in public/img/cutouts/.
// The product page at /<slug> is built automatically.
//
// `price: null` shows "Coming soon" and keeps the buy button off.
// `hidden: true` takes a product off the site (shelf and its own page) without deleting it.
// A color can carry its own `linkId` if it has a separate Stripe link; otherwise every color checks
// out through the product's `linkId`.

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
  tag: string;
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
  "photo-lut-pack": "https://buy.stripe.com/14A7sFfgNc5UbOB7KgeUU02",
  "video-lut-pack": "https://buy.stripe.com/aFa5kx6Kh7PEbOBfcIeUU01",
  "flat-bill-hat": "https://buy.stripe.com/14A28l1pXb1QdWJd4AeUU04",
  sweatshirt: "https://buy.stripe.com/28E5kxd8F4DsaKx3u0eUU05",
  "whiskey-glass": "",
  "desk-mat": "https://buy.stripe.com/9B66oBc4B5Hw5qdfcIeUU06",
};

const sweatshirtColors: [string, string, string][] = [
  ["Navy", "navy", "#1f2a44"],
  ["Army Green", "army-green", "#5b6142"],
  ["Light Blue", "light-blue", "#7ea6dc"],
  ["Sand", "sand", "#d8ccb4"],
  ["Pink", "pink", "#f6d2e0"],
  ["Safety Pink", "safety-pink", "#ef6b86"],
];

const ALL_PRODUCTS: Product[] = [
  {
    slug: "video-lut-pack",
    name: "Signature Video LUT Pack",
    short: "Video LUT Pack",
    category: "digital",
    tag: "Video LUTs",
    price: 39.99,
    linkId: "video-lut-pack",
    blurb: "The core looks from our own video color pipeline.",
    description:
      "The grades we reach for on real jobs: brand films, event recaps and social cuts. Drop one on a clip and you have a finished starting point with consistent contrast across the edit.",
    details: [
      "Instant digital download",
      "For brand films, events and social edits",
      "Works in any editor that supports LUTs",
      "Re-download anytime from your account",
    ],
    checkoutNote: "Instant download after checkout. Your files stay in your account.",
    cutout: "/img/cutouts/video-lut-pack.png",
    cutoutRatio: 392 / 776,
    shelfScale: 1,
    images: [
      { src: "/img/products/video-lut-pack/box-midnight.jpg", alt: "830 Productions Video LUT Box on a midnight background" },
      { src: "/img/products/video-lut-pack/box-ice.jpg", alt: "830 Productions Video LUT Box on a light background" },
    ],
  },
  {
    slug: "photo-lut-pack",
    name: "Signature Photo LUT Pack",
    short: "Photo LUT Pack",
    category: "digital",
    tag: "Photo LUTs",
    price: 25.99,
    linkId: "photo-lut-pack",
    blurb: "One consistent grade for portraits, events and editorial sets.",
    description:
      "The looks we use to finish portrait, senior and editorial sets. Apply one across a gallery and every frame reads like it came from the same day.",
    details: [
      "Instant digital download",
      "Made for portraits, events and editorial stills",
      "Works in any photo app that supports LUTs",
      "Re-download anytime from your account",
    ],
    checkoutNote: "Instant download after checkout. Your files stay in your account.",
    cutout: "/img/cutouts/photo-lut-pack.png",
    cutoutRatio: 392 / 776,
    shelfScale: 1,
    images: [
      { src: "/img/products/photo-lut-pack/box-midnight.jpg", alt: "830 Productions Photo LUT Box on a midnight background" },
      { src: "/img/products/photo-lut-pack/box-ice.jpg", alt: "830 Productions Photo LUT Box on a light background" },
    ],
  },
  {
    slug: "crewneck-sweatshirt",
    name: "830 Crewneck Sweatshirt",
    short: "Crewneck",
    category: "merch",
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
];

export const PRODUCTS = ALL_PRODUCTS.filter((p) => !p.hidden);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const colorSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const formatPrice = (price: number | null) => (typeof price === "number" ? `$${price.toFixed(2)}` : "Coming soon");

export const imagesFor = (p: Product, color?: ProductColor | null) => (color ? color.images : p.images);

export const cutoutFor = (p: Product, color?: ProductColor | null) => color?.cutout ?? p.cutout;

/** The Stripe Payment Link for a product (and color), or "" when it can't be bought right now. */
export function checkoutUrlFor(p: Product, color?: ProductColor | null) {
  const url = (STRIPE_PAYMENT_LINKS[color?.linkId ?? p.linkId] ?? "").trim();
  return p.price !== null && url.startsWith("https://") ? url : "";
}
