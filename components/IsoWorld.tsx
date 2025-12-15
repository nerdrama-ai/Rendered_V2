"use client";

import { useEffect, useRef, useState } from "react";
import ApartmentBlock from "./ApartmentBlock";
import { generateVideo } from "./VideoGenerator";

export default function IsoWorld() {
  const worldRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    (async () => {
      const v1 = await generateVideo("#ff6b6b", "APT 101");
      const v2 = await generateVideo("#4dabf7", "APT 204");
      const v3 = await generateVideo("#51cf66", "APT 305");
      const v4 = await generateVideo("#f59f00", "APT 402");
      setVideos([v1, v2, v3, v4]);
    })();
  }, []);

  // Mouse drag
  useEffect(() => {
    let dragging = false;
    let last = { x: 0, y: 0 };

    const down = (e: MouseEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
    };

    const move = (e: MouseEvent) => {
      if (!dragging) return;
      setOffset(o => ({
        x: o.x + (e.clientX - last.x),
        y: o.y + (e.clientY - last.y)
      }));
      last = { x: e.clientX, y: e.clientY };
    };

    const up = () => (dragging = false);

    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  // Zoom
  useEffect(() => {
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale(s => Math.min(2.5, Math.max(0.4, s - e.deltaY * 0.001)));
    };
    window.addEventListener("wheel", wheel, { passive: false });
    return () => window.removeEventListener("wheel", wheel);
  }, []);

  return (
    <div
      ref={worldRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          transform: `
            translate(${offset.x}px, ${offset.y}px)
            scale(${scale})
            rotateX(60deg)
            rotateZ(45deg)
          `,
          transformOrigin: "center",
          position: "absolute",
          left: "50%",
          top: "50%"
        }}
      >
        {videos.map((v, i) => (
          <ApartmentBlock
            key={i}
            video={v}
            x={i * 240}
            y={i * 160}
          />
        ))}
      </div>
    </div>
  );
}
