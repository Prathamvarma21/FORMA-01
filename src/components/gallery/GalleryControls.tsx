"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Artwork } from "@/data/artworks";

interface GalleryControlsProps {
  currentArtwork: Artwork;
  currentIndex: number;
  totalArtworks: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  currentArtwork,
  currentIndex,
  totalArtworks,
  onPrev,
  onNext,
  onSelectIndex,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 pointer-events-none px-6 md:px-12 pb-6 md:pb-8 flex flex-col justify-end">
      {/* Bottom Center Active Artwork Title & CTA (Reference Images 2 & 3) */}
      <div className="text-center pointer-events-auto mb-6 md:mb-8 transition-all duration-500">
        <div className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gallery-secondary mb-1">
          YOU ARE VIEWING
        </div>
        <Link
          href={`/artwork/${currentArtwork.slug}`}
          className="group inline-flex flex-col items-center"
        >
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-wide text-gallery-primary group-hover:text-gallery-accent transition-colors">
            {currentArtwork.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gallery-secondary group-hover:text-gallery-primary transition-colors">
            <span>ENTER THE COLLECTION</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Bottom Bar: Left info, Center pagination dots, Right controls */}
      <div className="flex items-center justify-between w-full border-t border-gallery-border/60 pt-4">
        {/* Left Stats */}
        <div className="flex items-center gap-4 font-mono text-[10px] md:text-xs text-gallery-secondary tracking-widest uppercase">
          <span>{totalArtworks} ARTWORKS / 01 EXHIBITION</span>
          <span className="hidden sm:inline text-gallery-muted">•</span>
          <span className="hidden sm:inline">INDEX {currentArtwork.id} — {totalArtworks.toString().padStart(2, "0")}</span>
        </div>

        {/* Center Progress Pips (Interactive) */}
        <div className="hidden lg:flex items-center gap-1.5 pointer-events-auto">
          {Array.from({ length: totalArtworks }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`h-1 transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 bg-gallery-primary"
                  : "w-2 bg-gallery-border hover:bg-gallery-secondary"
              }`}
              aria-label={`Go to artwork ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Arrows & Gesture Guide (Reference Image 2 & 3) */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="hidden xl:flex flex-col text-right font-mono text-[9px] text-gallery-secondary tracking-wider uppercase leading-tight">
            <span>SCROLL OR DRAG TO EXPLORE</span>
            <span className="text-gallery-muted">CLICK TO LOOK CLOSER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gallery-border hover:border-gallery-primary hover:bg-gallery-primary hover:text-white transition-all duration-300 flex items-center justify-center text-gallery-primary"
              aria-label="Previous artwork"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNext}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gallery-border hover:border-gallery-primary hover:bg-gallery-primary hover:text-white transition-all duration-300 flex items-center justify-center text-gallery-primary"
              aria-label="Next artwork"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
