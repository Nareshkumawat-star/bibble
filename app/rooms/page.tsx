import type { Metadata } from "next";
import { RoomsClient } from "./rooms-client";

export const metadata: Metadata = {
  title: "Study Rooms",
  description: "Drop into a cozy room, set a gentle focus timer, and let the quiet company carry you forward.",
  openGraph: {
    title: "Study Rooms | Bibble",
    description: "Drop into a cozy room, set a gentle focus timer, and let the quiet company carry you forward.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Rooms | Bibble",
    description: "Drop into a cozy room, set a gentle focus timer, and let the quiet company carry you forward.",
  },
};

export default function RoomsPage() {
  return <RoomsClient />;
}
