"use client";

import { Clock3, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface FocusTimerPanelProps {
  minutes: number;
  formattedTime: string;
  active: boolean;
  isCompleted?: boolean;
  onToggleActive: () => void;
  onReset?: () => void;
}

export function FocusTimerPanel({
  minutes,
  formattedTime,
  active,
  isCompleted = false,
  onToggleActive,
  onReset,
}: FocusTimerPanelProps) {
  return (
    <div className={`focus-panel ${isCompleted ? "focus-panel-completed" : ""}`}>
      <div className="focus-panel-heading">
        <span className="eyebrow">
          <Clock3 size={14} /> Room focus timer
        </span>
        <span>Session goal · {minutes} min</span>
      </div>
      <div className="focus-clock">
        <motion.span
          animate={{ scale: active ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: active ? Infinity : 0, duration: 2 }}
        >
          {formattedTime}
        </motion.span>
        <small>
          {isCompleted
            ? "🎉 Session complete! Wonderful focus."
            : active
            ? "✨ Focus timer running locally"
            : "Ready when you are"}
        </small>
      </div>
      <div className="focus-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button className="focus-button" onClick={onToggleActive}>
          {active ? (
            <>
              <Pause size={17} /> Pause focus
            </>
          ) : isCompleted ? (
            <>
              <Play size={17} /> Start new session
            </>
          ) : (
            <>
              <Play size={17} /> Start focus session
            </>
          )}
        </button>
        {onReset && (
          <button
            className="focus-reset-button"
            onClick={() => onReset?.()}
            title="Reset timer"
            aria-label="Reset focus timer"
            type="button"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
