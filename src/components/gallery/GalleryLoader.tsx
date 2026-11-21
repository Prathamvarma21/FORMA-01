"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface GalleryLoaderProps {
  onComplete: () => void;
}

export const GalleryLoader: React.FC<GalleryLoaderProps> = ({ onComplete }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(".loader-container", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setHidden(true);
            onComplete();
          },
        });
      },
    });

    // Subtle, elegant logo entrance and hold
    tl.fromTo(
      ".loader-logo",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
    ).to(".loader-logo", {
      opacity: 0.9,
      duration: 0.6,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className="loader-container fixed inset-0 z-[1000] bg-[#F7F6F2] flex items-center justify-center select-none">
      {/* Centered Bigger Logo - No Other Text */}
      <div className="loader-logo relative w-56 sm:w-72 md:w-96 h-auto flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="FORMA / 01"
          width={400}
          height={133}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};
