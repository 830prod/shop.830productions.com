import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A fully static site: `next build` writes plain HTML, CSS and JS to out/, which GitHub Pages
  // (or any static host) serves. Routes export as /desk-mat.html etc., so the old .html
  // addresses keep working.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
