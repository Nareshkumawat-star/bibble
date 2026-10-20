import type { Metadata } from "next";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Bibble account and start growing what you know in cozy study spaces.",
  openGraph: {
    title: "Sign Up | Bibble",
    description: "Create your Bibble account and start growing what you know in cozy study spaces.",
  },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
