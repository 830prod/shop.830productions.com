"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { btnPrimary, btnSecondary, input, panel } from "@/components/site/auth-shell";
import { currentUser, friendlyAuthError, safeNext, signIn, signInGoogle, signUp } from "@/lib/firebase";

// Full page load so the product page reads its ?color= and the header picks up the session.
const goNext = () => window.location.assign(safeNext(new URLSearchParams(window.location.search).get("next")));

type Status = { message: string; state: "" | "pending" | "error" };

export function LoginForm() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState<Status>({ message: "", state: "" });
  const busy = status.state === "pending";

  useEffect(() => {
    currentUser().then((user) => {
      if (user) goNext();
    });
  }, []);

  const run = async (pendingMessage: string, action: () => Promise<unknown>) => {
    setStatus({ message: pendingMessage, state: "pending" });
    try {
      await action();
      goNext();
    } catch (error) {
      setStatus({ message: friendlyAuthError(error), state: "error" });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    if (tab === "signin") run("Logging in…", () => signIn(email, password));
    else run("Creating your account…", () => signUp(String(f.get("name") ?? "").trim(), email, password));
  };

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={tab === id}
      aria-controls="auth-form"
      onClick={() => {
        setTab(id);
        setStatus({ message: "", state: "" });
      }}
      className={cn(
        "flex-1 border-b-2 pb-3 font-sans text-[16px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-studio",
        tab === id ? "border-midnight text-midnight" : "border-transparent text-steel hover:text-studio",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className={panel}>
      <div role="tablist" aria-label="Account" className="mb-6 flex border-b border-studio/15">
        {tabBtn("signin", "Log In")}
        {tabBtn("signup", "Create Account")}
      </div>

      <form id="auth-form" key={tab} role="tabpanel" aria-labelledby={`tab-${tab}`} onSubmit={onSubmit} className="space-y-4">
        {tab === "signup" && (
          <label className="block font-sans text-[15px] font-medium">
            Name
            <input name="name" type="text" autoComplete="name" required className={input} />
          </label>
        )}
        <label className="block font-sans text-[15px] font-medium">
          Email
          <input name="email" type="email" autoComplete="email" required className={input} />
        </label>
        <label className="block font-sans text-[15px] font-medium">
          Password
          <input
            name="password"
            type="password"
            autoComplete={tab === "signin" ? "current-password" : "new-password"}
            minLength={tab === "signup" ? 6 : undefined}
            required
            className={input}
          />
        </label>
        <button type="submit" disabled={busy} className={cn(btnPrimary, "w-full")}>
          {tab === "signin" ? "Log In" : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 font-sans text-[13px] tracking-[0.2em] text-steel uppercase">
        <span className="h-px flex-1 bg-studio/20" />
        or
        <span className="h-px flex-1 bg-studio/20" />
      </div>
      <button type="button" disabled={busy} onClick={() => run("Opening Google sign-in…", signInGoogle)} className={cn(btnSecondary, "w-full")}>
        <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.3 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7.1 29.5 5 24 5c-7.6 0-14.2 4.3-17.7 10.7z" />
          <path fill="#4CAF50" d="M24 43c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-2.7-11.3-7l-6.5 5C9.7 39 16.3 43 24 43z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.5 5.4C39.9 37.1 43 31.9 43 24c0-1.3-.1-2.7-.4-3.5z" />
        </svg>
        Continue with Google
      </button>

      <p aria-live="polite" className={cn("mt-4 min-h-6 font-sans text-[15px]", status.state === "error" ? "text-destructive" : "text-studio")}>
        {status.message}
      </p>
    </div>
  );
}
