"use client";

import type { StudyRoom } from "@/types/room";
import { Check, MessageCircle, Send, Sparkles, Users } from "lucide-react";

interface StudyRoomSidebarProps {
  room: StudyRoom;
  joined: boolean;
  notes: string[];
  noteInput: string;
  initialPeople: string[];
  onToggleJoin: () => void;
  onNoteInputChange: (val: string) => void;
  onAddNote: (e: React.FormEvent) => void;
}

export function StudyRoomSidebar({
  room,
  joined,
  notes,
  noteInput,
  initialPeople,
  onToggleJoin,
  onNoteInputChange,
  onAddNote,
}: StudyRoomSidebarProps) {
  const occupied = room.participants + (joined ? 1 : 0);
  const isFull = !joined && occupied >= room.capacity;

  return (
    <aside className="room-sidebar">
      <div className="room-side-section">
        <div className="room-side-title">
          <span>
            <Users size={15} /> Around the table
          </span>
          <span>
            {occupied}/{room.capacity} seats
          </span>
        </div>
        <div className="people-list">
          {initialPeople.map((person, index) => (
            <div className="person-row" key={`${person}-${index}`}>
              <span className={`person-avatar person-avatar-${index % 4}`}>{person[0]}</span>
              <span>{person}</span>
              {index === 0 && <small className="badge-host">host</small>}
              {index > 0 && index <= 2 && <Check size={14} className="check-icon" />}
            </div>
          ))}
          {joined && (
            <div className="person-row">
              <span className="person-avatar person-avatar-you">Y</span>
              <span>You</span>
              <small className="badge-you">here</small>
            </div>
          )}
        </div>
        <button
          className={`join-room-button ${joined ? "joined-room" : ""} ${isFull ? "room-full-button" : ""}`}
          onClick={onToggleJoin}
          disabled={isFull}
          aria-disabled={isFull}
        >
          {joined ? (
            <>
              <Check size={16} /> You are at the table
            </>
          ) : isFull ? (
            <>
              <Users size={16} /> Room is full ({room.capacity}/{room.capacity})
            </>
          ) : (
            <>
              <Users size={16} /> Take a seat
            </>
          )}
        </button>
      </div>

      <div className="room-side-section room-prompt">
        <div className="room-side-title">
          <span>
            <Sparkles size={15} /> Gentle prompt
          </span>
        </div>
        <p>What is one tiny thing you want to understand before you leave?</p>
      </div>

      <div className="room-side-section room-notes">
        <div className="room-side-title">
          <span>
            <MessageCircle size={15} /> Room notes
          </span>
          <small className="room-notes-saved-label">Saved locally</small>
        </div>
        <div className="room-note-list">
          {notes.map((item, idx) => (
            <div className="room-note" key={`${item}-${idx}`}>
              {item}
            </div>
          ))}
        </div>
        <form className="room-note-form" onSubmit={onAddNote}>
          <input
            value={noteInput}
            onChange={(e) => onNoteInputChange(e.target.value)}
            placeholder="Leave a small note (saved to browser)..."
            aria-label="Leave a room note"
          />
          <button aria-label="Send room note">
            <Send size={15} />
          </button>
        </form>
      </div>
    </aside>
  );
}
