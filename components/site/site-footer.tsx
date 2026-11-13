import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-haze/20 bg-midnight pt-16 pb-8 text-white sm:pt-24">
      {/* reel watermark: oversized, cropped off the edge, one step lighter (Harbor) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/brand/reel-harbor.svg" alt="" aria-hidden className="pointer-events-none absolute -right-[12%] -bottom-[38%] -z-10 w-[min(620px,80vw)]" />
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/brand/lockup-white.svg" alt="830 Productions" width={150} height={88} />
            <p className="mt-4 text-haze">Every frame, on brand.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-[17px] sm:grid-cols-3">
            <FooterCol title="Shop">
              <Link href="/">All products</Link>
              <Link href="/video-lut-pack">Video LUTs</Link>
              <Link href="/photo-lut-pack">Photo LUTs</Link>
              <Link href="/crewneck-sweatshirt">Merch</Link>
            </FooterCol>
            <FooterCol title="Account">
              <Link href="/login">Log In</Link>
              <Link href="/account">Orders</Link>
            </FooterCol>
            <FooterCol title="Studio">
              <a href="https://830productions.com">830productions.com</a>
              <a href="https://830productions.com/book.html">Book a project</a>
              <a href="mailto:830productions@gmail.com" className="break-all">830productions@gmail.com</a>
              <a href="https://www.instagram.com/830_productions" target="_blank" rel="noreferrer">
                Instagram <span aria-hidden>↗</span>
              </a>
            </FooterCol>
          </nav>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-2 border-t border-haze/20 pt-6 text-[15px] text-haze">
          <p>© {new Date().getFullYear()} 830 Productions</p>
          <p>Secure checkout by Stripe</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label text-haze">{title}</span>
      <ul className="mt-4 space-y-2">
        {(Array.isArray(children) ? children : [children]).map((c, i) => (
          <li key={i} className="[&>a]:text-white/90 [&>a]:underline-offset-4 [&>a:hover]:underline">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
