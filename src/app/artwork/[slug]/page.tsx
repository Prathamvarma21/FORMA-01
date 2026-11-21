import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ARTWORKS } from "@/data/artworks";
import { ArtworkDetails } from "@/components/artwork/ArtworkDetails";
import { Footer } from "@/components/navigation/Footer";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return ARTWORKS.map((artwork) => ({
    slug: artwork.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artwork = ARTWORKS.find((a) => a.slug === params.slug);
  if (!artwork) return { title: "Artwork Not Found | FRAME / 01" };

  return {
    title: `${artwork.title} — ${artwork.artist} | FRAME / 01 Exhibition 2026`,
    description: artwork.description,
    openGraph: {
      title: `${artwork.title} by ${artwork.artist}`,
      description: artwork.description,
      images: [{ url: artwork.image }],
    },
  };
}

export default function ArtworkPage({ params }: PageProps) {
  const artwork = ARTWORKS.find((a) => a.slug === params.slug);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2]">
      <ArtworkDetails artwork={artwork} />
      <Footer />
    </main>
  );
}
