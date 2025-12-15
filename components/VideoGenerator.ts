export async function generateVideo(color: string, label: string) {
  // ✅ Prevent SSR / build-time execution on Vercel
  if (typeof window === "undefined") {
    throw new Error("generateVideo must run in the browser");
  }

  // ✅ Guard for unsupported browsers
  if (
    typeof MediaRecorder === "undefined" ||
    !HTMLCanvasElement.prototype.captureStream
  ) {
    throw new Error("MediaRecorder or captureStream not supported");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D canvas context");
  }

  let t = 0;

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  const interval = setInterval(() => {
    t += 0.05;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.fillRect(
      40 + Math.sin(t) * 30,
      40 + Math.cos(t) * 20,
      240,
      100
    );

    ctx.fillStyle = "white";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(label, 90, 95);
  }, 33);

  // ⏱ Record 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  clearInterval(interval);
  recorder.stop();

  await new Promise(resolve => {
    recorder.onstop = resolve;
  });

  const blob = new Blob(chunks, { type: "video/webm" });
  return URL.createObjectURL(blob);
}
