import type { Metadata } from "next";
import { AccountView } from "./account-view";
import { AuthShell } from "@/components/site/auth-shell";

export const metadata: Metadata = {
  title: { absolute: "My Account | 830 Productions Shop" },
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <AuthShell>
      <span className="label text-studio">My Account</span>
      <h1 className="mt-4 mb-10 font-sans text-[clamp(36px,4.4vw,56px)] leading-[1.04] font-light tracking-[-0.02em]">Welcome back.</h1>
      <AccountView />
    </AuthShell>
  );
}
