"use client";

import React, { useEffect, useState, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isHoveringArtwork, setIsHoveringArtwork] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsDragging(true);
    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId: number;
    const render = () => {
      const ease = 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    /* Ring Cursor with Satellite Dot as in Reference Image 2 */
    <div
      ref={ringRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,border-color,background-color] duration-200 flex items-center justify-center ${
        isDragging
          ? "w-8 h-8 border border-neutral-800 bg-neutral-900/10 scale-90"
          : "w-7 h-7 border border-neutral-500 bg-transparent"
      }`}
    >
      {/* Satellite Dot attached to left edge of the ring (from Reference Image 2) */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
    </div>
  );
};
