"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BIBBLE_ACCOUNT_KEY,
  BIBBLE_AUTH_CHANGE_EVENT,
  BIBBLE_SESSION_KEY,
  type BibbleAccount,
  type BibbleSession,
} from "@/types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getSavedAccount(): BibbleAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BIBBLE_ACCOUNT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        name: parsed.name.trim(),
        email: parsed.email.trim().toLowerCase(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSavedSession(): BibbleSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BIBBLE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        name: parsed.name.trim(),
        email: parsed.email.trim().toLowerCase(),
        signedInAt:
          typeof parsed.signedInAt === "number" ? parsed.signedInAt : Date.now(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function broadcastAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BIBBLE_AUTH_CHANGE_EVENT));
  }
}

export function useAuth() {
  const [session, setSession] = useState<BibbleSession | null>(null);
  const [account, setAccount] = useState<BibbleAccount | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSession(getSavedSession());
      setAccount(getSavedAccount());
      setIsLoaded(true);
    };

    const rafId = requestAnimationFrame(sync);

    window.addEventListener(BIBBLE_AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener(BIBBLE_AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    const saved = getSavedAccount();
    if (!saved || saved.email !== email) {
      return {
        success: false,
        error: "No local account matches that email. You can sign up in a moment.",
      };
    }

    try {
      const newSession: BibbleSession = {
        name: saved.name,
        email: saved.email,
        signedInAt: Date.now(),
      };
      window.localStorage.setItem(
        BIBBLE_SESSION_KEY,
        JSON.stringify(newSession)
      );
      setSession(newSession);
      broadcastAuthChange();
      return { success: true, account: saved };
    } catch {
      return {
        success: false,
        error: "Unable to save session to local storage.",
      };
    }
  }, []);

  const signup = useCallback(
    (rawName: string, rawEmail: string, forceOverwrite = false) => {
      const name = rawName.trim();
      const email = rawEmail.trim().toLowerCase();

      if (!name || name.length > 50) {
        return {
          success: false,
          error: "Please provide a name between 1 and 50 characters.",
        };
      }

      if (!email || !EMAIL_REGEX.test(email)) {
        return {
          success: false,
          error: "Please enter a valid email address.",
        };
      }

      const existing = getSavedAccount();
      if (existing && !forceOverwrite && existing.email !== email) {
        return {
          success: false,
          requiresOverwriteConfirmation: true,
          existingAccount: existing,
        };
      }

      try {
        const newAccount: BibbleAccount = { name, email };
        const newSession: BibbleSession = {
          name,
          email,
          signedInAt: Date.now(),
        };

        window.localStorage.setItem(
          BIBBLE_ACCOUNT_KEY,
          JSON.stringify(newAccount)
        );
        window.localStorage.setItem(
          BIBBLE_SESSION_KEY,
          JSON.stringify(newSession)
        );
        setAccount(newAccount);
        setSession(newSession);
        broadcastAuthChange();
        return { success: true, account: newAccount };
      } catch {
        return {
          success: false,
          error: "Unable to save account to local storage.",
        };
      }
    },
    []
  );

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(BIBBLE_SESSION_KEY);
    } finally {
      setSession(null);
      broadcastAuthChange();
    }
  }, []);

  return {
    session,
    account,
    isLoaded,
    login,
    signup,
    logout,
  };
}
