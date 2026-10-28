// The shop catalogue. Every page reads from this one list:
// index.html builds the product grid from it, and each product page
// (e.g. whiskey-glass.html) renders its gallery, colors and buy button from
// the entry whose `slug` matches the page's data-product attribute.
//
// To add a product: add an entry here, add its Stripe link to
// stripe-links.js under the same `linkId`, then copy any product page
// (e.g. desk-mat.html), rename it to `<slug>.html` and update its <head>
// tags and data-product.
//
// `price: null` shows "Coming soon" and keeps the buy button off.
// `hidden: true` takes a product off the site (grid, related items and its
// own page) without deleting it. Remove the flag to bring it back.
// A color can carry its own `linkId` if it has a separate Stripe link;
// otherwise every color checks out through the product's `linkId`.
window.SHOP_PRODUCTS = [
  {
    slug: "video-lut-pack",
    name: "Signature Video LUT Pack",
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
      "Re-download anytime from your account"
    ],
    checkoutNote: "Instant download after checkout. Your files stay in your account.",
    images: [
      { src: "img/products/video-lut-pack/box-midnight.jpg", alt: "830 Productions Video LUT Box on a midnight background" },
      { src: "img/products/video-lut-pack/box-ice.jpg", alt: "830 Productions Video LUT Box on a light background" }
    ]
  },
  {
    slug: "photo-lut-pack",
    name: "Signature Photo LUT Pack",
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
      "Re-download anytime from your account"
    ],
    checkoutNote: "Instant download after checkout. Your files stay in your account.",
    images: [
      { src: "img/products/photo-lut-pack/box-midnight.jpg", alt: "830 Productions Photo LUT Box on a midnight background" },
      { src: "img/products/photo-lut-pack/box-ice.jpg", alt: "830 Productions Photo LUT Box on a light background" }
    ]
  },
  {
    slug: "crewneck-sweatshirt",
    name: "830 Crewneck Sweatshirt",
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
      "Choose your size at checkout"
    ],
    checkoutNote: "Choose your color and size at checkout. Ground shipping $5.99.",
    colorLabel: "Color",
    colors: [
      { name: "Navy", swatch: "#1f2a44", images: ["navy-front", "navy-back", "navy-model", "navy-folded"] },
      { name: "Army Green", swatch: "#5b6142", images: ["army-green-front", "army-green-back", "army-green-model", "army-green-folded"] },
      { name: "Light Blue", swatch: "#7ea6dc", images: ["light-blue-front", "light-blue-back", "light-blue-model", "light-blue-folded"] },
      { name: "Sand", swatch: "#d8ccb4", images: ["sand-front", "sand-back", "sand-model", "sand-folded"] },
      { name: "Pink", swatch: "#f6d2e0", images: ["pink-front", "pink-back", "pink-model", "pink-folded"] },
      { name: "Safety Pink", swatch: "#ef6b86", images: ["safety-pink-front", "safety-pink-back", "safety-pink-model", "safety-pink-folded"] }
    ].map((color) => ({
      ...color,
      images: color.images.map((file) => ({
        src: `img/products/sweatshirt/${file}.jpg`,
        alt: `830 Crewneck Sweatshirt in ${color.name.toLowerCase()}, ${file.split("-").pop()} view`
      }))
    }))
  },
  {
    slug: "flat-bill-hat",
    name: "830 Flat Bill Hat",
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
      "830 Productions lockup on one side, US flag on the other"
    ],
    checkoutNote: "Choose your color at checkout. Ground shipping $5.99.",
    colorLabel: "Color",
    colors: [
      {
        name: "Royal Blue",
        swatch: "#1f2f8c",
        images: [
          { src: "img/products/flat-bill-hat/blue-front.jpg", alt: "830 Flat Bill Hat in royal blue, front" },
          { src: "img/products/flat-bill-hat/blue-side.jpg", alt: "830 Flat Bill Hat in royal blue, side with 830 Productions lockup" },
          { src: "img/products/flat-bill-hat/blue-flag.jpg", alt: "830 Flat Bill Hat in royal blue, side with US flag" }
        ]
      },
      {
        name: "Black",
        swatch: "#15171a",
        images: [
          { src: "img/products/flat-bill-hat/black-front.jpg", alt: "830 Flat Bill Hat in black, front" }
        ]
      }
    ]
  },
  {
    slug: "whiskey-glass",
    hidden: true,
    name: "830 Rocks Glass",
    category: "merch",
    tag: "Barware",
    price: null,
    linkId: "whiskey-glass",
    blurb: "A heavy rocks glass with the 830 Productions lockup.",
    description:
      "For the wrap drink. A heavy-bottomed rocks glass printed with the 830 Productions lockup.",
    details: [
      "Heavy-base rocks glass",
      "830 Productions lockup print"
    ],
    checkoutNote: "Shipping details are collected at checkout.",
    images: [
      { src: "img/products/whiskey-glass/bar.jpg", alt: "830 Productions rocks glass with an old fashioned on a bar" }
    ]
  },
  {
    slug: "desk-mat",
    name: "830 Stepped Stripe Desk Mat",
    category: "merch",
    tag: "Desk",
    price: 26.99,
    linkId: "desk-mat",
    blurb: "The brand's stepped stripes, sized for your whole desk.",
    description:
      "Our stepped stripes, four blues from Midnight to Haze, across a full-size desk mat. Room for a keyboard, a mouse and a coffee during the edit.",
    details: [
      "Full-size desk mat",
      "Stepped stripes in four brand blues"
    ],
    checkoutNote: "Ground shipping $5.99, added at checkout.",
    images: [
      { src: "img/products/desk-mat/desk.jpg", alt: "830 stepped stripe desk mat on a dark desk with a laptop and coffee" },
      { src: "img/products/desk-mat/table.jpg", alt: "830 stepped stripe desk mat on a wooden table" }
    ]
  }
];
