import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ArrowUpRight, Compass, Home, MapPin, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for has wandered off or doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="status-page-wrapper">
      <SiteHeader />
      <main className="status-content">
        <div className="status-badge">
          <Sparkles size={14} />
          <span>Lost in the bibbles</span>
        </div>

        <h1 className="status-code">404</h1>
        <h2 className="status-title">This corner wandered off.</h2>
        <p className="status-desc">
          We couldn&apos;t find the room, map, or path you were looking for. It might have moved, or perhaps it hasn&apos;t been planted yet. Let&apos;s guide you back to familiar ground.
        </p>

        <div className="status-actions">
          <Link href="/explore" className="button-primary">
            <Compass size={16} /> Explore maps
          </Link>
          <Link href="/rooms" className="button-secondary">
            <Users size={16} /> Study rooms
          </Link>
          <Link href="/" className="button-secondary">
            <Home size={16} /> Home
          </Link>
        </div>

        <div className="status-suggestions">
          <div className="status-suggestions-title">
            <MapPin size={13} /> Cozy spots you might like
          </div>
          <div className="status-links-grid">
            <Link href="/map/dsa-roadmap" className="status-link-card">
              <strong>
                DSA Roadmap <ArrowUpRight size={13} />
              </strong>
              <span>Interactive visual map</span>
            </Link>
            <Link href="/map/react-journey" className="status-link-card">
              <strong>
                React Journey <ArrowUpRight size={13} />
              </strong>
              <span>Component foundations</span>
            </Link>
            <Link href="/rooms/soft-starts" className="status-link-card">
              <strong>
                Soft starts <ArrowUpRight size={13} />
              </strong>
              <span>Low-pressure study table</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
