"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#121212] transition-colors">
      <div className="max-w-md w-full p-8 bg-white dark:bg-[#1e1e1e] shadow-sm border border-gray-200 dark:border-neutral-800 rounded-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded mb-4 bg-blue-600 flex items-center justify-center text-white font-bold text-lg">A</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">AdminPanel</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Sign in to your admin account</p>
        </div>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-neutral-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 p-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors font-medium mt-6"
          >
            Sign in
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-neutral-500 mt-4">Protected route — dashboard only for authenticated admins.</p>
        </form>
      </div>
    </div>
  );
}