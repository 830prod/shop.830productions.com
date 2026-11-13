"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, type Timestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { btnPrimary, btnSecondary, panel } from "@/components/site/auth-shell";
import { db, getUserProfile, signOutUser, useUser } from "@/lib/firebase";

type Order = {
  productName?: string;
  productType?: "digital" | "merch";
  price?: number;
  purchasedAt?: Timestamp;
  downloadUrl?: string;
};

const TYPE_LABEL = { digital: "Digital", merch: "Merch" } as const;

export function AccountView() {
  const router = useRouter();
  const user = useUser();
  const [since, setSince] = useState("—");
  const [orders, setOrders] = useState<Order[] | null | "error">(null);

  useEffect(() => {
    if (user === null) {
      window.location.replace("/login?next=%2Faccount");
      return;
    }
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      const created = (profile?.createdAt as Timestamp | undefined)?.toDate?.();
      if (created) setSince(created.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }));
    });
    getDocs(query(collection(db, "users", user.uid, "orders"), orderBy("purchasedAt", "desc")))
      .then((snap) => setOrders(snap.docs.map((d) => d.data() as Order)))
      .catch(() => setOrders("error"));
  }, [user]);

  if (!user) return <p className="text-studio">Loading your account…</p>;

  return (
    <div className="grid items-start gap-6 md:grid-cols-[1fr_1.4fr]">
      <div className={panel}>
        <span className="label text-studio">Profile</span>
        <h2 className="mt-2 font-sans text-[26px] font-normal">Account overview</h2>
        <dl className="mt-5 divide-y divide-studio/15 font-sans text-[15px]">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-steel">Email</dt>
            <dd className="truncate">{user.email || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-steel">Member since</dt>
            <dd>{since}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className={btnPrimary}>
            Back to shop
          </Link>
          <button
            type="button"
            className={btnSecondary}
            onClick={async () => {
              await signOutUser();
              router.push("/");
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className={panel}>
        <span className="label text-studio">Order History</span>
        <h2 className="mt-2 font-sans text-[26px] font-normal">Your orders</h2>
        <div className="mt-5">
          {orders === null && <p className="text-studio">Loading your orders…</p>}
          {orders === "error" && <p className="text-studio">Couldn’t load orders right now.</p>}
          {Array.isArray(orders) && orders.length === 0 && (
            <p className="text-studio">
              No orders yet. Anything you buy in the{" "}
              <Link href="/" className="underline underline-offset-4">
                shop
              </Link>{" "}
              shows up here.
            </p>
          )}
          {Array.isArray(orders) && orders.length > 0 && (
            <ul className="divide-y divide-studio/15">
              {orders.map((o, i) => {
                const date = o.purchasedAt?.toDate?.().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                return (
                  <li key={i} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <span className="label text-[10px] text-steel">{(o.productType && TYPE_LABEL[o.productType]) || "Order"}</span>
                      <h3 className="mt-1 font-sans text-[17px] font-medium">{o.productName || "830 Productions order"}</h3>
                      <p className="font-sans text-[14px] text-steel">
                        {[date, o.price ? `$${Number(o.price).toFixed(2)}` : ""].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {o.productType === "digital" && o.downloadUrl?.startsWith("https://") && (
                      <a href={o.downloadUrl} target="_blank" rel="noreferrer" className={cn(btnSecondary, "h-10 px-4 text-[15px]")}>
                        Download
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
