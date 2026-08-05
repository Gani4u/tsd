import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";

const LOGO_URL = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();

  if (user) return <Navigate to={location.state?.from || "/admin"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) setErr(res.error);
  };

  return (
    <div className="min-h-[80vh] container-x py-16 grid lg:grid-cols-2 gap-12 items-center">
      <div className="hidden lg:block">
        <div className="chip w-fit"><Lock size={12} className="text-brand" /> Admin Access</div>
        <h1 className="mt-4 font-display font-black text-5xl leading-[0.95] tracking-tight">
          Command center<br /><span className="text-brand">for the drop.</span>
        </h1>
        <p className="muted mt-4 max-w-md">
          Add products, toggle "Coming Soon", curate the storefront. Every save is instant.
        </p>
      </div>

      <div className="max-w-md w-full mx-auto card p-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white">
            <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain scale-110" />
          </span>
          <span className="font-display font-black text-xl">TSD Admin</span>
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Sign in</h2>
        <p className="muted text-sm mt-1">Use your admin credentials.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label-caps muted">Email</label>
            <input
              className="input mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="login-email"
              placeholder="admin@tsdworld.in"
            />
          </div>
          <div>
            <label className="label-caps muted">Password</label>
            <input
              className="input mt-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="login-password"
              placeholder="••••••••"
            />
          </div>
          {err && <div className="text-sm text-red-500" data-testid="login-error">{err}</div>}
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center" data-testid="login-submit">
            {busy ? "Signing in…" : "Enter admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
