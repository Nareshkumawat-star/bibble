import type { Metadata } from "next";
import { CreateClient } from "./create-client";

export const metadata: Metadata = {
  title: "Create a Map",
  description: "Start a fresh learning world and make progress visual with connected bibbles.",
  openGraph: {
    title: "Create a Map | Bibble",
    description: "Start a fresh learning world and make progress visual with connected bibbles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create a Map | Bibble",
    description: "Start a fresh learning world and make progress visual with connected bibbles.",
  },
};

export default function CreatePage() {
  return <CreateClient />;
}
