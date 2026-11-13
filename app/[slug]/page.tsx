import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopHome } from "@/components/site/shop-home";
import { PRODUCTS, formatPrice, getProduct, imagesFor } from "@/lib/products";

// Every product page is built ahead of time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const title = `${p.name} | 830 Productions Shop`;
  const description = `${p.blurb} ${formatPrice(p.price)}.`;
  const image = imagesFor(p, p.colors?.[0])[0]?.src;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title, description, url: `/${p.slug}`, images: image ? [image] : undefined },
  };
}

export default async function ProductRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  if (!getProduct(slug)) notFound();
  return <ShopHome initialSlug={slug} />;
}
