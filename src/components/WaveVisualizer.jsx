import { useRef, useEffect } from "react";

/**
 * Animated waveform canvas.
 * – Shows live mic waveform when recording.
 * – Shows a gentle idle sine wave otherwise.
 */
export default function WaveVisualizer({ isRecording, analyserRef }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (isRecording && analyserRef.current) {
        const buf  = analyserRef.current.frequencyBinCount;
        const data = new Uint8Array(buf);
        analyserRef.current.getByteTimeDomainData(data);

        ctx.beginPath();
        const sw = W / buf;
        let x = 0;
        for (let i = 0; i < buf; i++) {
          const y = (data[i] / 128.0 * H) / 2;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          x += sw;
        }
        ctx.strokeStyle = "#F5C518";
        ctx.lineWidth   = 2.5;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = "#F5C518";
        ctx.stroke();
      } else {
        const t = Date.now() / 1000;
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const y = H / 2 + Math.sin((x / W) * Math.PI * 4 + t * 1.5) * 6;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(45,108,223,0.4)";
        ctx.lineWidth   = 1.5;
        ctx.shadowBlur  = 0;
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isRecording, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={56}
      style={{
        width: "100%", height: 56,
        borderRadius: 8,
        background: "rgba(10,15,30,0.6)",
        display: "block",
      }}
    />
  );
}
