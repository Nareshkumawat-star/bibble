"use client";

import { AmbientSound, type Soundscape } from "@/components/rooms/ambient-sound";
import { FocusTimerPanel } from "@/components/rooms/focus-timer-panel";
import { StudyRoomScene } from "@/components/rooms/study-room-scene";
import { StudyRoomSidebar } from "@/components/rooms/study-room-sidebar";
import { ThemePicker } from "@/components/ui/theme-picker";
import { useFocusTimer } from "@/hooks/use-focus-timer";
import { useTheme } from "@/hooks/use-theme";
import type { StudyRoom } from "@/types/room";
import { ArrowLeft, Bell, Headphones, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const initialPeople = ["Mina", "Noah", "Leah", "Ari"];

function playGentleChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.2);
    });
  } catch {}
}

export function StudyRoomShell({ room }: { room: StudyRoom }) {
  const { motif } = useTheme();

  const handleSessionComplete = () => {
    triggerToast("🎉 Focus session complete! Time to stretch and rest. 🍵");
    playGentleChime();
  };

  const {
    active,
    isCompleted,
    formattedTime,
    toggleTimer,
    reset: resetTimer,
  } = useFocusTimer(room.minutes, { onComplete: handleSessionComplete });

  const [joined, setJoined] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    "Finish one small thing before the timer ends.",
    "No need to rush. Showing up counts.",
  ]);
  const [soundscape, setSoundscape] = useState<Soundscape>("off");
  const [lampOn, setLampOn] = useState(true);
  const [catHearts, setCatHearts] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const petCat = () => {
    setCatHearts((prev) => prev + 1);
    triggerToast(`Purrrr... Mochi the study cat wearing ${motif.catAccessory} feels loved! 🐱💖`);
  };

  const sipTea = () => {
    triggerToast(motif.sipToast);
  };

  const toggleLamp = () => {
    setLampOn((v) => !v);
    triggerToast(!lampOn ? "Warm desk lamp turned on 💡" : "Desk lamp dimmed 🌙");
  };

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (note.trim()) {
      setNotes((current) => [...current, note.trim()]);
      setNote("");
      triggerToast("Note added to the room board 📝");
    }
  };

  return (
    <main className="room-page">
      <header className="room-header">
        <Link href="/rooms" className="back-link">
          <ArrowLeft size={15} /> All rooms
        </Link>
        <Link href="/" className="brand">
          <span className="brand-mark">{motif.brandEmoji}</span>
          <span>Bibble</span>
        </Link>
        <div className="room-header-actions">
          <ThemePicker compact />
          <button className="room-icon-button" aria-label="Room notifications">
            <Bell size={17} />
          </button>
        </div>
      </header>

      {toastMessage && (
        <motion.div
          className="cozy-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Sparkles size={15} /> {toastMessage}
        </motion.div>
      )}

      <div className="room-layout">
        <section className="room-main">
          {/* Interactive 2D Roomscape Scene */}
          <StudyRoomScene
            room={room}
            soundscape={soundscape}
            lampOn={lampOn}
            catHearts={catHearts}
            onPetCat={petCat}
            onSipTea={sipTea}
            onToggleLamp={toggleLamp}
          />

          <div className="room-title-row">
            <div>
              <span className="eyebrow">
                <Headphones size={14} /> {room.topic}
              </span>
              <h1>{room.name}</h1>
              <p>{room.description}</p>
            </div>
            <div className="room-live-count">
              <Users size={16} />
              <strong>{room.participants + (joined ? 1 : 0)}</strong>
              <span>studying now</span>
            </div>
          </div>

          {/* Soundscape Controls */}
          <div className="room-sound-container">
            <AmbientSound onSoundscapeChange={(s) => setSoundscape(s)} />
          </div>

          {/* Focus Timer Panel */}
          <FocusTimerPanel
            minutes={room.minutes}
            formattedTime={formattedTime}
            active={active}
            isCompleted={isCompleted}
            onToggleActive={toggleTimer}
            onReset={resetTimer}
          />
        </section>

        {/* Room Sidebar */}
        <StudyRoomSidebar
          room={room}
          joined={joined}
          notes={notes}
          noteInput={note}
          initialPeople={initialPeople}
          onToggleJoin={() => {
            const nextJoined = !joined;
            setJoined(nextJoined);
            triggerToast(nextJoined ? "You joined the table! 🍵" : "You stepped away.");
          }}
          onNoteInputChange={setNote}
          onAddNote={handleAddNote}
        />
      </div>
    </main>
  );
}
