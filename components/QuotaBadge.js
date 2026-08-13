"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getGuestId } from "@/libs/guest";
import { getQuotaStatus } from "@/libs/apis";

export default function QuotaBadge() {
  const { data: session } = useSession();
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuota() {
      const guestId = getGuestId();
      const q = await getQuotaStatus({
        accessToken: session?.accessToken,
        guestId,
      });
      if (!cancelled) setQuota(q);
    }

    loadQuota();
    return () => {
      cancelled = true;
    };
  }, [session?.accessToken]);

  if (!quota) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5">
      <span className="text-sm text-gray-200">
        {quota.remaining} / {quota.limit} calls left
      </span>
    </div>
  );
}

