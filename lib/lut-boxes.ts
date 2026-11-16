// The LUT boxes. Generated from the box folders (names and LUT lists) and the box covers (taglines).
// lib/products.ts turns each entry into a product on the shelf.

export type LutBox = {
  number: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  count: number;
  /** The LUTs inside. The Complete box is sorted into named folders. */
  groups: { group?: string; names: string[] }[];
};

export const LUT_BOXES: LutBox[] = [
  {
    "number": "01",
    "slug": "wedding-and-romance-lut-box",
    "name": "Wedding & Romance",
    "tagline": "Soft, warm and true to the day.",
    "description": "Gentle warmth, clean skin tones and a soft roll-off for ceremonies, portraits and reception films.",
    "groups": [
      {
        "names": [
          "Black Fade",
          "Clean",
          "Clean V02",
          "Creamy",
          "Film",
          "Gold Look",
          "Influencer",
          "Matte Moody 02",
          "Nem Cinema 02",
          "Nem Cinema 08",
          "New Collection 09",
          "Rose Moody",
          "Rose gold",
          "Summer"
        ]
      }
    ],
    "count": 14
  },
  {
    "number": "02",
    "slug": "vlog-and-creator-lut-box",
    "name": "Vlog & Creator",
    "tagline": "Clean, bright looks for talking to camera.",
    "description": "Bright, clean grades that flatter faces and hold up across lifestyle, food and talking-head footage.",
    "groups": [
      {
        "names": [
          "Basic",
          "Beach Style",
          "Blogger",
          "Clean",
          "Clean V02",
          "Food 01",
          "Food 02",
          "Influencer",
          "Insta Look",
          "Lifestyle",
          "New Vibes 01",
          "New Vibes 02"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "03",
    "slug": "cinematic-film-lut-box",
    "name": "Cinematic Film",
    "tagline": "Teal, gold and deep contrast.",
    "description": "Big-screen contrast with teal shadows and golden highlights for brand films, trailers and music videos.",
    "groups": [
      {
        "names": [
          "Cinematic Blue",
          "Cinematic Gold",
          "Cinematic Gold 02",
          "Film",
          "Film 02",
          "New Cinematic 01",
          "New Cinematic 02",
          "New Cinematic 03",
          "New Cinematic 04",
          "New Cinematic 05",
          "New Cinematic 06",
          "New Cinematic 07",
          "New Cinematic 08",
          "New Cinematic 09",
          "New Cinematic 10",
          "Orange and Blue",
          "Orange and Blue 02"
        ]
      }
    ],
    "count": 17
  },
  {
    "number": "04",
    "slug": "soft-cinema-lut-box",
    "name": "Soft Cinema",
    "tagline": "Gentle film tones. Nothing shouts.",
    "description": "Low-contrast film tones for documentaries, interviews and quiet narrative work.",
    "groups": [
      {
        "names": [
          "Nem Cinema 01",
          "Nem Cinema 02",
          "Nem Cinema 03",
          "Nem Cinema 04",
          "Nem Cinema 05",
          "Nem Cinema 06",
          "Nem Cinema 07",
          "Nem Cinema 08",
          "Nem Cinema 09",
          "Nem Orange"
        ]
      }
    ],
    "count": 10
  },
  {
    "number": "05",
    "slug": "dark-and-moody-lut-box",
    "name": "Dark & Moody",
    "tagline": "Deep shadows, held colour.",
    "description": "Rich shadows that keep their colour, for dramatic portraits, forests and low-light scenes.",
    "groups": [
      {
        "names": [
          "Dark Aesthetic 01",
          "Dark Green 02",
          "Dark Green 03",
          "Dark Moody 01",
          "Dark Moody 02",
          "Dark Moody 03",
          "Gray Moody",
          "Matte Moody 01",
          "Matte Moody 02",
          "Moody",
          "Rose Moody"
        ]
      }
    ],
    "count": 11
  },
  {
    "number": "06",
    "slug": "moody-tones-lut-box",
    "name": "Moody Tones",
    "tagline": "Ten shades of atmosphere.",
    "description": "Ten variations on a moody grade, from subtle to heavy, so you can match the mood shot by shot.",
    "groups": [
      {
        "names": [
          "New Moody 01",
          "New Moody 02",
          "New Moody 03",
          "New Moody 04",
          "New Moody 05",
          "New Moody 06",
          "New Moody 07",
          "New Moody 08",
          "New Moody 09",
          "New Moody 10"
        ]
      }
    ],
    "count": 10
  },
  {
    "number": "07",
    "slug": "travel-and-outdoors-lut-box",
    "name": "Travel & Outdoors",
    "tagline": "Sun, green and open sky.",
    "description": "Looks for beaches, deserts, jungles and long roads, with lively greens and warm sun.",
    "groups": [
      {
        "names": [
          "Beach Style",
          "Dark Green",
          "Desert",
          "Desert 02",
          "Jungle",
          "Nature",
          "New Nature",
          "Orange and Blue",
          "Summer",
          "Summer 02",
          "Travel",
          "Travel 02"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "08",
    "slug": "urban-and-night-lut-box",
    "name": "Urban & Night",
    "tagline": "Streetlight, neon and concrete.",
    "description": "City grades for night streets, neon signs and concrete, from cool blues to gritty daylight.",
    "groups": [
      {
        "names": [
          "Black Urban",
          "Blue Light",
          "Cinematic Blue",
          "Dark Aesthetic 01",
          "Futurism",
          "Night CIty 02",
          "Night CIty 03",
          "Night CIty 04",
          "Night City",
          "Old Street",
          "Toxic Green",
          "Urban"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "09",
    "slug": "noir-and-faded-lut-box",
    "name": "Noir & Faded",
    "tagline": "Colour pulled back. Shape left in.",
    "description": "Black-and-white and faded looks that put light and shape first.",
    "groups": [
      {
        "names": [
          "Black",
          "Black 02",
          "Black Fade",
          "Black Fade 02",
          "Black Urban",
          "Dark Moody 03",
          "Gold Look",
          "Gray",
          "Gray Moody"
        ]
      }
    ],
    "count": 9
  },
  {
    "number": "10",
    "slug": "cold-and-winter-lut-box",
    "name": "Cold & Winter",
    "tagline": "Blue hours and clean air.",
    "description": "Cool, crisp grades for snow, blue hour and overcast days.",
    "groups": [
      {
        "names": [
          "Basic",
          "Blue Light",
          "Cinematic Blue",
          "Cold 01",
          "Cold 02",
          "Cold 03",
          "Cold 04",
          "Cold 05",
          "Dark Aesthetic 01",
          "Futurism",
          "New Collection 10",
          "Night CIty 04"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "11",
    "slug": "warm-and-golden-hour-lut-box",
    "name": "Warm & Golden Hour",
    "tagline": "The last light of the day.",
    "description": "Warm, glowing grades that stretch golden hour across the whole shoot.",
    "groups": [
      {
        "names": [
          "Cinematic Gold",
          "Desert 02",
          "Film",
          "Gold Look",
          "New Cinematic 01",
          "New Cinematic 04",
          "New Cinematic 09",
          "New Collection 04",
          "New Collection 05",
          "Red Tones",
          "Summer",
          "Summer 02",
          "Travel"
        ]
      }
    ],
    "count": 13
  },
  {
    "number": "12",
    "slug": "real-estate-and-clean-commercial-lut-box",
    "name": "Real Estate & Clean Commercial",
    "tagline": "Honest whites. True rooms.",
    "description": "Neutral, bright looks that keep whites white for property tours, products and corporate work.",
    "groups": [
      {
        "names": [
          "Basic",
          "Beach Style",
          "Clean",
          "Clean V02",
          "Colors 02",
          "Food 01",
          "Influencer",
          "Insta Look",
          "Lifestyle",
          "New Vibes 02"
        ]
      }
    ],
    "count": 10
  },
  {
    "number": "13",
    "slug": "color-pop-lut-box",
    "name": "Color Pop",
    "tagline": "Colour, turned up.",
    "description": "Saturated, punchy grades for social cuts, food and anything that needs to stop the scroll.",
    "groups": [
      {
        "names": [
          "Blogger",
          "Colors",
          "Colors 02",
          "Food 01",
          "Nem Orange",
          "New Cinematic 08",
          "New Cinematic 09",
          "New Cinematic 10",
          "New Vibes 01",
          "Orange and Blue",
          "Red Tones",
          "Vintage"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "14",
    "slug": "everyday-collection-lut-box",
    "name": "Everyday Collection",
    "tagline": "Eight looks you'll reach for.",
    "description": "Eight versatile, do-anything grades for the footage that doesn't fit a category.",
    "groups": [
      {
        "names": [
          "New Collection 01",
          "New Collection 02",
          "New Collection 04",
          "New Collection 05",
          "New Collection 06",
          "New Collection 07",
          "New Collection 09",
          "New Collection 10"
        ]
      }
    ],
    "count": 8
  },
  {
    "number": "15",
    "slug": "mix-and-match-starter-lut-box",
    "name": "Mix & Match Starter",
    "tagline": "One from every shelf.",
    "description": "A sampler with one look from every box. A good first box if you want to try the range.",
    "groups": [
      {
        "names": [
          "Black Fade",
          "Blogger",
          "Cinematic Gold",
          "Cold 03",
          "Colors 02",
          "Creamy",
          "Dark Moody 01",
          "Nem Cinema 05",
          "New Cinematic 02",
          "New Moody 03",
          "Night City",
          "Travel"
        ]
      }
    ],
    "count": 12
  },
  {
    "number": "16",
    "slug": "complete-lut-box",
    "name": "The Complete LUT Box",
    "tagline": "Every look. One box.",
    "description": "The full set: every look we make, sorted into nine folders from Cinematic to Noir. One download covers weddings, travel, city nights and everything in between.",
    "groups": [
      {
        "group": "Cinematic",
        "names": [
          "Cinematic Blue",
          "Cinematic Gold",
          "Cinematic Gold 02",
          "Film",
          "Film 02",
          "New Cinematic 01",
          "New Cinematic 02",
          "New Cinematic 03",
          "New Cinematic 04",
          "New Cinematic 05",
          "New Cinematic 06",
          "New Cinematic 07",
          "New Cinematic 08",
          "New Cinematic 09",
          "New Cinematic 10",
          "Orange and Blue",
          "Orange and Blue 02"
        ]
      },
      {
        "group": "Soft Cinema",
        "names": [
          "Nem Cinema 01",
          "Nem Cinema 02",
          "Nem Cinema 03",
          "Nem Cinema 04",
          "Nem Cinema 05",
          "Nem Cinema 06",
          "Nem Cinema 07",
          "Nem Cinema 08",
          "Nem Cinema 09",
          "Nem Orange"
        ]
      },
      {
        "group": "Dark & Moody",
        "names": [
          "Dark Aesthetic 01",
          "Dark Moody 01",
          "Dark Moody 02",
          "Dark Moody 03",
          "Gray Moody",
          "Matte Moody 01",
          "Matte Moody 02",
          "Moody",
          "New Moody 01",
          "New Moody 02",
          "New Moody 03",
          "New Moody 04",
          "New Moody 05",
          "New Moody 06",
          "New Moody 07",
          "New Moody 08",
          "New Moody 09",
          "New Moody 10",
          "Rose Moody"
        ]
      },
      {
        "group": "Lifestyle, Vlog & Soft Tones",
        "names": [
          "Basic",
          "Blogger",
          "Clean",
          "Clean V02",
          "Creamy",
          "Food 01",
          "Food 02",
          "Gold Look",
          "Influencer",
          "Insta Look",
          "Lifestyle",
          "New Vibes 01",
          "New Vibes 02",
          "Rose gold"
        ]
      },
      {
        "group": "Travel & Nature",
        "names": [
          "Beach Style",
          "Dark Green",
          "Dark Green 02",
          "Dark Green 03",
          "Desert",
          "Desert 02",
          "Jungle",
          "Nature",
          "New Nature",
          "Summer",
          "Summer 02",
          "Toxic Green",
          "Travel",
          "Travel 02"
        ]
      },
      {
        "group": "Urban & Night",
        "names": [
          "Blue Light",
          "Futurism",
          "Night CIty 02",
          "Night CIty 03",
          "Night CIty 04",
          "Night City",
          "Old Street",
          "Urban"
        ]
      },
      {
        "group": "Cold & Winter",
        "names": [
          "Cold 01",
          "Cold 02",
          "Cold 03",
          "Cold 04",
          "Cold 05"
        ]
      },
      {
        "group": "Noir & Faded",
        "names": [
          "Black",
          "Black 02",
          "Black Fade",
          "Black Fade 02",
          "Black Urban",
          "Gray"
        ]
      },
      {
        "group": "Color & Everyday",
        "names": [
          "Colors",
          "Colors 02",
          "New Collection 01",
          "New Collection 02",
          "New Collection 04",
          "New Collection 05",
          "New Collection 06",
          "New Collection 07",
          "New Collection 09",
          "New Collection 10",
          "Red Tones",
          "Vintage"
        ]
      }
    ],
    "count": 105
  }
];
