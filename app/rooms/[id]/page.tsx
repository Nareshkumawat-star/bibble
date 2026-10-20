import type { Metadata } from "next";
import { StudyRoomShell } from "@/components/rooms/study-room-shell";
import { getStudyRoom } from "@/data/study-rooms";
import { notFound } from "next/navigation";

interface StudyRoomPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StudyRoomPageProps): Promise<Metadata> {
  const { id } = await params;
  const room = getStudyRoom(id);

  if (!room) {
    return {
      title: "Room Not Found",
      description: "The requested study room could not be found.",
    };
  }

  const roomTitle = `${room.name} (${room.topic})`;
  return {
    title: roomTitle,
    description: room.description || `Join ${room.name} to study ${room.topic} in a calm, cozy environment.`,
    openGraph: {
      title: `${roomTitle} | Bibble`,
      description: room.description || `Join ${room.name} to study ${room.topic} in a calm, cozy environment.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${roomTitle} | Bibble`,
      description: room.description || `Join ${room.name} to study ${room.topic} in a calm, cozy environment.`,
    },
  };
}

export default async function StudyRoomPage({ params }: StudyRoomPageProps) {
  const { id } = await params;
  const room = getStudyRoom(id);
  if (!room) notFound();
  return <StudyRoomShell room={room} />;
}

