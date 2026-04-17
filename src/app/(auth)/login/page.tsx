"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Copy, Check, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  const copyToClipboard = async (text: string, type: "email" | "pass") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] transition-colors p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl mb-4 bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Welcome Back</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 text-center">
            Sign in to access your e-commerce dashboard
          </p>
        </div>

        {/* Card */}
        <div className="dash-card shadow-xl border-[var(--border)]">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <div className="shrink-0 p-2.5 rounded-lg bg-gray-50 dark:bg-[#121212] border border-[var(--border)] text-[var(--text-muted)]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  className="ctrl"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className="flex items-center gap-3">
                <div className="shrink-0 p-2.5 rounded-lg bg-gray-50 dark:bg-[#121212] border border-[var(--border)] text-[var(--text-muted)]">
                  <Lock size={18} />
                </div>
                <div className="relative flex-1 group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ctrl pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all font-semibold mt-4 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 text-center">
              Demo Test Credentials
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-[#121212] border border-[var(--border)] group/item transition-all hover:border-blue-400/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">EMAIL</span>
                  <span className="text-xs font-mono text-[var(--text-primary)]">admin@admin.com</span>
                </div>
                <button
                  onClick={() => copyToClipboard("admin@admin.com", "email")}
                  className="p-2 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-[#121212] border border-[var(--border)] group/item transition-all hover:border-blue-400/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">PASSWORD</span>
                  <span className="text-xs font-mono text-[var(--text-primary)]">admin123</span>
                </div>
                <button
                  onClick={() => copyToClipboard("admin123", "pass")}
                  className="p-2 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                  title="Copy password"
                >
                  {copiedPass ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-center text-[var(--text-muted)] mt-6 px-4">
          This system is strictly for authorized administrative use only.
          All access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}
