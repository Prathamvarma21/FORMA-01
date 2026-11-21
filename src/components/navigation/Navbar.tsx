"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Menu, X, ShoppingBag } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGallery = pathname === "/";
  const isCollection = pathname === "/collection";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 pointer-events-none transition-all">
        <div className="flex items-center justify-between w-full">
          {/* Brand Logo Image (FORMA / 01 from User Reference) */}
          <Link
            href="/"
            className="pointer-events-auto group flex items-center"
            aria-label="FORMA / 01 Home"
          >
            <div className="relative h-6 sm:h-7 md:h-8 w-auto">
              <Image
                src="/images/logo.png"
                alt="FORMA / 01"
                width={160}
                height={53}
                priority
                className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-75"
              />
            </div>
          </Link>

          {/* Right Controls: [ GALLERY | LIST ] Pill + Nav Links + Bag */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-7 pointer-events-auto">
            {/* [ GALLERY | LIST ] Pill (From Reference Video Screenshot) */}
            <div className="flex items-center bg-white/85 backdrop-blur-md border border-neutral-300 rounded-full p-0.5 shadow-xs">
              <Link
                href="/"
                className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all ${
                  isGallery
                    ? "bg-black text-white shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                GALLERY
              </Link>
              <Link
                href="/collection"
                className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all ${
                  isCollection
                    ? "bg-black text-white shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                LIST
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-[11px] font-medium tracking-wider uppercase text-neutral-600">
              <Link
                href="/about"
                className={`hover:text-black transition-colors ${
                  pathname === "/about" ? "text-black font-semibold" : ""
                }`}
              >
                ABOUT
              </Link>
              <Link
                href="/contact"
                className={`hover:text-black transition-colors ${
                  pathname === "/contact" ? "text-black font-semibold" : ""
                }`}
              >
                CONTACT
              </Link>
            </nav>

            {/* Bag Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-[10px] tracking-wider uppercase border border-neutral-300 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full hover:border-black hover:bg-black hover:text-white transition-all text-neutral-800 shadow-xs"
              aria-label="Open Cart"
            >
              <ShoppingBag size={12} />
              <span className="hidden sm:inline font-medium">BAG</span>
              <span className="font-semibold">({itemCount})</span>
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-neutral-800 hover:text-black md:hidden"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-[#111111] text-white flex flex-col justify-between p-8 md:hidden animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div className="relative h-6 w-auto">
              <Image
                src="/images/logo-white.png"
                alt="FORMA / 01"
                width={130}
                height={43}
                className="h-6 w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-400 hover:text-white"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-medium">
              EXHIBITION DIRECTORY
            </span>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-light tracking-wide hover:text-neutral-300 transition-colors"
            >
              3D GALLERY
            </Link>
            <Link
              href="/collection"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-light tracking-wide hover:text-neutral-300 transition-colors"
            >
              COLLECTION LIST
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-light tracking-wide hover:text-neutral-300 transition-colors"
            >
              ABOUT EXHIBITION
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-light tracking-wide hover:text-neutral-300 transition-colors"
            >
              CONTACT & INQUIRIES
            </Link>
          </div>

          <div className="border-t border-neutral-800 pt-6 flex justify-between items-center text-xs text-neutral-500">
            <span>DIGITAL ART EXHIBITION 2026</span>
            <span>12 EDITIONS</span>
          </div>
        </div>
      )}
    </>
  );
};
