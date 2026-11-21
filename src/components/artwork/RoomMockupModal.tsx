"use client";

import React from "react";
import Image from "next/image";
import { X, Maximize2 } from "lucide-react";
import { Artwork } from "@/data/artworks";

interface RoomMockupModalProps {
  artwork: Artwork;
  frame: "UNFRAMED" | "CLASSIC FRAME" | "FRAMED CANVAS";
  isOpen: boolean;
  onClose: () => void;
}

export const RoomMockupModal: React.FC<RoomMockupModalProps> = ({
  artwork,
  frame,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#1A1A1A] text-white w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl z-10 border border-neutral-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-widest text-gallery-accent uppercase">
              GALLERY ROOM VISUALIZATION
            </span>
            <span className="text-neutral-500">•</span>
            <span className="font-serif text-sm tracking-wide text-neutral-300">
              {artwork.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Room Scene Mockup */}
        <div className="relative w-full aspect-[16/10] bg-[#ECE8E1] overflow-hidden flex items-center justify-center">
          {/* Subtle room lighting and wall texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />

          {/* Floor plane */}
          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-[#DCD6CA] border-t border-[#CCC5B8]" />
          
          {/* Baseboard */}
          <div className="absolute bottom-[24.5%] inset-x-0 h-2 bg-[#FAF8F5] shadow-sm" />

          {/* Minimalist gallery bench on right */}
          <div className="absolute bottom-[10%] right-[10%] w-36 h-10 bg-[#3A322C] rounded-sm shadow-md pointer-events-none opacity-80" />

          {/* Hanging Artwork on Wall */}
          <div
            className={`relative transition-all duration-500 shadow-2xl ${
              frame === "CLASSIC FRAME"
                ? "p-4 bg-neutral-900 border-4 border-neutral-950"
                : frame === "FRAMED CANVAS"
                ? "p-2 bg-[#B89874] border-2 border-[#947454]"
                : "p-2 bg-white"
            }`}
            style={{
              width: "28%",
              aspectRatio: "3 / 4",
              marginBottom: "8%",
            }}
          >
            <div className="relative w-full h-full overflow-hidden bg-neutral-200">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
            {/* Cast shadow onto wall */}
            <div className="absolute -inset-2 -z-10 bg-black/25 blur-lg rounded-sm" />
          </div>

          {/* Scale reference label */}
          <div className="absolute bottom-4 left-6 font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
            SIMULATED INTERIOR SCALE: 1:10 • CEILING 3.2M
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#141414] flex justify-between items-center font-mono text-xs text-neutral-400">
          <div>SELECTED FORMAT: {frame}</div>
          <button
            onClick={onClose}
            className="text-white hover:text-gallery-accent transition-colors flex items-center gap-1.5"
          >
            <span>RETURN TO SPECIFICATIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
