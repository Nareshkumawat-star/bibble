"use client";

import { useAuth } from "@/hooks/use-auth";
import type { BibbleAccount } from "@/types/auth";
import { AlertTriangle, ArrowRight, CheckCircle2, Compass, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./auth.module.css";

type AuthMode = "login" | "signup";

interface FeedbackState {
  type: "success" | "error" | "warning";
  text: string;
}

interface PendingOverwrite {
  name: string;
  email: string;
  existingAccount: BibbleAccount;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const { session, isLoaded, login, signup, logout } = useAuth();

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [pendingOverwrite, setPendingOverwrite] = useState<PendingOverwrite | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setPendingOverwrite(null);

    const name = nameInput.trim();
    const email = emailInput.trim().toLowerCase();

    if (isSignup) {
      const result = signup(name, email, false);
      if (result.requiresOverwriteConfirmation && result.existingAccount) {
        setPendingOverwrite({
          name,
          email,
          existingAccount: result.existingAccount,
        });
        setFeedback({
          type: "warning",
          text: `An account for "${result.existingAccount.name}" (${result.existingAccount.email}) is already stored on this device.`,
        });
        return;
      }

      if (!result.success && result.error) {
        setFeedback({ type: "error", text: result.error });
        return;
      }

      if (result.success) {
        setFeedback({
          type: "success",
          text: `Your local Bibble account is ready, ${name || "friend"}! You're now signed in.`,
        });
        setNameInput("");
        setEmailInput("");
      }
      return;
    }

    // Login mode
    const result = login(email);
    if (!result.success && result.error) {
      setFeedback({ type: "error", text: result.error });
      return;
    }

    if (result.success && result.account) {
      setFeedback({
        type: "success",
        text: `Welcome back, ${result.account.name}! You're signed in on this browser.`,
      });
      setEmailInput("");
    }
  }

  function handleConfirmOverwrite() {
    if (!pendingOverwrite) return;
    const result = signup(pendingOverwrite.name, pendingOverwrite.email, true);
    if (result.success) {
      setFeedback({
        type: "success",
        text: `Account overwritten. Welcome to Bibble, ${pendingOverwrite.name}! You're signed in.`,
      });
      setPendingOverwrite(null);
      setNameInput("");
      setEmailInput("");
    } else if (result.error) {
      setFeedback({ type: "error", text: result.error });
      setPendingOverwrite(null);
    }
  }

  function handleCancelOverwrite() {
    setPendingOverwrite(null);
    setFeedback(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className="brand">
          <span className="brand-mark">🍓</span>
          <span>Bibble</span>
        </Link>
        <Link href="/" className={styles.back}>
          Keep browsing <ArrowRight size={15} />
        </Link>
      </header>

      <section className={styles.shell} aria-labelledby="auth-title">
        <span className={`eyebrow ${styles.eyebrow}`}>
          <Sparkles size={14} /> Your little learning corner
        </span>
        <h1 id="auth-title" className={styles.title}>
          {isSignup ? "Make it yours." : "Welcome back."}
        </h1>
        <p className={styles.copy}>
          {isSignup
            ? "Create an account to keep your Bibble identity close. You can still browse every sample map and study room without one."
            : "Log in to your local Bibble account. Browsing, previews, and map-making are always open."}
        </p>

        {isLoaded && session && (
          <div className={styles.activeSessionBanner} role="status">
            <div className={styles.activeSessionInfo}>
              <span className={styles.activeSessionAvatar} aria-hidden="true">
                {session.name ? session.name.charAt(0).toUpperCase() : "🍓"}
              </span>
              <div className={styles.activeSessionText}>
                <span className={styles.activeSessionName}>
                  Signed in as {session.name}
                </span>
                <span className={styles.activeSessionEmail}>{session.email}</span>
              </div>
            </div>
            <div className={styles.activeSessionActions}>
              <Link href="/explore" className={styles.activeSessionBtn}>
                <Compass size={13} /> Explore maps
              </Link>
              <button
                type="button"
                onClick={logout}
                className={styles.activeSessionBtn}
              >
                <LogOut size={13} /> Log out
              </button>
            </div>
          </div>
        )}

        {pendingOverwrite && (
          <div className={styles.overwriteCard} role="alert">
            <div className={styles.overwriteTitle}>
              <AlertTriangle size={16} /> Existing Account Found
            </div>
            <p className={styles.overwriteText}>
              An account for <strong>{pendingOverwrite.existingAccount.name}</strong> (
              {pendingOverwrite.existingAccount.email}) already exists on this browser.
              Signing up will overwrite this saved account.
            </p>
            <div className={styles.overwriteActions}>
              <button
                type="button"
                onClick={handleConfirmOverwrite}
                className={styles.btnConfirmOverwrite}
              >
                Yes, replace account
              </button>
              <button
                type="button"
                onClick={handleCancelOverwrite}
                className={styles.btnCancelOverwrite}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className={styles.field}>
              <label htmlFor="name">Name (max 50 characters)</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={50}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Maya"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={100}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. maya@example.com"
            />
          </div>

          <button className={styles.submit} type="submit">
            {isSignup ? "Create account" : "Log in"} <ArrowRight size={16} />
          </button>

          {feedback && (
            <div
              className={
                feedback.type === "error"
                  ? styles.messageError
                  : feedback.type === "success"
                  ? styles.messageSuccess
                  : styles.message
              }
              role={feedback.type === "error" ? "alert" : "status"}
            >
              {feedback.type === "success" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, marginBottom: 4 }}>
                  <CheckCircle2 size={16} color="var(--primary)" /> Signed in successfully
                </div>
              )}
              <p style={{ margin: 0 }}>{feedback.text}</p>
              {feedback.type === "success" && (
                <div className={styles.successActions}>
                  <Link href="/explore" className={styles.successLink}>
                    Explore learning maps &rarr;
                  </Link>
                  <Link href="/rooms" className={styles.successLink}>
                    Browse study rooms &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}
        </form>

        <p className={styles.switch}>
          {isSignup ? (
            <>
              Already have an account? <Link href="/login">Log in</Link>
            </>
          ) : (
            <>
              New here? <Link href="/signup">Create an account</Link>
            </>
          )}
        </p>

        <p className={styles.note}>
          This simple project demo stores account details locally in this browser; it
          is not a secure production authentication system.
        </p>
      </section>
    </main>
  );
}
