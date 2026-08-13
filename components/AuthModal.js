"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const backendApi = process.env.NEXT_PUBLIC_APP_API;

  async function handleRegister(e) {
    e?.preventDefault?.();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendApi}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "REGISTER_FAILED");

      // NextAuth credentials provider can now log in using the same email/password.
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.error) throw new Error(signInRes.error);

      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignIn(e) {
    e?.preventDefault?.();
    setError("");
    setIsSubmitting(true);
    try {
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.error) throw new Error(signInRes.error);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Sign in</h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setTab("signin")}
            aria-pressed={tab === "signin"}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              tab === "signin" ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("signup")}
            aria-pressed={tab === "signup"}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              tab === "signup" ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5"
            }`}
          >
            Sign up
          </button>
        </div>

        {tab === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div className="mb-3">
              <label className="text-sm text-gray-200 block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-200 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              />
            </div>

            {error && <div className="mb-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="text-sm text-gray-200 block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-200 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
              />
            </div>

            {error && <div className="mb-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        <div className="mt-4">
          <button
            onClick={() => signIn("google")}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 transition hover:bg-white/10"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

