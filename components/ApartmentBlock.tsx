"use client";

import { useEffect, useRef } from "react";

export default function ApartmentBlock({
  x,
  y,
  video
}: {
  x: number;
  y: number;
  video: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Explicit play() fixes Safari / iOS / Chrome edge cases
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.playsInline = true;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — silently ignore
      });
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 200,
        height: 140,
        background: "#1a1f2b",
        border: "1px solid #2c3242",
        transform: "skewY(-20deg)",
        padding: 8
      }}
    >
      <video
        ref={videoRef}
        src={video}
        loop
        muted
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 4
        }}
      />
    </div>
  );
}
