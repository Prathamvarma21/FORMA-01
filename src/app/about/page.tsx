import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/navigation/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Exhibition — FRAME / 01 (2026)",
  description: "Curatorial manifesto, architectural exhibition philosophy, and artistic direction for the 2026 contemporary collection.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-gallery-primary">
      {/* Editorial Hero Header */}
      <section className="pt-32 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gallery-accent" />
            <span>EXHIBITION ESSAY & CURATORIAL STATEMENT</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gallery-primary leading-[1.08]">
            Art Beyond The Frame: Spatial Architecture & Kinetic Memory.
          </h1>
          <p className="font-serif text-lg sm:text-2xl text-gallery-secondary font-light mt-6 leading-relaxed italic">
            &ldquo;When a painting enters space, the frame ceases to be a container and transforms into an open horizon.&rdquo;
          </p>
        </div>
      </section>

      {/* Large Panoramic Editorial Architecture Banner */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto mb-20">
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-neutral-200 border border-gallery-border shadow-lg">
          <Image
            src="/images/editorial/exhibition-cover.webp"
            alt="FRAME / 01 Exhibition Interior Architecture"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute bottom-4 left-6 font-mono text-[9px] uppercase tracking-widest text-neutral-300 bg-black/40 backdrop-blur-sm px-2.5 py-1">
            VIRTUAL PAVILION • ARCHITECTURAL STUDY 2026
          </div>
        </div>
      </section>

      {/* Curatorial Essay Content Grid */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto pb-24 border-b border-gallery-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Thesis & Principles */}
          <div className="lg:col-span-7 space-y-8 font-light text-sm sm:text-base text-neutral-800 leading-relaxed">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary block mb-2">
                01. THE CONCEPT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-gallery-primary mb-4">
                Dissolving the Virtual Threshold
              </h2>
              <p>
                Founded in 2026, <strong>FRAME / 01</strong> is an experimental digital exhibition platform and publishing salon conceived to bridge the tactile reverence of classical European art pavilions with responsive three-dimensional web spatial design.
              </p>
              <p className="mt-3">
                Rather than treating artworks as static thumbnail grids or consumable commerce units, each piece in the exhibition is anchored along a continuous cylindrical perspective arc. Artworks command physical weight, negative space, and architectural dignity.
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary block mb-2">
                02. MATERIAL INTEGRITY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-gallery-primary mb-4">
                From Screen to Archival Paper
              </h2>
              <p>
                Every visual in our collection originates as an original contemporary composition, and translates into museum-grade physical editions. We collaborate exclusively with master printmakers utilizing 12-color archival pigment inks on 310gsm German etching and hand-torn Japanese Washi papers.
              </p>
              <p className="mt-3">
                Our editions are produced in strictly verified runs of 15 to 60 copies worldwide. Once an edition is exhausted, the plates and digital masters are sealed, ensuring enduring rarity for collectors.
              </p>
            </div>
          </div>

          {/* Right Column: Curator Profile & Statistics */}
          <div className="lg:col-span-5 space-y-8">
            {/* Curator Portrait Card */}
            <div className="bg-white p-6 border border-gallery-border shadow-sm space-y-5">
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100 border border-gallery-border/60">
                <Image
                  src="/images/artists/artist-portrait.webp"
                  alt="Lead Curator in Art Studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gallery-accent">
                  LEAD CURATOR & ARCHITECT
                </div>
                <h3 className="font-serif text-2xl text-gallery-primary font-normal mt-0.5">
                  Kaelen Voss
                </h3>
                <p className="text-xs text-gallery-secondary mt-2 leading-relaxed">
                  Educated at the Architectural Association London and the Bauhaus Dessau Foundation, Voss examines the perceptual intersections between generative computing, printmaking history, and digital exhibition spaces.
                </p>
              </div>

              <div className="pt-4 border-t border-gallery-border flex justify-between font-mono text-[11px] text-gallery-secondary">
                <span>PARIS / LONDON</span>
                <span className="text-gallery-primary">CURATORIAL BOARD</span>
              </div>
            </div>

            {/* Key Exhibition Metrics */}
            <div className="bg-[#FAF9F5] p-6 border border-gallery-border space-y-4 font-mono text-xs">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gallery-secondary">
                EXHIBITION DOSSIER
              </div>
              <div className="divide-y divide-gallery-border/80">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gallery-secondary">INAUGURATION</span>
                  <span className="text-gallery-primary font-medium">NOVEMBER 2026</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gallery-secondary">INVITED ARTISTS</span>
                  <span className="text-gallery-primary font-medium">9 COLLABORATORS</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gallery-secondary">NATIONALITIES</span>
                  <span className="text-gallery-primary font-medium">8 COUNTRIES</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gallery-secondary">TOTAL EDITIONS</span>
                  <span className="text-gallery-primary font-medium">12 ORIGINAL WORKS</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gallery-secondary">PRINT PARTNER</span>
                  <span className="text-gallery-primary font-medium">HAHNEMÜHLE CERTIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Explore */}
        <div className="mt-16 pt-12 border-t border-gallery-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h4 className="font-serif text-2xl text-gallery-primary">Experience the Perspective Space</h4>
            <p className="text-xs font-mono text-gallery-secondary uppercase tracking-wider mt-1">
              Scroll through the continuous curved 3D exhibition gallery
            </p>
          </div>
          <Link
            href="/"
            className="px-8 py-3.5 bg-gallery-primary text-white font-mono text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2 group"
          >
            <span>ENTER 3D GALLERY</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
