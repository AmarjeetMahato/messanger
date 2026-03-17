/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const VerifyOTP = () => {
     const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);



  const from = searchParams.get("from");

  const isFromSignIn = from === "signin";

  const handleBack = () => {
    if (isFromSignIn) {
      router.push("/signin");
    } else {
      router.push("/signup");
    }
  };


  // Countdown timer
 useEffect(() => {
  if (resendTimer <= 0) {
    // schedule state update asynchronously
    const id = setTimeout(() => setCanResend(true), 0);
    return () => clearTimeout(id);
  }

  const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);

  return () => clearTimeout(timer);
}, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (status === "error") setStatus("idle");
    // Auto-advance
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setStatus("loading");
    setTimeout(() => {
      // Simulate: "000000" = error, anything else = success
      setStatus(code === "000000" ? "error" : "success");
    }, 1800);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(6).fill(""));
    setStatus("idle");
    setCanResend(false);
    setResendTimer(30);
    inputRefs.current[0]?.focus();
  };

  const isFilled = otp.every((d) => d !== "");

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#070711] flex items-center justify-center px-4 relative overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <div className="absolute -top-32 -left-32 w-125 h-125 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-violet-600 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/40">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white/90 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Account verified!
          </h2>
          <p className="text-white/40 text-sm">Welcome to VibeChat. You&apos;re all set.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center px-4 relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Background orbs */}
      <div className="absolute -top-32 -left-32 w-125 h-125 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-violet-600 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/3 right-1/4 w-62.5 h-62.5 bg-cyan-500 rounded-full blur-[90px] opacity-10 animate-pulse delay-500" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/4 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-10 shadow-2xl">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" opacity="0.9" />
              <circle cx="9" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
              <circle cx="12" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
              <circle cx="15" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
            </svg>
          </div>
          <span className="text-[19px] font-extrabold text-white/90 tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Vibe<span className="text-indigo-400">Chat</span>
          </span>
        </div>

        {/* Email icon + heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="text-[24px] font-extrabold text-white/90 tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
            Check your email
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            We sent a 6-digit verification code to{" "}
            <span className="text-indigo-400 font-medium">you@example.com</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={`
                w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none
                transition-all duration-200 caret-transparent
                ${status === "error"
                  ? "bg-red-500/10 border-red-500/60 text-red-400 focus:ring-2 focus:ring-red-500/20"
                  : digit
                    ? "bg-indigo-500/10 border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500/20"
                    : "bg-white/4 border-white/10 text-white focus:border-indigo-500/60 focus:bg-indigo-500/6 focus:ring-2 focus:ring-indigo-500/10"
                }
              `}
            />
          ))}
        </div>

        {/* Error message */}
        {status === "error" && (
          <p className="text-center text-[13px] text-red-400 mb-4 flex items-center justify-center gap-1.5 mt-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Invalid code. Please try again.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={!isFilled || status === "loading"}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white text-[15px] font-semibold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "loading" ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <>
                Verify email
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {/* Resend */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm text-white/35">Didn&apos;t receive it?</span>
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150 cursor-pointer"
              >
                Resend code
              </button>
            ) : (
              <span className="text-sm text-white/25 font-medium">
                Resend in{" "}
                <span className="text-indigo-400/70 tabular-nums">0:{String(resendTimer).padStart(2, "0")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Back to login */}
        <div onClick={handleBack} className="mt-6 pt-5 border-t border-white/6 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <button className="text-sm text-white/35 hover:text-white/60 transition-colors duration-150 cursor-pointer">
                    {isFromSignIn ? "Back to sign in" : "Back to sign up"}

          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;