"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { GalleryLoader } from "./GalleryLoader";
import { Artwork } from "@/data/artworks";

// Dynamically import Three.js scene to ensure pure client-side WebGL initialization
const GalleryThreeScene = dynamic(
  () => import("./GalleryThreeScene").then((mod) => mod.GalleryThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F7F6F2] flex items-center justify-center font-sans text-xs tracking-widest text-neutral-400">
        LOADING 3D EXHIBITION...
      </div>
    ),
  }
);

export const GalleryScene: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F7F6F2] select-none">
      {/* Intro Loader Animation */}
      <GalleryLoader onComplete={() => setLoaded(true)} />

      {/* Main 3D Two-Sided Curved Gallery Experience */}
      <div className={`w-full h-full transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <GalleryThreeScene />
      </div>
    </div>
  );
};
