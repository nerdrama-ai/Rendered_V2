export async function generateVideo(color: string, label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;

  const ctx = canvas.getContext("2d")!;
  let t = 0;

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.start();

  const interval = setInterval(() => {
    t += 0.05;

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
    ctx.font = "20px sans-serif";
    ctx.fillText(label, 90, 95);
  }, 33);

  await new Promise(r => setTimeout(r, 3000));

  clearInterval(interval);
  recorder.stop();

  await new Promise(r => (recorder.onstop = r));

  return URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
}
