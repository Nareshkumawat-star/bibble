import type { Metadata } from "next";
import { ExploreClient } from "./explore-client";

export const metadata: Metadata = {
  title: "Explore Maps",
  description: "Browse small worlds of knowledge, interactive learning roadmaps, and connected bibbles to grow what you know.",
  openGraph: {
    title: "Explore Maps | Bibble",
    description: "Browse small worlds of knowledge, interactive learning roadmaps, and connected bibbles to grow what you know.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Maps | Bibble",
    description: "Browse small worlds of knowledge, interactive learning roadmaps, and connected bibbles to grow what you know.",
  },
};

export default function ExplorePage() {
  return <ExploreClient />;
}
