"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Artwork } from "@/data/artworks";

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  isActive: boolean;
  transformStyle: React.CSSProperties;
  onSelect: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  index,
  isActive,
  transformStyle,
  onSelect,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(artwork);
    router.push(`/artwork/${artwork.slug}`);
  };

  return (
    <div
      data-artwork-card
      onClick={handleClick}
      style={transformStyle}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none transition-shadow duration-500 will-change-transform ${
        isActive ? "z-30 pointer-events-auto" : "pointer-events-auto z-10"
      }`}
    >
      <div className="group relative flex flex-col items-center">
        {/* Floating Framed Canvas */}
        <div
          className={`relative w-[240px] h-[320px] sm:w-[280px] sm:h-[373px] md:w-[330px] md:h-[440px] lg:w-[360px] lg:h-[480px] bg-white p-2.5 sm:p-3 transition-all duration-500 ease-out ${
            isActive
              ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] ring-1 ring-black/5"
              : "shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] opacity-85 hover:opacity-100 group-hover:scale-[1.02]"
          }`}
        >
          {/* Artwork Image Container */}
          <div className="relative w-full h-full overflow-hidden bg-neutral-100">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 330px, 360px"
              priority={index < 3}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Subtle paper reflection highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
          </div>

          {/* Tiny exhibition edition mark */}
          <div className="absolute bottom-1 right-2 font-mono text-[8px] text-neutral-400 tracking-wider">
            {artwork.id}/12
          </div>
        </div>

        {/* Minimal artwork label under the painting (as seen in Reference Image 2) */}
        <div
          className={`mt-4 sm:mt-5 text-center transition-all duration-500 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-40 group-hover:opacity-100"
          }`}
        >
          <div className="font-serif text-sm sm:text-base text-gallery-primary tracking-wide">
            {artwork.artist}
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-gallery-secondary tracking-widest uppercase mt-0.5">
            {artwork.location}
          </div>
        </div>

        {/* Subtle drop shadow plane on virtual floor */}
        <div
          className={`w-3/4 h-4 mx-auto mt-2 rounded-full bg-black/10 blur-md transition-opacity duration-500 ${
            isActive ? "opacity-70 scale-100" : "opacity-30 scale-75"
          }`}
        />
      </div>
    </div>
  );
};
