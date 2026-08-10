"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  dashboardPathForRole,
  getApiBaseUrl,
  writeSession,
  type AuthSession,
} from "@/lib/auth/session";

type Step = "form" | "otp";

export function RegisterFormBridge() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  useEffect(() => {
    let attachedForm: HTMLFormElement | null = null;

    const onSubmit = async (event: Event) => {
      const form = event.currentTarget as HTMLFormElement;
      if (form.id !== "register_form") return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      setError(null);
      setInfo(null);
      setPending(true);

      const fd = new FormData(form);
      const regEmail = String(fd.get("email") ?? "")
        .trim()
        .toLowerCase();
      const regPassword = String(fd.get("password") ?? "");
      const confirm = String(fd.get("confirm_password") ?? "");

      if (!regEmail || !regPassword) {
        setError("Email and password are required.");
        setPending(false);
        return;
      }
      if (regPassword !== confirm) {
        setError("Passwords do not match.");
        setPending(false);
        return;
      }

      try {
        const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: regEmail,
            password: regPassword,
            role: "candidate",
          }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
          devOtp?: string;
        };

        if (!res.ok) {
          setError(data.error || "Registration failed.");
          setPending(false);
          return;
        }

        setEmail(regEmail);
        setPassword(regPassword);
        setStep("otp");
        setInfo(data.message || "Check your email for the verification code.");
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
      } catch {
        setError(
          "Could not reach the API. Start metrology-backend on port 4000.",
        );
      } finally {
        setPending(false);
      }
    };

    const bindForm = (form: HTMLFormElement) => {
      if (attachedForm === form) return;
      attachedForm?.removeEventListener("submit", onSubmit, true);
      attachedForm = form;
      form.setAttribute("method", "post");
      form.setAttribute("action", "javascript:void(0)");
      form.addEventListener("submit", onSubmit, true);
    };

    const tryAttach = () => {
      const form = document.getElementById("register_form");
      if (form instanceof HTMLFormElement) bindForm(form);
    };

    tryAttach();
    const observer = new MutationObserver(tryAttach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      attachedForm?.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  const verifyAndSignIn = async () => {
    if (!email || !otp.trim()) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError(null);
    setPending(true);

    try {
      const verifyRes = await fetch(`${getApiBaseUrl()}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });
      const verifyData = (await verifyRes.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid or expired code.");
        setPending(false);
        return;
      }

      const loginRes = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: email, password }),
      });
      const loginData = (await loginRes.json().catch(() => ({}))) as {
        error?: string;
        token?: string;
        user?: AuthSession["user"];
        permissions?: string[];
      };

      if (!loginRes.ok || !loginData.token || !loginData.user) {
        setError(
          loginData.error ||
            "Verified! Please sign in on the login page.",
        );
        setPending(false);
        router.push("/login");
        return;
      }

      writeSession({
        token: loginData.token,
        user: loginData.user,
        permissions: loginData.permissions ?? [],
      });
      router.push(dashboardPathForRole(loginData.user.role));
      router.refresh();
    } catch {
      setError("Could not reach the API.");
      setPending(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        devOtp?: string;
      };
      if (!res.ok) {
        setError(data.error || "Could not resend code.");
      } else {
        setInfo(data.message || "Code resent.");
        if (data.devOtp) setDevOtpHint(data.devOtp);
      }
    } catch {
      setError("Could not reach the API.");
    } finally {
      setPending(false);
    }
  };

  if (step === "form" && !error && !pending && !info) return null;

  if (step === "form") {
    return (
      <AuthMessage
        error={error}
        info={info}
        pending={pending}
        pendingLabel="Creating account…"
      />
    );
  }

  return (
    <div
      className="mx-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-[#141820] p-6 text-white shadow-xl"
      role="region"
      aria-label="Email verification"
    >
      <h2 className="text-lg font-semibold">Verify your email</h2>
      <p className="mt-2 text-sm text-white/55">
        We sent a 6-digit code to <strong className="text-white/80">{email}</strong>
      </p>
      {devOtpHint ? (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Dev mode — your code: <strong className="tracking-widest">{devOtpHint}</strong>
        </p>
      ) : null}
      {info ? <p className="mt-2 text-sm text-emerald-400/90">{info}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}

      <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-white/45">
        Verification code
      </label>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-center text-lg tracking-[0.35em] text-white outline-none focus:border-[#0073ff]"
        placeholder="000000"
      />

      <button
        type="button"
        disabled={pending}
        onClick={() => void verifyAndSignIn()}
        className="mt-4 w-full rounded-lg bg-[#0073ff] py-3 text-sm font-semibold text-white hover:bg-[#0062d9] disabled:opacity-60"
      >
        {pending ? "Verifying…" : "Verify & open dashboard"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => void resendOtp()}
        className="mt-3 w-full text-sm text-white/50 hover:text-white"
      >
        Resend code
      </button>
    </div>
  );
}

function AuthMessage({
  error,
  info,
  pending,
  pendingLabel,
}: {
  error: string | null;
  info: string | null;
  pending: boolean;
  pendingLabel: string;
}) {
  if (!error && !info && !pending) return null;
  return (
    <div className="mx-auto mt-4 max-w-md px-4 text-center text-sm" role="status">
      {pending ? (
        <p className="text-white/70">{pendingLabel}</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : info ? (
        <p className="text-emerald-400/90">{info}</p>
      ) : null}
    </div>
  );
}
