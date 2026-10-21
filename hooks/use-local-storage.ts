"use client";

import {
  useCallback,
  useSyncExternalStore,
} from "react";

type Listener = () => void;

interface CacheEntry<T> {
  raw: string | null;
  value: T;
  hasValue: boolean;
  initialValueRef?: T;
}

interface ServerCacheEntry<T> {
  serialized: string;
  value: T;
}

const listenersByKey = new Map<string, Set<Listener>>();
const memoryCache = new Map<string, CacheEntry<unknown>>();
const serverCache = new Map<string, ServerCacheEntry<unknown>>();

const LOCAL_STORAGE_CHANGE_EVENT = "bibble-local-storage";

function safeSerialize<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function notify(key: string) {
  const listeners = listenersByKey.get(key);
  if (listeners) {
    listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error(`[useLocalStorage] Listener error for key "${key}":`, err);
      }
    });
  }

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } })
      );
    } catch {
      // Ignore in environments where CustomEvent dispatch might fail
    }
  }
}

// Global storage event listeners for cross-tab sync and custom in-window sync
if (typeof window !== "undefined") {
  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea && event.storageArea !== window.localStorage) return;
    if (event.key) {
      const listeners = listenersByKey.get(event.key);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener();
          } catch (err) {
            console.error("[useLocalStorage] Storage event listener error:", err);
          }
        });
      }
    } else {
      // event.key is null on localStorage.clear()
      listenersByKey.forEach((listeners) => {
        listeners.forEach((listener) => {
          try {
            listener();
          } catch (err) {
            console.error("[useLocalStorage] Storage clear listener error:", err);
          }
        });
      });
    }
  };

  const handleCustomSync = (event: Event) => {
    const customEvent = event as CustomEvent<{ key?: string }>;
    const key = customEvent.detail?.key;
    if (key) {
      const listeners = listenersByKey.get(key);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener();
          } catch (err) {
            console.error("[useLocalStorage] Custom sync listener error:", err);
          }
        });
      }
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleCustomSync);
}

function subscribeToKey(key: string, listener: Listener): () => void {
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set<Listener>();
    listenersByKey.set(key, listeners);
  }
  listeners.add(listener);

  return () => {
    const set = listenersByKey.get(key);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        listenersByKey.delete(key);
      }
    }
  };
}

function getSnapshot<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch (error) {
    console.error(`[useLocalStorage] Failed to read key "${key}" from localStorage:`, error);
  }

  const cached = memoryCache.get(key) as CacheEntry<T> | undefined;

  // If localStorage still has the exact same raw string and we have a cached value, return cached reference
  if (cached && cached.hasValue && cached.raw === raw) {
    return cached.value;
  }

  if (raw === null) {
    // Key not found in localStorage: use initialValue
    if (cached && cached.raw === null && cached.hasValue) {
      if (
        cached.initialValueRef === initialValue ||
        safeSerialize(cached.initialValueRef) === safeSerialize(initialValue)
      ) {
        return cached.value;
      }
    }

    const entry: CacheEntry<T> = {
      raw: null,
      value: initialValue,
      hasValue: true,
      initialValueRef: initialValue,
    };
    memoryCache.set(key, entry as CacheEntry<unknown>);
    return initialValue;
  }

  // Parse raw value
  try {
    const parsed = JSON.parse(raw) as T;
    const entry: CacheEntry<T> = {
      raw,
      value: parsed,
      hasValue: true,
    };
    memoryCache.set(key, entry as CacheEntry<unknown>);
    return parsed;
  } catch (parseError) {
    // CRITICAL: Stop deleting the key on parse error!
    // Log the error and keep the raw value in localStorage intact.
    console.error(`[useLocalStorage] Failed to parse JSON for key "${key}":`, parseError);
    const fallback = cached && cached.hasValue ? cached.value : initialValue;
    const entry: CacheEntry<T> = {
      raw,
      value: fallback,
      hasValue: true,
    };
    memoryCache.set(key, entry as CacheEntry<unknown>);
    return fallback;
  }
}

function getServerSnapshot<T>(key: string, initialValue: T): T {
  const serialized = safeSerialize(initialValue);
  const cached = serverCache.get(key) as ServerCacheEntry<T> | undefined;

  if (cached && cached.serialized === serialized) {
    return cached.value;
  }

  const entry: ServerCacheEntry<T> = {
    serialized,
    value: initialValue,
  };
  serverCache.set(key, entry as ServerCacheEntry<unknown>);
  return initialValue;
}

const emptySubscribe = () => () => {};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToKey(key, onStoreChange),
    [key]
  );

  const getClientSnapshot = useCallback(
    () => getSnapshot<T>(key, initialValue),
    [key, initialValue]
  );

  const getSnapshotServer = useCallback(
    () => getServerSnapshot<T>(key, initialValue),
    [key, initialValue]
  );

  const value = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getSnapshotServer
  );

  const setValue = useCallback(
    (action: React.SetStateAction<T>) => {
      if (typeof window === "undefined") {
        console.warn(`[useLocalStorage] Cannot set localStorage key "${key}" during SSR.`);
        return;
      }

      try {
        // Read the most up-to-date raw value from localStorage so concurrent tab writes are preserved
        let current: T;
        try {
          const freshRaw = window.localStorage.getItem(key);
          if (freshRaw !== null) {
            current = JSON.parse(freshRaw) as T;
          } else {
            current = getSnapshot<T>(key, initialValue);
          }
        } catch {
          current = getSnapshot<T>(key, initialValue);
        }

        const nextValue =
          typeof action === "function"
            ? (action as (prevState: T) => T)(current)
            : action;

        const serialized = JSON.stringify(nextValue);

        // Wrap setItem in try/catch to protect against storage quota or permissions errors
        try {
          window.localStorage.setItem(key, serialized);
        } catch (storageError) {
          console.error(
            `[useLocalStorage] Failed to set localStorage key "${key}":`,
            storageError
          );
        }

        // Update in-memory cache
        const entry: CacheEntry<T> = {
          raw: serialized,
          value: nextValue,
          hasValue: true,
        };
        memoryCache.set(key, entry as CacheEntry<unknown>);

        // Notify all subscribers in the current window
        notify(key);
      } catch (error) {
        console.error(
          `[useLocalStorage] Error while updating key "${key}":`,
          error
        );
      }
    },
    [key, initialValue]
  );

  return [value, setValue, hydrated] as const;
}

