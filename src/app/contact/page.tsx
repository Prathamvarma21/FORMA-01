"use client";

import React, { useState } from "react";
import { Footer } from "@/components/navigation/Footer";
import { Check, Mail, MapPin, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "COLLECTOR INQUIRY",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C8A77B", "#111111", "#8B2635"],
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-gallery-primary">
      {/* Header */}
      <section className="pt-32 pb-14 px-6 md:px-16 max-w-7xl mx-auto border-b border-gallery-border">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gallery-secondary mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gallery-primary" />
            <span>COLLECTOR LIAISON & INQUIRIES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-gallery-primary">
            Connect With The Curatorial Office.
          </h1>
          <p className="text-xs sm:text-sm text-gallery-secondary mt-3 leading-relaxed font-light">
            Inquire regarding private viewings, institutional acquisitions, bespoke framing commissions, or international shipping arrangements.
          </p>
        </div>
      </section>

      {/* Main Form and Info Grid */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto pb-24 border-b border-gallery-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-gallery-border shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-gallery-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-3xl text-gallery-primary">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-gallery-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. A curatorial associate will review your dispatch and reply to <strong>{formData.email}</strong> within 24 business hours.
                </p>
                <div className="pt-4 font-mono text-[11px] text-gallery-muted">
                  DISPATCH REF: #INQ-2026-{Math.floor(1000 + Math.random() * 9000)}
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "COLLECTOR INQUIRY", message: "" });
                  }}
                  className="mt-6 px-6 py-2.5 border border-gallery-border hover:border-gallery-primary text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-gallery-primary font-normal">
                    Direct Curatorial Dispatch
                  </h3>
                  <p className="font-mono text-xs text-gallery-secondary mt-1 uppercase tracking-wider">
                    Please provide your collector details below
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Helena Vance"
                    className="w-full bg-[#FAF9F5] border border-gallery-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-gallery-primary transition-colors text-gallery-primary placeholder:text-neutral-400"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. helena@collection.com"
                    className="w-full bg-[#FAF9F5] border border-gallery-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-gallery-primary transition-colors text-gallery-primary placeholder:text-neutral-400"
                  />
                </div>

                {/* Subject Selector */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
                    Inquiry Nature
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-gallery-border px-4 py-3 text-xs font-mono uppercase text-gallery-primary focus:outline-none focus:border-gallery-primary"
                  >
                    <option value="COLLECTOR INQUIRY">COLLECTOR & EDITION INQUIRY</option>
                    <option value="PRIVATE VIEWING">SCHEDULE PRIVATE GALLERY VIEWING</option>
                    <option value="INSTITUTIONAL ACQUISITION">INSTITUTIONAL & MUSEUM ACQUISITION</option>
                    <option value="PRESS & CURATORIAL">PRESS & EDITORIAL INQUIRY</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-gallery-secondary">
                    Message / Artwork Specifics *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Inquire regarding particular edition numbers, frame materials, or delivery timelines..."
                    className="w-full bg-[#FAF9F5] border border-gallery-border px-4 py-3 text-sm font-sans focus:outline-none focus:border-gallery-primary transition-colors text-gallery-primary placeholder:text-neutral-400 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gallery-primary text-white font-mono text-xs uppercase tracking-[0.25em] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "TRANSMITTING DISPATCH..." : "SUBMIT CURATORIAL INQUIRY"}
                </button>

                <div className="flex items-center gap-2 text-[10px] font-mono text-gallery-muted justify-center">
                  <ShieldCheck size={12} className="text-gallery-accent" />
                  <span>Confidentiality guaranteed. We respect collector privacy.</span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Physical Salons & Contacts */}
          <div className="lg:col-span-5 space-y-8 font-mono text-xs">
            {/* Gallery Locations */}
            <div className="bg-white p-6 border border-gallery-border shadow-sm space-y-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gallery-secondary block">
                FLAGSHIP SALONS
              </span>

              <div className="space-y-4 divide-y divide-gallery-border">
                <div className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center gap-2 font-serif text-lg font-normal text-gallery-primary">
                    <MapPin size={16} className="text-gallery-accent" />
                    <span>London Mayfair</span>
                  </div>
                  <p className="text-gallery-secondary text-[11px]">
                    14 Berkeley Square, London W1J 6BL, United Kingdom
                  </p>
                </div>

                <div className="pt-4 space-y-1">
                  <div className="flex items-center gap-2 font-serif text-lg font-normal text-gallery-primary">
                    <MapPin size={16} className="text-gallery-accent" />
                    <span>Basel St. Alban</span>
                  </div>
                  <p className="text-gallery-secondary text-[11px]">
                    St. Alban-Vorstadt 28, 4052 Basel, Switzerland
                  </p>
                </div>

                <div className="pt-4 space-y-1">
                  <div className="flex items-center gap-2 font-serif text-lg font-normal text-gallery-primary">
                    <MapPin size={16} className="text-gallery-accent" />
                    <span>Milan Brera</span>
                  </div>
                  <p className="text-gallery-secondary text-[11px]">
                    Via Brera 18, 20121 Milano, Italy
                  </p>
                </div>
              </div>
            </div>

            {/* Visitation & Contact Details */}
            <div className="bg-[#FAF9F5] p-6 border border-gallery-border space-y-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gallery-secondary block">
                VISITATION & HOURS
              </span>

              <div className="space-y-2 text-gallery-secondary text-[11px]">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gallery-muted" />
                  <span>Tuesday – Saturday: 10:00 — 18:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gallery-muted" />
                  <span>Sunday & Monday: By Private Appointment</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gallery-border space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-gallery-secondary">DIRECT EMAIL</span>
                  <a href="mailto:curator@frame-gallery.art" className="text-gallery-primary hover:text-gallery-accent transition-colors underline">
                    curator@frame-gallery.art
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gallery-secondary">INSTAGRAM</span>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gallery-primary hover:text-gallery-accent transition-colors flex items-center gap-1">
                    <span>@frame.01.exhibition</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
