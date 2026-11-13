"use client";

import Link from "next/link";
import { useUser } from "@/lib/firebase";

/** Stripe bar (4px) plus the bar itself (68px). The product page sits right under it. */
export const HEADER_HEIGHT = 72;

export function StripeBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`grid h-1 grid-cols-4 ${className}`}>
      <span className="bg-harbor" />
      <span className="bg-studio" />
      <span className="bg-steel" />
      <span className="bg-haze" />
    </div>
  );
}

export function SiteHeader() {
  const user = useUser();
  return (
    <header className="sticky top-0 z-30 bg-midnight text-white" style={{ height: HEADER_HEIGHT }}>
      <StripeBar />
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" aria-label="830 Productions Shop home" className="flex items-center gap-3 sm:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/brand/lockup-white.svg" alt="830 Productions" width={72} height={42} className="h-[42px] w-auto" />
          <span className="label border-l border-haze/25 pl-3 text-haze sm:pl-4">Shop</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 font-sans text-[15px] sm:gap-2">
          <a href="https://830productions.com" className="hidden rounded px-3 py-2 text-haze transition-colors hover:text-white sm:inline-block">
            Studio <span aria-hidden>↗</span>
          </a>
          <Link
            href={user ? "/account" : "/login"}
            className="rounded-[2px] bg-ice px-4 py-2 font-medium text-midnight transition-colors hover:bg-white"
          >
            {user ? "Account" : "Log In"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
