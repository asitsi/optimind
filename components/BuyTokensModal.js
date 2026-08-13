"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/AuthModal";

export default function BuyTokensModal({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      if (!isOpen || !session) return;
      setLoadingPlans(true);
      setError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/payments/plans`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "PLANS_FAILED");
        if (cancelled) return;
        setPlans(data?.plans || []);
        setSelectedPlanId((prev) => prev || data?.plans?.[0]?.planId || null);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load token packs");
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    }

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, [isOpen, session]);

  if (!isOpen) return null;

  async function handleBuy() {
    if (!session?.accessToken) return;
    if (!selectedPlanId) return;

    setCreatingOrder(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ planId: selectedPlanId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "ORDER_FAILED");

      const checkoutUrl = data?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Payment checkout URL missing");

      // Redirect to Cashfree checkout.
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err?.message || "Failed to create payment");
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl">
        <h3 className="mb-2 text-xl font-semibold">Buy more tokens</h3>
        <p className="text-gray-200">
          You’ve reached your current quota. {session ? "Choose a token pack to continue." : "Sign in to buy more tokens."}
        </p>

        {error && <div className="mt-3 text-sm text-red-200">{error}</div>}

        {!session ? (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setAuthOpen(true)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600"
            >
              Sign in
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5">
              {loadingPlans ? (
                <div className="text-sm text-gray-200">Loading token packs...</div>
              ) : plans.length === 0 ? (
                <div className="text-sm text-gray-200">No token packs available.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {plans.map((p) => {
                    const active = p.planId === selectedPlanId;
                    return (
                      <button
                        key={p.planId}
                        onClick={() => setSelectedPlanId(p.planId)}
                        aria-pressed={active}
                        className={`text-left rounded-lg border px-3 py-3 transition ${
                          active ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="font-semibold">{p.tokensGranted} calls</div>
                        <div className="text-sm text-gray-300">
                          {p.currency} {p.amount}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={creatingOrder || !selectedPlanId}
                onClick={handleBuy}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingOrder ? "Redirecting..." : "Buy now"}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

