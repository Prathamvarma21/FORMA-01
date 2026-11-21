"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Box, Bookmark, Check, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { Artwork, ARTWORKS } from "@/data/artworks";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { RoomMockupModal } from "./RoomMockupModal";
import { RelatedArtworks } from "./RelatedArtworks";

interface ArtworkDetailsProps {
  artwork: Artwork;
}

type SizeKey = "A3" | "A2" | "A1" | "A0";

const SIZE_MODIFIERS: Record<SizeKey, { label: string; price: number; dim: string }> = {
  A3: { label: "11.7 × 16.5\" (A3)", price: 0, dim: "297 × 420 mm" },
  A2: { label: "16.5 × 23.4\" (A2)", price: 25, dim: "420 × 594 mm" },
  A1: { label: "22.4 × 33.1\" (A1)", price: 55, dim: "594 × 841 mm" },
  A0: { label: "33.1 × 46.8\" (A0)", price: 95, dim: "841 × 1189 mm" },
};

const FRAME_OPTIONS: { id: "UNFRAMED" | "CLASSIC FRAME" | "FRAMED CANVAS"; label: string; price: number; desc: string }[] = [
  { id: "UNFRAMED", label: "UNFRAMED", price: 0, desc: "Archival paper print with 1.5\" protective white border" },
  { id: "CLASSIC FRAME", label: "CLASSIC FRAME", price: 65, desc: "Satin black sustainably harvested ash wood with UV-acrylic glass" },
  { id: "FRAMED CANVAS", label: "FRAMED CANVAS", price: 90, desc: "Stretched archival canvas in solid European natural oak float frame" },
];

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ artwork }) => {
  const { addToCart } = useCart();

  // Selected configuration state
  const [selectedPaper, setSelectedPaper] = useState(artwork.paperOptions[0].name);
  const [selectedSize, setSelectedSize] = useState<SizeKey>("A3");
  const [selectedSignature, setSelectedSignature] = useState<"UNSIGNED" | "SIGNED AND NUMBERED">("UNSIGNED");
  const [selectedFrame, setSelectedFrame] = useState<"UNFRAMED" | "CLASSIC FRAME" | "FRAMED CANVAS">("UNFRAMED");
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Dynamic price calculation
  const paperMod = artwork.paperOptions.find((p) => p.name === selectedPaper)?.priceModifier || 0;
  const sizeMod = SIZE_MODIFIERS[selectedSize].price;
  const sigMod = selectedSignature === "SIGNED AND NUMBERED" ? 35 : 0;
  const frameMod = FRAME_OPTIONS.find((f) => f.id === selectedFrame)?.price || 0;
  
  const unitPrice = artwork.price + paperMod + sizeMod + sigMod + frameMod;

  const handleAddToBag = () => {
    addToCart({
      artwork,
      size: selectedSize,
      paper: selectedPaper,
      signature: selectedSignature,
      frame: selectedFrame,
      quantity,
      unitPrice,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-gallery-primary pt-24 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gallery-secondary hover:text-gallery-primary transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO 3D GALLERY</span>
        </Link>
      </div>

      {/* Main Grid: Left Artwork Display | Right Configuration & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Large Interactive Artwork Presentation */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-xl mx-auto">
            {/* Visual Frame Simulation Wrapper */}
            <div
              className={`relative w-full aspect-[3/4] transition-all duration-500 shadow-2xl flex items-center justify-center ${
                selectedFrame === "CLASSIC FRAME"
                  ? "bg-[#0E0E0E] p-6 sm:p-8 border-8 border-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
                  : selectedFrame === "FRAMED CANVAS"
                  ? "bg-[#C2A383] p-4 sm:p-5 border-4 border-[#9E7B57] shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
                  : "bg-white p-3 sm:p-4 border border-gallery-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              }`}
            >
              {/* Inner matboard for classic frame */}
              <div
                className={`relative w-full h-full overflow-hidden transition-all duration-300 ${
                  selectedFrame === "CLASSIC FRAME" ? "p-3 sm:p-4 bg-[#FAF9F5] shadow-inner" : ""
                }`}
              >
                <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  {/* Subtle archival paper finish reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Floating Bar: 1/1, View in Room, Bookmark (Reference Image 4) */}
            <div className="mt-4 flex items-center justify-between text-gallery-secondary font-mono text-xs">
              <span className="tracking-widest">1/1</span>

              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gallery-border hover:border-gallery-primary hover:text-gallery-primary transition-all rounded-sm shadow-sm"
              >
                <Box size={14} className="text-gallery-accent" />
                <span className="tracking-wider uppercase text-[11px] font-medium">View In Room</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 transition-colors ${isSaved ? "text-gallery-accent" : "hover:text-gallery-primary"}`}
                aria-label="Save Artwork"
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Title, Options, Add to Bag (Reference Image 4) */}
        <div className="lg:col-span-5 space-y-7">
          {/* Header Info */}
          <div className="border-b border-gallery-border pb-6 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gallery-secondary">
              CURATED ORIGINALS • {artwork.category} PRINT
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-gallery-primary">
              {artwork.title}
            </h1>
            <div className="font-mono text-xs sm:text-sm text-gallery-secondary uppercase tracking-[0.2em] font-medium">
              {artwork.artist} • {artwork.location}
            </div>

            {/* Description with Read More Toggle */}
            <div className="pt-2 text-xs sm:text-sm text-gallery-secondary leading-relaxed">
              <p className={isExpandedDesc ? "" : "line-clamp-3"}>
                {artwork.description}
              </p>
              {artwork.curatorialNotes && (
                <button
                  onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                  className="font-mono text-[11px] text-gallery-primary hover:text-gallery-accent mt-1 tracking-wider uppercase font-medium inline-block"
                >
                  {isExpandedDesc ? "Less —" : "Read more +"}
                </button>
              )}
            </div>

            {/* Price & Limited Edition Status */}
            <div className="pt-4 flex items-baseline justify-between">
              <div className="font-mono text-2xl sm:text-3xl font-normal text-gallery-primary">
                {formatPrice(unitPrice)}
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-gallery-secondary">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{artwork.edition} ({artwork.availableEditions} remaining)</span>
              </div>
            </div>

            <p className="text-[10px] font-mono text-gallery-muted tracking-wider">
              Shop prices exclude tax. Applicable tax is calculated at checkout.
            </p>
          </div>

          {/* Option 1: PAPER SELECTION */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
              <span>PAPER: {selectedPaper}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {artwork.paperOptions.map((paper) => {
                const isSelected = selectedPaper === paper.name;
                return (
                  <button
                    key={paper.name}
                    onClick={() => setSelectedPaper(paper.name)}
                    className={`font-mono text-[10px] tracking-widest uppercase px-3 py-2 border transition-all ${
                      isSelected
                        ? "border-gallery-primary bg-gallery-primary text-white"
                        : "border-gallery-border bg-white text-gallery-secondary hover:border-gallery-primary hover:text-gallery-primary"
                    }`}
                  >
                    {paper.name} {paper.priceModifier > 0 && `(+$${paper.priceModifier})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option 2: SIZE SELECTION */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
              <span>SIZE: {SIZE_MODIFIERS[selectedSize].label}</span>
              <span className="text-[10px] text-gallery-muted">{SIZE_MODIFIERS[selectedSize].dim}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SIZE_MODIFIERS) as SizeKey[]).map((sizeKey) => {
                const isSelected = selectedSize === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    onClick={() => setSelectedSize(sizeKey)}
                    className={`font-mono text-[10px] tracking-wider uppercase p-2 border text-center transition-all ${
                      isSelected
                        ? "border-gallery-primary bg-gallery-primary text-white"
                        : "border-gallery-border bg-white text-gallery-secondary hover:border-gallery-primary hover:text-gallery-primary"
                    }`}
                  >
                    <div className="font-semibold">{sizeKey}</div>
                    <div className="text-[9px] opacity-80">
                      {sizeKey === "A3" ? "Base" : `+$${SIZE_MODIFIERS[sizeKey].price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option 3: SIGNATURE */}
          <div className="space-y-2.5">
            <div className="font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
              SIGNATURE: {selectedSignature}
            </div>
            <div className="flex gap-2">
              {(["UNSIGNED", "SIGNED AND NUMBERED"] as const).map((sig) => {
                const isSelected = selectedSignature === sig;
                return (
                  <button
                    key={sig}
                    onClick={() => setSelectedSignature(sig)}
                    className={`font-mono text-[10px] tracking-widest uppercase px-3.5 py-2 border transition-all flex-1 text-center ${
                      isSelected
                        ? "border-gallery-primary bg-gallery-primary text-white"
                        : "border-gallery-border bg-white text-gallery-secondary hover:border-gallery-primary hover:text-gallery-primary"
                    }`}
                  >
                    {sig} {sig === "SIGNED AND NUMBERED" && "(+$35)"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option 4: FRAME (With Visual Preview Thumbnails as in Reference Image 4) */}
          <div className="space-y-2.5">
            <div className="font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
              FRAME: {selectedFrame}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {FRAME_OPTIONS.map((f) => {
                const isSelected = selectedFrame === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFrame(f.id)}
                    className={`p-2 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? "border-gallery-primary bg-white shadow-sm ring-1 ring-gallery-primary"
                        : "border-gallery-border bg-white/60 hover:border-gallery-secondary"
                    }`}
                  >
                    {/* Frame Miniature Thumbnail */}
                    <div
                      className={`relative w-full h-12 mb-2 flex items-center justify-center ${
                        f.id === "CLASSIC FRAME"
                          ? "bg-neutral-900 border-2 border-black"
                          : f.id === "FRAMED CANVAS"
                          ? "bg-[#C4A482] border-2 border-[#9C7E5F]"
                          : "bg-white border border-gallery-border"
                      }`}
                    >
                      <div className="w-3/4 h-3/4 relative overflow-hidden bg-neutral-200">
                        <Image
                          src={artwork.image}
                          alt={f.label}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                    </div>
                    <div className="font-mono text-[10px] font-medium tracking-wider uppercase text-gallery-primary leading-tight">
                      {f.label}
                    </div>
                    <div className="font-mono text-[9px] text-gallery-secondary mt-0.5">
                      {f.price === 0 ? "Included" : `+$${f.price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Quantity + ADD TO BAG */}
          <div className="pt-2 flex items-stretch gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gallery-border bg-white px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gallery-secondary hover:text-gallery-primary"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="font-mono text-sm px-3 min-w-[2rem] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-gallery-secondary hover:text-gallery-primary"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Bag Button (Bold Black Bar as in Reference Image 4) */}
            <button
              onClick={handleAddToBag}
              className="flex-1 py-4 bg-gallery-primary text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 group shadow-md"
            >
              {addedNotice ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <span>ADD TO BAG • {formatPrice(unitPrice * quantity)}</span>
              )}
            </button>
          </div>

          {/* Accordions (Reference Image 4) */}
          <div className="pt-4 border-t border-gallery-border divide-y divide-gallery-border">
            {/* 1. Paper & Sizes */}
            <div>
              <button
                onClick={() => toggleAccordion("specs")}
                className="w-full py-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-gallery-primary hover:text-gallery-accent transition-colors"
              >
                <span>Paper & Sizes</span>
                {openAccordion === "specs" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "specs" && (
                <div className="pb-4 text-xs font-mono text-gallery-secondary space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>• Medium: {artwork.medium}</p>
                  <p>• Dimensions: A3, A2, A1, A0 (standard ISO 216 gallery format)</p>
                  <p>• Archival Rating: Guaranteed 100+ years lightfastness under museum glass</p>
                  <p>• Acid-free 100% alpha-cellulose / cotton fibers</p>
                </div>
              )}
            </div>

            {/* 2. Delivery Info */}
            <div>
              <button
                onClick={() => toggleAccordion("delivery")}
                className="w-full py-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-gallery-primary hover:text-gallery-accent transition-colors"
              >
                <span>Delivery Info</span>
                {openAccordion === "delivery" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "delivery" && (
                <div className="pb-4 text-xs font-mono text-gallery-secondary space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>• Unframed editions are wrapped in glassine acid-free paper and shipped in reinforced 4mm heavy tubes.</p>
                  <p>• Framed editions are custom-crated with shock-absorbing foam corners and security seals.</p>
                  <p>• Worldwide tracked courier via DHL Express (3–6 business days).</p>
                  <p>• Full transit insurance included with every shipment.</p>
                </div>
              )}
            </div>

            {/* 3. Returns Policy */}
            <div>
              <button
                onClick={() => toggleAccordion("returns")}
                className="w-full py-4 flex justify-between items-center text-xs font-mono uppercase tracking-widest text-gallery-primary hover:text-gallery-accent transition-colors"
              >
                <span>Returns Policy</span>
                {openAccordion === "returns" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "returns" && (
                <div className="pb-4 text-xs font-mono text-gallery-secondary space-y-2 leading-relaxed animate-in fade-in duration-200">
                  <p>• 30-day museum collector guarantee.</p>
                  <p>• Complimentary return shipping in the unlikely event of transit damage.</p>
                  <p>• Every artwork includes a numbered Certificate of Authenticity signed by the master printmaker.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Room Mockup Modal */}
      <RoomMockupModal
        artwork={artwork}
        frame={selectedFrame}
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
      />

      {/* Related Artworks Section */}
      <RelatedArtworks currentArtwork={artwork} allArtworks={ARTWORKS} />
    </div>
  );
};
