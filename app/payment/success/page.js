"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGuestId } from "@/libs/guest";
import { getQuotaStatus } from "@/libs/apis";

function PaymentSuccessContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [state, setState] = useState({ status: "processing", error: null });

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    async function run() {
      try {
        const guestId = getGuestId();
        const identity = { accessToken: session?.accessToken, guestId };
        const before = await getQuotaStatus(identity);
        const beforeRemaining = before?.remaining ?? 0;

        const maxAttempts = 20;
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          if (cancelled) return;

          const q = await getQuotaStatus(identity);
          const remaining = q?.remaining ?? 0;
          if (remaining > beforeRemaining) {
            if (!cancelled) setState({ status: "success", error: null });
            return;
          }
        }

        if (!cancelled) {
          setState({
            status: "processing_done",
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) setState({ status: "error", error: err?.message || "Poll failed" });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId, session?.accessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl">
        <h1 className="text-2xl font-bold mb-3">Payment {state.status === "success" ? "successful" : "processing"}</h1>
        {orderId && <p className="text-sm text-gray-300 mb-4">Order: {orderId}</p>}

        {state.status === "success" && (
          <p className="text-gray-200">
            Tokens are credited. You can continue chatting now.
          </p>
        )}

        {state.status === "processing_done" && (
          <p className="text-gray-200">
            We couldn’t confirm the quota increase instantly, but Cashfree returned success. You can refresh or continue.
          </p>
        )}

        {state.status === "error" && (
          <p className="text-red-200 text-sm mb-4">Error: {state.error}</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600"
          >
            Go to chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-6 text-white">
          Loading payment status...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
