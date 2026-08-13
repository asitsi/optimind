"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const RESEND_COOLDOWN_SEC = 60;

export default function AuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("signin"); // "signin" | "signup"
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const backendApi = process.env.NEXT_PUBLIC_APP_API;

  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setOtp("");
      setError("");
      setInfo("");
      setResendIn(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  if (!isOpen) return null;

  function startResendCooldown() {
    setResendIn(RESEND_COOLDOWN_SEC);
  }

  async function handleRegister(e) {
    e?.preventDefault?.();
    setError("");
    setInfo("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendApi}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "REGISTER_FAILED");

      setStep("otp");
      setInfo("We sent a 6-digit code to your email.");
      startResendCooldown();
    } catch (err) {
      setError(err?.message || "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignIn(e) {
    e?.preventDefault?.();
    setError("");
    setInfo("");
    setIsSubmitting(true);
    try {
      const loginRes = await fetch(`${backendApi}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json().catch(() => ({}));

      if (!loginRes.ok) {
        if (loginData?.error === "EMAIL_NOT_VERIFIED") {
          setStep("otp");
          setInfo("Verify your email with the 6-digit code.");
          try {
            await fetch(`${backendApi}/auth/resend-otp`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            startResendCooldown();
          } catch (_) {
            /* ignore resend failure here */
          }
          return;
        }
        throw new Error(loginData?.error || "LOGIN_FAILED");
      }

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

  async function handleVerifyOtp(e) {
    e?.preventDefault?.();
    setError("");
    setInfo("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendApi}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "VERIFY_FAILED");

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInRes?.error) throw new Error(signInRes.error);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to verify code");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (resendIn > 0) return;
    setError("");
    setInfo("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendApi}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "RESEND_FAILED");
      setInfo(data?.message || "If an account exists, a new code was sent.");
      startResendCooldown();
    } catch (err) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {step === "otp" ? "Verify email" : "Sign in"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        {step === "form" && (
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
        )}

        {step === "otp" ? (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-sm text-gray-200 mb-3">
              Enter the 6-digit code sent to <span className="text-white">{email}</span>.
            </p>
            <div className="mb-4">
              <label className="text-sm text-gray-200 block mb-1">Verification code</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none tracking-widest text-center text-lg"
                placeholder="000000"
              />
            </div>

            {info && <div className="mb-3 text-sm text-green-200">{info}</div>}
            {error && <div className="mb-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              disabled={isSubmitting || resendIn > 0}
              onClick={handleResendOtp}
              className="mt-3 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10 disabled:opacity-50"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtp("");
                setError("");
                setInfo("");
              }}
              className="mt-3 w-full text-sm text-gray-300 hover:text-white"
            >
              Back
            </button>
          </form>
        ) : tab === "signin" ? (
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

        {step === "form" && (
          <div className="mt-4">
            <button
              onClick={() => signIn("google")}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 transition hover:bg-white/10"
            >
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
