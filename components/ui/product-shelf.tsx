/**
 * Product Shelf, adapted for the 830 Productions Shop from the Product Shelf by Aakash Mehra.
 *
 * Floating shelves on an Ice wall with every product standing on them as a cut-out photo. Click
 * one and it moves from its place on the shelf to the left of its product page, standing on a
 * white plinth. The page has the name, price, colors, a gallery of the real photos and a Buy
 * button that sends signed-in buyers to the product's Stripe Payment Link. Back, Escape or the
 * browser's back button returns the product to the same spot on the shelf.
 *
 * Each product also has its own address (/desk-mat and so on). Opening one updates the URL, and
 * loading that URL directly opens the shelf with the product already out.
 *
 * Motion follows Apple's fluid-interface rules: critically damped springs, symmetric enter and
 * exit, and no movement under prefers-reduced-motion.
 */
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/firebase";
import {
  checkoutUrlFor,
  colorSlug,
  cutoutFor,
  formatPrice,
  imagesFor,
  type Product,
  type ProductColor,
} from "@/lib/products";

const SPRING = { type: "spring" as const, bounce: 0, duration: 0.55 };
const SHOP_TITLE = "830 Productions Shop";
const SHELVES: { category: Product["category"]; label: string; title: string }[] = [
  { category: "digital", label: "Digital", title: "LUT packs" },
  { category: "merch", label: "Merch", title: "Worn on set" },
];

export type ProductShelfProps = {
  products: Product[];
  /** Open this product on load (its own page, e.g. /desk-mat). */
  initialSlug?: string;
  className?: string;
};

const slugFromPath = (path: string) => path.replace(/^\/+/, "").replace(/\.html$/, "").replace(/\/$/, "");

export function ProductShelf({ products, initialSlug, className }: ProductShelfProps) {
  const [openSlug, setOpenSlug] = useState(initialSlug ?? null);
  const [colors, setColors] = useState<Record<string, number>>({});
  // True when we pushed the product's URL ourselves, so closing can simply go back.
  const pushed = useRef(false);
  const open = products.find((p) => p.slug === openSlug) ?? null;

  const colorOf = (p: Product) => (p.colors ? p.colors[colors[p.slug] ?? 0] : null);

  // A direct link can name a color: /crewneck-sweatshirt?color=sand
  useEffect(() => {
    if (!initialSlug) return;
    const p = products.find((x) => x.slug === initialSlug);
    const wanted = new URLSearchParams(window.location.search).get("color");
    const i = p?.colors?.findIndex((c) => colorSlug(c.name) === wanted) ?? -1;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once on load
    if (p && i > 0) setColors((m) => ({ ...m, [p.slug]: i }));
  }, [initialSlug, products]);

  const openProduct = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    const c = p?.colors ? p.colors[colors[slug] ?? 0] : null;
    window.history.pushState(null, "", `/${slug}${c && (colors[slug] ?? 0) > 0 ? `?color=${colorSlug(c.name)}` : ""}`);
    pushed.current = true;
    setOpenSlug(slug);
  };

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // popstate below closes the page
    } else {
      window.history.replaceState(null, "", "/");
      setOpenSlug(null);
    }
  }, []);

  // Browser back and forward move between the shelf and the product pages.
  useEffect(() => {
    const onPop = () => {
      const slug = slugFromPath(window.location.pathname);
      setOpenSlug(products.some((p) => p.slug === slug) ? slug : null);
      if (!slug) pushed.current = false;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [products]);

  useEffect(() => {
    document.title = open ? `${open.name} | ${SHOP_TITLE}` : SHOP_TITLE;
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const pickColor = (p: Product, i: number) => {
    setColors((m) => ({ ...m, [p.slug]: i }));
    const c = p.colors?.[i];
    if (c) window.history.replaceState(window.history.state, "", `/${p.slug}${i > 0 ? `?color=${colorSlug(c.name)}` : ""}`);
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className={cn("relative w-full", className)}>
          {SHELVES.map((shelf) => {
            const row = products.filter((p) => p.category === shelf.category);
            if (!row.length) return null;
            return (
              <section key={shelf.category} aria-labelledby={`shelf-${shelf.category}`} className="relative mb-16 last:mb-0 sm:mb-20">
                <h2 id={`shelf-${shelf.category}`} className="mb-6 flex items-baseline gap-3 px-1">
                  <span className="label text-studio">{shelf.label}</span>
                  <span className="font-sans text-[22px] font-light tracking-[-0.01em] text-midnight sm:text-[26px]">{shelf.title}</span>
                </h2>
                <div className="relative z-10 flex h-[clamp(150px,28vw,260px)] items-end justify-center gap-4 px-2 sm:gap-14 sm:px-10">
                  {row.map((p) => (
                    <div key={p.slug} className="flex h-full w-[30%] max-w-[240px] items-end justify-center">
                      {openSlug === p.slug ? (
                        <div style={{ height: `${(p.shelfScale ?? 1) * 100}%`, aspectRatio: p.cutoutRatio }} />
                      ) : (
                        <motion.button
                          layoutId={`product-${p.slug}`}
                          type="button"
                          onClick={() => openProduct(p.slug)}
                          aria-label={`${p.name}, ${formatPrice(p.price)}`}
                          transition={SPRING}
                          whileHover={{ y: -4 }}
                          className="relative max-w-[min(100%+2rem,240px)] shrink-0 cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-studio focus-visible:ring-offset-4 focus-visible:ring-offset-ice"
                          style={{ height: `${(p.shelfScale ?? 1) * 100}%`, aspectRatio: p.cutoutRatio }}
                        >
                          <Cutout p={p} color={colorOf(p)} lazy={shelf.category !== "digital"} />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
                <Shelf />
                <div className="mt-5 flex justify-center gap-4 px-2 sm:gap-14 sm:px-10">
                  {row.map((p) => (
                    <div key={p.slug} className="w-[30%] max-w-[240px] text-center">
                      <button
                        type="button"
                        onClick={() => openProduct(p.slug)}
                        tabIndex={-1}
                        className="font-sans text-[14px] leading-tight font-medium text-midnight sm:text-[16px]"
                      >
                        {p.short}
                      </button>
                      <div className={cn("mt-1 text-[15px] tabular-nums sm:text-[17px]", p.price === null ? "text-steel italic" : "text-studio")}>
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <ProductPage
              key={open.slug}
              p={open}
              color={colorOf(open)}
              colorIndex={colors[open.slug] ?? 0}
              onColor={(i) => pickColor(open, i)}
              onClose={close}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}

/** The product photo, cut out, with a contact shadow where it stands. */
function Cutout({ p, color, lazy, priority }: { p: Product; color: ProductColor | null; lazy?: boolean; priority?: boolean }) {
  return (
    <>
      <span aria-hidden className="absolute -bottom-[3%] left-[8%] h-[7%] w-[84%] rounded-[50%] bg-midnight/30 blur-[6px]" />
      <span aria-hidden className="absolute -bottom-[0.6%] left-[18%] h-[1.6%] w-[64%] rounded-[50%] bg-midnight/40 blur-[1.5px]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cutoutFor(p, color)}
        alt=""
        draggable={false}
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={priority ? "high" : undefined}
        className="pointer-events-none relative size-full object-contain object-bottom select-none"
      />
    </>
  );
}

/** Floating white shelf: lit top, crisp front edge, soft shadow on the Ice wall. */
function Shelf() {
  return (
    <div aria-hidden className="relative -mt-[4px] h-[16px]">
      <div className="absolute inset-x-0 top-0 h-[8px] bg-[linear-gradient(to_bottom,#dde9f2,#fbfdff)]" />
      <div className="absolute inset-x-0 top-[8px] h-[8px] bg-[linear-gradient(to_bottom,#ffffff,#e4eef5)] shadow-[0_1px_0_rgba(3,31,51,0.06)]" />
      <div className="absolute inset-x-[2%] top-[16px] h-[38px] bg-[radial-gradient(50%_100%_at_50%_0%,rgba(3,31,51,0.16),transparent)]" />
    </div>
  );
}

function ProductPage({
  p,
  color,
  colorIndex,
  onColor,
  onClose,
}: {
  p: Product;
  color: ProductColor | null;
  colorIndex: number;
  onColor: (i: number) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [section, setSection] = useState<string | null>("Details");
  const [photo, setPhoto] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const photos = imagesFor(p, color);
  const checkoutUrl = checkoutUrlFor(p, color);
  // Small items are drawn smaller on the shelf; on their page they all get to be big.
  const heroVh = p.category === "digital" ? 60 : 46;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (photo !== null) setPhoto(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, onClose]);

  const buy = async () => {
    if (!checkoutUrl) return;
    setPending(true);
    const user = await currentUser();
    const here = window.location.pathname + window.location.search;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(here)}`);
      return;
    }
    // Attach the buyer's account so the order webhook can file the purchase under it.
    const url = new URL(checkoutUrl);
    url.searchParams.set("client_reference_id", user.uid);
    if (user.email) url.searchParams.set("prefilled_email", user.email);
    window.location.href = url.toString();
  };

  const sections: [string, ReactNode][] = [
    [
      "Details",
      <ul key="d" className="list-disc space-y-1 pl-5 marker:text-steel">
        {p.details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>,
    ],
    [
      "Checkout",
      <p key="c">
        {p.checkoutNote} Payment is handled by Stripe, your receipt lands in your inbox as soon as it clears, and the order is saved to
        your account.
      </p>,
    ],
    ...(p.category === "digital"
      ? ([
          [
            "Try before you buy",
            <p key="t">
              Compare the looks side by side on your own footage with{" "}
              <a href="https://830prod.github.io/LUTviewer/" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                LUTviewer
              </a>
              , our free Mac app.
            </p>,
          ],
        ] as [string, ReactNode][])
      : []),
  ];

  const unavailable = p.price === null ? "Coming soon" : "Out of Stock";

  return (
    <motion.div role="dialog" aria-modal="true" aria-labelledby={`title-${p.slug}`} className="fixed inset-x-0 top-[72px] bottom-0 z-20 overflow-y-auto overscroll-contain">
      <motion.div
        className="fixed inset-x-0 top-[72px] bottom-0 bg-ice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Phones: product, then the buying details, then photos. Wider: product and photos on the left. */}
      <div className="relative mx-auto grid min-h-full max-w-[1180px] grid-cols-1 content-center gap-x-14 gap-y-10 px-4 pt-8 pb-16 sm:px-8 md:grid-cols-[1.05fr_1fr] md:pt-10">
        {/* the product, moved over from the shelf, standing on a white plinth */}
        <div className="relative flex flex-col items-center justify-end md:col-start-1 md:row-start-1">
          <button
            type="button"
            onClick={onClose}
            tabIndex={-1}
            aria-hidden
            className="absolute -top-3 -left-1.5 z-20 inline-flex items-center gap-0.5 rounded-sm px-1.5 py-1 font-sans text-[15px] font-medium text-midnight md:hidden"
          >
            <ChevronLeft className="size-4" strokeWidth={2.2} /> Shelf
          </button>
          <div
            className="flex h-[min(40vh,340px)] w-full items-end justify-center md:h-(--hero)"
            style={{ "--hero": `min(${heroVh}vh, 520px)` } as React.CSSProperties}
          >
            <motion.div
              layoutId={`product-${p.slug}`}
              transition={SPRING}
              className="relative z-10 max-h-full max-w-[min(100%,560px)]"
              style={{ aspectRatio: p.cutoutRatio, height: p.cutoutRatio > 1.4 ? "auto" : "100%", width: p.cutoutRatio > 1.4 ? "100%" : "auto" }}
            >
              <Cutout p={p} color={color} priority />
            </motion.div>
          </div>
          <motion.div
            aria-hidden
            className="relative -mt-[6px] h-[18px] w-[86%] max-w-[520px] rounded-[2px] bg-[linear-gradient(to_bottom,#ffffff,#e4eef5)] shadow-[0_18px_40px_-12px_rgba(3,31,51,0.25)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="relative z-20 text-midnight md:col-start-2 md:row-span-2 md:row-start-1 md:self-center"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-ml-1.5 mb-6 inline-flex items-center gap-0.5 rounded-sm px-1.5 py-1 font-sans text-[15px] font-medium text-midnight underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-studio"
          >
            <ChevronLeft className="size-4" strokeWidth={2.2} /> Shelf
          </button>
          <span className="label block text-studio">{p.tag}</span>
          <h2 id={`title-${p.slug}`} className="mt-3 font-sans text-[clamp(34px,4.2vw,52px)] leading-[1.04] font-light tracking-[-0.02em]">
            {p.name}
          </h2>
          <p className="mt-3 text-[21px] leading-snug text-studio">{p.blurb}</p>

          <div className={cn("mt-6 font-sans text-[28px] font-medium tabular-nums", p.price === null && "text-steel")}>{formatPrice(p.price)}</div>
          <p className="mt-4 max-w-[52ch] text-[19px] leading-[1.55] text-midnight/85">{p.description}</p>

          {p.colors && color && (
            <fieldset className="mt-8">
              <legend className="mb-3 font-sans text-[16px]">
                <span className="font-semibold">Color</span> <span className="text-studio">{color.name}</span>
              </legend>
              <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-3">
                {p.colors.map((c, i) => {
                  const on = i === colorIndex;
                  return (
                    <button
                      key={c.name}
                      ref={(el) => {
                        swatchRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={c.name}
                      title={c.name}
                      tabIndex={on ? 0 : -1}
                      onClick={() => onColor(i)}
                      onKeyDown={(e) => {
                        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
                        if (!step || !p.colors) return;
                        e.preventDefault();
                        const next = (i + step + p.colors.length) % p.colors.length;
                        onColor(next);
                        swatchRefs.current[next]?.focus();
                      }}
                      className={cn(
                        "size-10 rounded-full ring-offset-[3px] ring-offset-ice transition-shadow focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-studio",
                        on ? "ring-2 ring-midnight" : "ring-1 ring-studio/30 hover:ring-studio",
                      )}
                      style={{ background: c.swatch }}
                    />
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={buy}
              disabled={!checkoutUrl || pending}
              className="h-14 w-full rounded-[2px] bg-midnight font-sans text-[17px] font-medium text-white transition-[background-color,transform] duration-100 hover:bg-harbor active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio disabled:cursor-not-allowed disabled:bg-steel/50 disabled:active:scale-100"
            >
              <span aria-live="polite">{!checkoutUrl ? unavailable : pending ? "Opening checkout…" : `Buy now · ${formatPrice(p.price)}`}</span>
            </button>
            <p className="mt-3 text-[16px] text-studio">
              {checkoutUrl
                ? p.checkoutNote
                : p.price === null
                  ? "This one isn't on sale yet. Check back soon."
                  : "This one is sold out right now. Check back soon."}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-[13px] text-steel">
              <Lock className="size-3.5" strokeWidth={1.8} /> Secure checkout by Stripe
            </span>
          </div>

          <div className="mt-8 border-t border-studio/20">
            {sections.map(([title, body]) => {
              const isOpen = section === title;
              return (
                <div key={title} className="border-b border-studio/20">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setSection(isOpen ? null : title)}
                    className="flex w-full items-center justify-between py-4 text-left font-sans text-[17px] font-medium focus-visible:outline-2 focus-visible:outline-studio"
                  >
                    {title}
                    <ChevronDown className={cn("size-[18px] text-studio transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={SPRING}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 text-[17px] leading-relaxed text-midnight/80">{body}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {photos.length > 0 && (
          <div className="flex justify-center md:col-start-1 md:row-start-2 md:items-start">
            <motion.div
              className="w-full max-w-[520px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ ...SPRING, delay: 0.08 }}
            >
              <span className="label text-studio">Photos</span>
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {photos.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={`Open photo ${i + 1} of ${photos.length}: ${img.alt}`}
                    className="aspect-square overflow-hidden rounded-[2px] bg-white ring-1 ring-studio/15 transition-shadow hover:ring-studio/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt="" loading="lazy" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {photo !== null && photos[photo] && (
          <Lightbox images={photos} index={photo} onIndex={setPhoto} onClose={() => setPhoto(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: { src: string; alt: string }[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const many = images.length > 1;
  const go = (step: number) => onIndex((index + step + images.length) % images.length);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const nav = "grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-haze";
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
      className="fixed inset-0 z-40 flex flex-col bg-midnight/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-4 py-3 text-haze">
        <span className="font-sans text-[14px] tabular-nums">{many ? `${index + 1} / ${images.length}` : ""}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo" className={nav}>
          <X className="size-5" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-3 px-3 pb-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {many && (
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={cn(nav, "hidden shrink-0 sm:grid")}>
            <ChevronLeft className="size-5" />
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={images[index].src} src={images[index].src} alt={images[index].alt} className="max-h-full min-h-0 max-w-full rounded-[2px] object-contain" />
        {many && (
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className={cn(nav, "hidden shrink-0 sm:grid")}>
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
      {many && (
        <div className="flex justify-center gap-4 pb-6 sm:hidden">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={nav}>
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className={nav}>
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
