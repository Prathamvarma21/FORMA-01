"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/data/artworks";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface RelatedArtworksProps {
  currentArtwork: Artwork;
  allArtworks: Artwork[];
}

export const RelatedArtworks: React.FC<RelatedArtworksProps> = ({
  currentArtwork,
  allArtworks,
}) => {
  // Find related artworks (same category first, then others)
  const related = allArtworks
    .filter((a) => a.id !== currentArtwork.id)
    .sort((a, b) => (a.category === currentArtwork.category ? -1 : 1))
    .slice(0, 3);

  return (
    <section className="mt-28 pt-16 border-t border-gallery-border/80">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary block mb-1">
            CURATED DIALOGUE
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-gallery-primary font-light">
            Related Exhibition Works
          </h3>
        </div>
        <Link
          href="/collection"
          className="group hidden sm:flex items-center gap-1.5 font-mono text-xs text-gallery-secondary hover:text-gallery-primary transition-colors tracking-widest uppercase"
        >
          <span>VIEW FULL ARCHIVE</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/artwork/${item.slug}`}
            className="group block space-y-4"
          >
            <div className="relative aspect-[3/4] bg-white p-3 border border-gallery-border/60 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <span className="absolute bottom-1 right-2 font-mono text-[8px] text-neutral-400">
                {item.id}/12
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <h4 className="font-serif text-lg text-gallery-primary group-hover:text-gallery-accent transition-colors">
                  {item.title}
                </h4>
                <p className="font-mono text-[11px] text-gallery-secondary uppercase tracking-wider">
                  {item.artist}
                </p>
              </div>
              <span className="font-mono text-xs text-gallery-primary">
                {formatPrice(item.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
