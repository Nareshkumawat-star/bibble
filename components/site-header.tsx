"use client";

import { ThemePicker } from "@/components/ui/theme-picker";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ArrowUpRight, LogIn, LogOut, UserRoundPlus } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  const { motif } = useTheme();
  const { session, isLoaded, logout } = useAuth();

  const isSignedIn = isLoaded && Boolean(session);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">{motif.brandEmoji}</span>
          <span>Bibble</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/explore">Explore maps</Link>
          <Link href="/rooms">Study rooms</Link>
          <ThemePicker compact />
          {isSignedIn && session ? (
            <div className="nav-user-menu" data-testid="nav-user-menu">
              <span
                className="nav-user-pill"
                title={`Signed in as ${session.name} (${session.email})`}
              >
                <span className="nav-user-avatar" aria-hidden="true">
                  {session.name ? session.name.charAt(0).toUpperCase() : "🍓"}
                </span>
                <span className="nav-user-name">{session.name || "Bibbler"}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="nav-logout-btn"
                data-testid="nav-logout-btn"
                title="Log out of this session"
                aria-label="Log out of your Bibble session"
              >
                <LogOut size={13} />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-login">
                <LogIn size={15} /> Log in
              </Link>
              <Link href="/signup" className="nav-signup">
                <UserRoundPlus size={15} /> Sign up
              </Link>
            </>
          )}
          <Link href="/create" className="nav-cta">
            Create a map <ArrowUpRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
