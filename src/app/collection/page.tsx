"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ARTWORKS, Artwork } from "@/data/artworks";
import { Footer } from "@/components/navigation/Footer";
import { formatPrice } from "@/lib/utils";
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowUpRight } from "lucide-react";

const CATEGORIES = ["ALL", "Contemporary", "Abstract", "Architectural", "Figurative", "Botanical"] as const;

export default function CollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "title">("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter((artwork) => {
      const matchesCategory =
        selectedCategory === "ALL" || artwork.category === selectedCategory;
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return parseInt(a.id) - parseInt(b.id);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-gallery-primary">
      {/* Header Banner */}
      <section className="pt-32 pb-14 px-6 md:px-16 max-w-7xl mx-auto border-b border-gallery-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gallery-primary" />
              <span>ARCHIVAL COLLECTION 2026</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-gallery-primary">
              All Works & Editions.
            </h1>
            <p className="text-xs sm:text-sm text-gallery-secondary mt-3 max-w-lg leading-relaxed font-light">
              Explore the entire curated portfolio of 12 distinct artistic visions, each produced in strictly limited, hand-numbered museum editions with Certificates of Authenticity.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-gallery-secondary">
            <div>
              <span className="text-gallery-primary font-medium">{filteredArtworks.length}</span> OF {ARTWORKS.length} WORKS
            </div>
            <div className="hidden sm:block text-gallery-muted">•</div>
            <div className="hidden sm:block">CURATED ORIGINALS</div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pt-6 border-t border-gallery-border/60">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-mono text-[11px]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 uppercase tracking-wider whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-gallery-primary text-white border-gallery-primary"
                    : "bg-white text-gallery-secondary border-gallery-border hover:border-gallery-primary hover:text-gallery-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Sort, View Modes */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 md:w-52">
              <input
                type="text"
                placeholder="SEARCH ARTIST OR WORK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gallery-border text-[11px] font-mono px-8 py-1.5 uppercase placeholder:text-gallery-muted focus:outline-none focus:border-gallery-primary text-gallery-primary"
              />
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gallery-muted" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gallery-border text-[11px] font-mono px-3 py-1.5 uppercase text-gallery-secondary focus:outline-none focus:border-gallery-primary"
            >
              <option value="default">INDEX (01 - 12)</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="title">TITLE: A TO Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-gallery-border bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-gallery-primary text-white" : "text-gallery-secondary hover:text-gallery-primary"}`}
                aria-label="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gallery-primary text-white" : "text-gallery-secondary hover:text-gallery-primary"}`}
                aria-label="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Artworks Showcase */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        {filteredArtworks.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="font-serif text-2xl text-gallery-secondary">No artworks match your selected filters</p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-gallery-primary hover:bg-gallery-primary hover:text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {filteredArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/artwork/${artwork.slug}`}
                className="group block space-y-4"
              >
                {/* Artwork Framing Card */}
                <div className="relative aspect-[3/4] bg-white p-3.5 border border-gallery-border/80 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="absolute bottom-1 right-2 font-mono text-[8px] text-neutral-400">
                    {artwork.id}/12
                  </span>
                </div>

                {/* Typography Metadata */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl text-gallery-primary group-hover:text-gallery-accent transition-colors font-normal">
                      {artwork.title}
                    </h3>
                    <span className="font-mono text-xs font-medium text-gallery-primary">
                      {formatPrice(artwork.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gallery-secondary font-mono text-[11px] uppercase tracking-wider">
                    <span>{artwork.artist}</span>
                    <span className="text-[10px] text-gallery-muted">{artwork.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="divide-y divide-gallery-border border-y border-gallery-border">
            {filteredArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/artwork/${artwork.slug}`}
                className="group py-5 flex items-center justify-between gap-6 hover:bg-white/60 px-4 transition-all"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs text-gallery-muted w-6">{artwork.id}</span>
                  <div className="relative w-14 h-18 aspect-[3/4] bg-white p-1 border border-gallery-border flex-shrink-0">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-gallery-primary group-hover:text-gallery-accent transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="font-mono text-xs text-gallery-secondary uppercase tracking-wider">
                      {artwork.artist} • {artwork.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 font-mono text-xs">
                  <span className="hidden md:inline uppercase text-gallery-secondary tracking-widest">{artwork.category}</span>
                  <span className="hidden sm:inline text-gallery-muted">{artwork.edition}</span>
                  <span className="font-medium text-gallery-primary min-w-[4rem] text-right">
                    {formatPrice(artwork.price)}
                  </span>
                  <ArrowUpRight size={16} className="text-gallery-muted group-hover:text-gallery-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
