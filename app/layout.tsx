import "@xyflow/react/dist/style.css";
import type { Metadata } from "next";
import { DM_Serif_Display, Nunito, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bibble-three.vercel.app"),
  title: {
    default: "Bibble | Grow what you know",
    template: "%s | Bibble",
  },
  description: "A cozy little space to grow what you know. Study together in quiet rooms and map your learning journey.",
  keywords: [
    "Bibble",
    "study rooms",
    "learning maps",
    "cozy study",
    "DSA roadmap",
    "focus timer",
    "pomodoro",
  ],
  authors: [{ name: "Bibble" }],
  openGraph: {
    title: "Bibble | Grow what you know",
    description: "A cozy little space to grow what you know. Study together in quiet rooms and map your learning journey.",
    url: "https://bibble-three.vercel.app",
    siteName: "Bibble",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bibble | Grow what you know",
    description: "A cozy little space to grow what you know. Study together in quiet rooms and map your learning journey.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", nunito.variable, display.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
