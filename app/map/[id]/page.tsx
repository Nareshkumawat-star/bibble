import type { Metadata } from "next";
import { LearningMapCanvas } from "@/components/map/learning-map";
import { getMapById, getMapProgress } from "@/data/sample-maps";
import { ArrowLeft, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MapPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { id } = await params;
  const map = getMapById(id);

  if (!map) {
    return {
      title: "Map Not Found",
      description: "The requested learning map could not be found.",
    };
  }

  return {
    title: map.title,
    description: map.description,
    openGraph: {
      title: `${map.title} | Bibble`,
      description: map.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${map.title} | Bibble`,
      description: map.description,
    },
  };
}

export default async function MapPage({ params }: MapPageProps) {
  const { id } = await params;
  const map = getMapById(id);
  if (!map) notFound();
  return (
    <main className="map-page">
      <header className="map-page-header">
        <Link href="/explore" className="brand">
          <span className="brand-mark-emoji">🍓</span>
          <span>Bibble</span>
        </Link>
        <div className="map-page-title">
          <span className="eyebrow">
            {map.category} <Sparkles size={13} />
          </span>
          <h1>{map.title}</h1>
        </div>
        <Link href={`/map/${map.id}/edit`} className="header-action">
          <Pencil size={15} /> Edit map
        </Link>
      </header>
      <div className="map-page-copy">
        <Link href="/explore" className="back-link">
          <ArrowLeft size={15} /> All maps
        </Link>
        <p>{map.description}</p>
        <span>
          {getMapProgress(map)}% grown · {map.bibbles.length} bibbles
        </span>
      </div>
      <LearningMapCanvas initialMap={map} />
    </main>
  );
}

