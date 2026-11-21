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
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => {
            setHidden(true);
            onComplete();
          },
        });
      },
    });

    // Show logo cleanly, hold it long enough for WebGL textures to fully load
    tl.fromTo(
      ".loader-logo",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
    ).to(".loader-logo", {
      opacity: 1,
      duration: 1.6, // extra hold = textures finish loading during this pause
      ease: "none",
    }).to(".loader-logo", {
      opacity: 0.85,
      duration: 0.4,
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
