import type { Metadata, Viewport } from "next";
import { Crimson_Pro, Jost } from "next/font/google";
import "./globals.css";

// Web stand-ins for the brand faces (Futura and Minion Pro), which load from the Adobe Fonts kit below.
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const crimson = Crimson_Pro({ variable: "--font-crimson", subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"] });

const description = "LUT packs and merch from 830 Productions. Built from the looks we use on real jobs, with secure Stripe checkout.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.830productions.com"),
  title: "830 Productions Shop",
  description,
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "830 Productions Shop",
    description,
    type: "website",
    url: "/",
    images: ["/img/products/video-lut-pack/box-midnight.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#031F33" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} ${crimson.variable} antialiased`}>
      <head>
        {/* Adobe Fonts kit for futura-pt and minion-pro */}
        <link rel="stylesheet" href="https://use.typekit.net/ney4fwq.css" />
      </head>
      <body className="min-h-dvh bg-midnight text-[19px] leading-[1.55]">
        <a
          href="#main"
          className="absolute -top-16 left-4 z-50 bg-ice px-4 py-2.5 font-sans font-medium text-midnight focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
