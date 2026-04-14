'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 font-sans">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="relative inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-medium mb-4">
          Runtime Error
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Something went wrong
        </h1>
        
        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
          Application encountered an unexpected error. Don't worry, our team has been notified. You can try resetting the state or return home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
          >
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-gray-600 font-mono pt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
