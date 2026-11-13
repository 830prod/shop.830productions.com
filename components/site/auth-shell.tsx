import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-[linear-gradient(to_bottom,#e7f4fd,#dcecf8)] py-14 text-midnight sm:py-20">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export const panel = "rounded-[2px] bg-white p-6 shadow-[0_18px_40px_-20px_rgba(3,31,51,0.25)] ring-1 ring-studio/10 sm:p-8";
export const input =
  "mt-1.5 h-12 w-full rounded-[2px] border border-studio/30 bg-white px-3.5 font-sans text-[16px] text-midnight outline-none transition-colors focus:border-studio focus-visible:ring-2 focus-visible:ring-studio/30";
export const btnPrimary =
  "inline-flex h-12 items-center justify-center rounded-[2px] bg-midnight px-6 font-sans text-[16px] font-medium text-white transition-colors hover:bg-harbor focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio disabled:opacity-60";
export const btnSecondary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-studio/40 bg-white px-6 font-sans text-[16px] font-medium text-midnight transition-colors hover:border-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio disabled:opacity-60";
