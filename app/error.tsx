"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Compass, Home, RefreshCw, Sparkles, Users } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client error captured by Bibble boundary:", error);
  }, [error]);

  return (
    <div className="status-page-wrapper">
      <SiteHeader />
      <main className="status-content">
        <div className="status-badge">
          <Sparkles size={14} />
          <span>Gentle pause</span>
        </div>

        <h1 className="status-code" style={{ fontSize: "clamp(48px, 9vw, 84px)" }}>
          Oops!
        </h1>
        <h2 className="status-title">Something stumbled along the way.</h2>
        <p className="status-desc">
          Don&apos;t worry, your learning progress is safe. An unexpected hiccup occurred while rendering this corner of Bibble.
        </p>

        <div className="status-actions">
          <button onClick={() => reset()} className="button-primary" type="button">
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/explore" className="button-secondary">
            <Compass size={16} /> Explore maps
          </Link>
          <Link href="/rooms" className="button-secondary">
            <Users size={16} /> Study rooms
          </Link>
          <Link href="/" className="button-secondary">
            <Home size={16} /> Home
          </Link>
        </div>

        {error.digest && (
          <p style={{ fontSize: "11px", color: "var(--muted)", opacity: 0.7, marginTop: "12px" }}>
            Error reference: {error.digest}
          </p>
        )}
      </main>
    </div>
  );
}
