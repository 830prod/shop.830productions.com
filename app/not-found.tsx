import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";

export default function NotFound() {
  return (
    <AuthShell>
      <span className="label text-studio">Shop</span>
      <h1 className="mt-4 font-sans text-[clamp(36px,4.4vw,56px)] leading-[1.04] font-light tracking-[-0.02em]">We couldn&apos;t find that page.</h1>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-[2px] bg-midnight px-6 font-sans font-medium text-white hover:bg-harbor">
        Back to the shop
      </Link>
    </AuthShell>
  );
}
