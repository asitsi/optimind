"use client"
import { useState } from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import QuotaBadge from "@/components/QuotaBadge";
import AuthModal from "@/components/AuthModal";

export default function HeaderBar() {
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const isSignedIn = Boolean(session?.user || session?.accessToken);

  return (
    <header className="text-center py-12">
      <div className="inline-flex items-center gap-3 px-6 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl mb-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
        </div>
        <Bot className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Chat Comparison
        </h1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        <QuotaBadge />
        {status !== "loading" && (
          isSignedIn ? (
            <>
              <span className="text-sm text-gray-300 truncate max-w-[200px]">
                {session?.user?.email || "Signed in"}
              </span>
              <button
                type="button"
                onClick={() => signOut({ redirect: false })}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2 text-sm text-white transition hover:from-blue-600 hover:to-purple-600"
            >
              Sign in
            </button>
          )
        )}
      </div>
      <p className="text-gray-300 text-lg">Compare responses</p>
      <Link href="/history" className="text-blue-400 hover:underline">
        View History
      </Link>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
