"use client";

export default function ApartmentBlock({
  x,
  y,
  video
}: {
  x: number;
  y: number;
  video: string;
}) {
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
        src={video}
        muted
        loop
        autoPlay
        playsInline
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
