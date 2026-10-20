"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFocusTimerOptions {
  onComplete?: () => void;
}

export function useFocusTimer(initialMinutes = 25, options?: UseFocusTimerOptions) {
  const [prevMinutes, setPrevMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [active, setActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(options?.onComplete);

  // Keep latest onComplete callback in ref
  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
  }, [options?.onComplete]);

  // Adjust state during render when initialMinutes changes (React documented pattern)
  if (prevMinutes !== initialMinutes) {
    setPrevMinutes(initialMinutes);
    if (!active && !isCompleted) {
      setSeconds(initialMinutes * 60);
    }
  }

  // Handle active countdown using absolute end timestamp to eliminate tab drift
  useEffect(() => {
    if (!active) {
      endTimeRef.current = null;
      return;
    }

    endTimeRef.current = Date.now() + seconds * 1000;

    const timer = window.setInterval(() => {
      if (!endTimeRef.current) return;
      const remainingMs = endTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingSec <= 0) {
        window.clearInterval(timer);
        endTimeRef.current = null;
        setSeconds(0);
        setActive(false);
        setIsCompleted(true);
        onCompleteRef.current?.();
      } else {
        setSeconds(remainingSec);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(
    (customMinutes?: number | unknown) => {
      const targetMins =
        typeof customMinutes === "number" && !isNaN(customMinutes)
          ? customMinutes
          : initialMinutes;
      setActive(false);
      setIsCompleted(false);
      setSeconds(targetMins * 60);
      endTimeRef.current = null;
    },
    [initialMinutes]
  );

  const toggleTimer = useCallback(() => {
    if (!active) {
      // If timer is at 0 or previously completed, restart with fresh duration
      if (seconds <= 0 || isCompleted) {
        setSeconds(initialMinutes * 60);
        setIsCompleted(false);
        endTimeRef.current = Date.now() + initialMinutes * 60 * 1000;
      }
      setActive(true);
    } else {
      setActive(false);
      endTimeRef.current = null;
    }
  }, [active, seconds, isCompleted, initialMinutes]);

  const minutesStr = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsStr = (seconds % 60).toString().padStart(2, "0");
  const formattedTime = `${minutesStr}:${secondsStr}`;

  return {
    seconds,
    active,
    isCompleted,
    formattedTime,
    minutesStr,
    secondsStr,
    toggleTimer,
    reset,
    setActive,
  };
}
