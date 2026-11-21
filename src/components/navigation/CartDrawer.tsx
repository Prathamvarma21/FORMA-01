"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, itemCount, subtotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C8A77B", "#111111", "#8B2635", "#E5E3DE"],
    });

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        setOrderComplete(false);
        closeCart();
      }, 4000);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FBFBFA] h-full shadow-2xl flex flex-col z-10 border-l border-gallery-border animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gallery-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-light tracking-wide text-gallery-primary">YOUR BAG</h2>
            <span className="text-xs uppercase tracking-widest text-gallery-secondary bg-gallery-border/40 px-2 py-0.5 rounded-full font-mono">
              ({itemCount})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gallery-secondary hover:text-gallery-primary transition-colors rounded-full hover:bg-black/5"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {orderComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gallery-primary text-white flex items-center justify-center mb-6">
              <Check size={28} />
            </div>
            <h3 className="font-serif text-2xl text-gallery-primary mb-2">Exhibition Order Reserved</h3>
            <p className="text-sm text-gallery-secondary mb-4 max-w-xs">
              Thank you for supporting curated contemporary artists. A confirmation and Certificate of Authenticity registration have been prepared.
            </p>
            <div className="p-3 bg-gallery-bg border border-gallery-border rounded text-xs font-mono text-gallery-primary mb-6">
              RESERVATION: #FRAME-2026-{Math.floor(1000 + Math.random() * 9000)}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="font-serif text-xl text-gallery-secondary mb-2">Your exhibition bag is empty</p>
            <p className="text-xs text-gallery-secondary tracking-wide uppercase mb-6">Explore the perspective gallery to acquire original editions</p>
            <button
              onClick={closeCart}
              className="px-6 py-3 border border-gallery-primary text-gallery-primary hover:bg-gallery-primary hover:text-white transition-all text-xs uppercase tracking-widest"
            >
              Back to Exhibition
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gallery-border/60">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-24 flex-shrink-0 bg-gallery-bg border border-gallery-border overflow-hidden">
                    <Image
                      src={item.artwork.image}
                      alt={item.artwork.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/artwork/${item.artwork.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base font-normal hover:text-gallery-accent transition-colors"
                        >
                          {item.artwork.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gallery-secondary hover:text-gallery-primary p-1 text-xs"
                          aria-label="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-gallery-secondary uppercase tracking-wider mt-0.5">
                        {item.artwork.artist}
                      </p>
                      <div className="text-[10px] text-gallery-secondary/80 mt-1 space-y-0.5 font-mono">
                        <p>{item.size} • {item.paper}</p>
                        <p>{item.signature} • {item.frame}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gallery-border">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-black/5 text-gallery-secondary"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-black/5 text-gallery-secondary"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-medium text-gallery-primary">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t border-gallery-border bg-white space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="uppercase tracking-widest text-xs text-gallery-secondary font-mono">SUBTOTAL</span>
                <span className="font-mono text-lg font-medium text-gallery-primary">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gallery-secondary">
                <ShieldCheck size={14} className="text-gallery-accent flex-shrink-0" />
                <span>Museum-grade archival packaging & Certificate of Authenticity included</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-gallery-primary text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 group"
              >
                {isCheckingOut ? (
                  <span>Reserving Edition...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-gallery-muted tracking-wider uppercase font-mono">
                Tax calculated at checkout • Global DHL Art Express
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
