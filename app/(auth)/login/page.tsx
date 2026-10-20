import type { Metadata } from "next";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to Bibble to track your progress and settle into your cozy study space.",
  openGraph: {
    title: "Log In | Bibble",
    description: "Log in to Bibble to track your progress and settle into your cozy study space.",
  },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
