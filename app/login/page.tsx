import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { AuthShell } from "@/components/site/auth-shell";

export const metadata: Metadata = {
  title: { absolute: "Log In | 830 Productions Shop" },
  description: "Log in or create a free 830 Productions account to check out and track your orders.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr] md:gap-16">
        <div>
          <span className="label text-studio">Your Account</span>
          <h1 className="mt-4 font-sans text-[clamp(36px,4.4vw,56px)] leading-[1.04] font-light tracking-[-0.02em]">
            One account, every 830 site.
          </h1>
          <p className="mt-4 max-w-[30em] text-[20px] text-studio">
            Sign in to check out. The same login works on the Shop, the Assets library and everywhere else 830 Productions builds.
          </p>
          <ul className="mt-6 space-y-2 font-sans text-[16px]">
            {["Check out securely", "Track every order", "Re-download LUT packs anytime"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-5 bg-steel" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <LoginForm />
      </div>
    </AuthShell>
  );
}
