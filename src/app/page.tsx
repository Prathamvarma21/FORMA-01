import React from "react";
import { GalleryScene } from "@/components/gallery/GalleryScene";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FRAME / 01 — 3D Perspective Digital Art Exhibition 2026",
  description: "An immersive, horizontal, perspective-based 3D digital art gallery and artwork showcase featuring limited contemporary editions.",
};

export default function HomePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#F7F6F2]">
      <GalleryScene />
    </main>
  );
}
