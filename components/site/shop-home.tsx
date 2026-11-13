import { ProductShelf } from "@/components/ui/product-shelf";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { PRODUCTS } from "@/lib/products";

const POINTS = [
  ["01", "Secure checkout", "Every order goes through a Stripe-hosted checkout. Your receipt lands in your inbox as soon as payment clears."],
  ["02", "Your orders, saved", "Sign in once and every purchase shows up in your account, with LUT downloads ready to grab again."],
  ["03", "Try before you buy", "Compare LUTs side by side with LUTviewer, our free Mac app."],
] as const;

/** The shop: the shelf wall, with `initialSlug`'s product page already open when given. */
export function ShopHome({ initialSlug }: { initialSlug?: string }) {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="bg-[linear-gradient(to_bottom,#e7f4fd,#dcecf8)] pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="mx-auto max-w-[1080px] px-4 sm:px-8">
            <div className="mb-14 max-w-[40rem] sm:mb-20">
              <span className="label text-studio">830 Shop</span>
              <h1 className="mt-4 font-sans text-[clamp(44px,7vw,84px)] leading-[0.98] font-light tracking-[-0.025em] text-midnight">
                Our grade, in your edit.
              </h1>
              <p className="mt-5 text-[clamp(19px,1.5vw+10px,23px)] leading-normal text-studio">
                LUTs from our own color pipeline and the merch our crew wears on set. Pick something off the shelf.
              </p>
            </div>
            <ProductShelf products={PRODUCTS} initialSlug={initialSlug} />
          </div>
        </section>

        <section className="bg-harbor py-16 text-white sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 sm:grid-cols-3 sm:px-8">
            {POINTS.map(([num, title, body]) => (
              <div key={num} className="border-t border-haze/25 pt-6">
                <span className="font-sans text-[14px] font-medium tracking-[0.2em] text-haze">{num}</span>
                <h3 className="mt-3 font-sans text-[24px] font-normal">{title}</h3>
                <p className="mt-2 text-[18px] leading-relaxed text-haze">
                  {num === "03" ? (
                    <>
                      Compare LUTs side by side with{" "}
                      <a href="https://830prod.github.io/LUTviewer/" target="_blank" rel="noreferrer" className="text-white underline underline-offset-4">
                        LUTviewer
                      </a>
                      , our free Mac app.
                    </>
                  ) : (
                    body
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
