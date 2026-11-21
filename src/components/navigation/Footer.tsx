"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-white pt-20 pb-12 px-6 md:px-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="relative h-7 w-auto">
              <Image
                src="/images/logo-white.png"
                alt="FORMA / 01"
                width={150}
                height={50}
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              An international digital art exhibition presenting perspective-shifting contemporary works, limited archival editions, and curatorial dialogues for 2026 and beyond.
            </p>
            <div className="pt-2 text-[10px] text-neutral-500 tracking-widest uppercase">
              LONDON • BASEL • MILAN • TOKYO
            </div>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 block mb-4 font-semibold">
              EXHIBITION
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                  3D Gallery
                </Link>
              </li>
              <li>
                <Link href="/collection" className="text-neutral-400 hover:text-white transition-colors">
                  All Artworks
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  Curatorial Statement
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Gallery Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Edition Information */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 block mb-4 font-semibold">
              ARCHIVE
            </span>
            <ul className="space-y-2.5 text-neutral-400">
              <li>Limited Editions: 15–60</li>
              <li>Hand-numbered</li>
              <li>Certificate of Authenticity</li>
              <li>Museum 310gsm Cotton</li>
              <li>DHL Art Express</li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 block font-semibold">
              CURATORIAL DISPATCH
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Receive private previews of upcoming print releases, artist interviews, and salon invitations.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-neutral-700 text-xs text-emerald-400">
                <Check size={14} />
                <span>You have been added to the 2026 Collector Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-neutral-700 focus-within:border-white transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER COLLECTOR EMAIL"
                  required
                  className="bg-transparent text-xs py-2.5 w-full focus:outline-none placeholder:text-neutral-600 text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
          <div>© 2026 FORMA / 01 EXHIBITION. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6 text-[10px] tracking-widest uppercase">
            <Link href="/about" className="hover:text-white transition-colors">CREDITS</Link>
            <Link href="/contact" className="hover:text-white transition-colors">TERMS OF SALE</Link>
            <Link href="/contact" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
