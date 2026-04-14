"use client";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
      <h2 className="text-lg font-semibold">Store Manager</h2>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-red-600 font-medium"
      >
        Logout
      </button>
    </header>
  );
}