import { useEffect, useRef, useState } from "react";

interface FluidParticle {
  x: number;
  y: number;
  lane: number;
}

const LANES = 10;
const N_PARTICLES = 40;
const BASE_SPEED = 55;

export function FluidSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const narrowRef = useRef(0.35);
  const particlesRef = useRef<FluidParticle[]>([]);
  const [narrowPct, setNarrowPct] = useState(35);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || 380;
    canvas.height = canvas.offsetHeight || 144;
    const W = canvas.width;
    const H = canvas.height;

    const PIPE_H = 72;
    const PIPE_CY = H / 2;
    const NARROW_X0 = W * 0.32;
    const NARROW_X1 = W * 0.68;
    const TAPER_X0 = W * 0.14;
    const TAPER_X1 = W * 0.86;

    particlesRef.current = Array.from({ length: N_PARTICLES }, (_, i) => ({
      x: Math.random() * W,
      y: PIPE_CY,
      lane: i % LANES,
    }));

    function getPipeHalf(x: number, nf: number): number {
      const full = PIPE_H / 2;
      const narrow = full * nf;
      if (x <= TAPER_X0) return full;
      if (x <= NARROW_X0) {
        const taper = (x - TAPER_X0) / (NARROW_X0 - TAPER_X0);
        return full + (narrow - full) * taper;
      }
      if (x <= NARROW_X1) return narrow;
      if (x <= TAPER_X1) {
        const taper = (x - NARROW_X1) / (TAPER_X1 - NARROW_X1);
        return narrow + (full - narrow) * taper;
      }
      return full;
    }

    ctx.fillStyle = "#06101a";
    ctx.fillRect(0, 0, W, H);

    let last = 0;

    function draw(time: number) {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      const nf = narrowRef.current;

      ctx!.fillStyle = "rgba(6,16,26,0.5)";
      ctx!.fillRect(0, 0, W, H);

      // Pipe shape
      ctx!.beginPath();
      for (let xi = 0; xi <= W; xi += 2) {
        const half = getPipeHalf(xi, nf);
        if (xi === 0) ctx!.moveTo(xi, PIPE_CY - half);
        else ctx!.lineTo(xi, PIPE_CY - half);
      }
      for (let xi = W; xi >= 0; xi -= 2) {
        const half = getPipeHalf(xi, nf);
        ctx!.lineTo(xi, PIPE_CY + half);
      }
      ctx!.closePath();
      ctx!.fillStyle = "rgba(20,50,80,0.5)";
      ctx!.fill();
      ctx!.strokeStyle = "#2a6888";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Pressure highlight in narrow section
      const grd = ctx!.createLinearGradient(NARROW_X0, 0, NARROW_X1, 0);
      grd.addColorStop(0, "rgba(56,200,240,0.04)");
      grd.addColorStop(0.5, "rgba(56,200,240,0.12)");
      grd.addColorStop(1, "rgba(56,200,240,0.04)");
      const narrowHalf = getPipeHalf((NARROW_X0 + NARROW_X1) / 2, nf);
      ctx!.fillStyle = grd;
      ctx!.fillRect(
        NARROW_X0,
        PIPE_CY - narrowHalf,
        NARROW_X1 - NARROW_X0,
        narrowHalf * 2,
      );

      // Particles
      for (const p of particlesRef.current) {
        const half = getPipeHalf(p.x, nf);
        const fullHalf = PIPE_H / 2;
        const localSpeed = BASE_SPEED * (fullHalf / half);

        p.x += localSpeed * dt;
        if (p.x > W + 8) p.x = -8;
        p.y = PIPE_CY - half + ((p.lane + 0.5) / LANES) * (half * 2);

        const speedFrac = Math.min(
          1,
          (localSpeed - BASE_SPEED) / (BASE_SPEED * 3),
        );
        const pr = Math.round(20 + speedFrac * 20);
        const pg = Math.round(110 + speedFrac * 90);
        const pb = Math.round(200 + speedFrac * 55);
        const pColor = `rgb(${pr},${pg},${pb})`;

        const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
        glow.addColorStop(0, pColor);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = pColor;
        ctx!.fill();
      }

      // Speed labels
      const wideHalf = getPipeHalf(W * 0.08, nf);
      const midHalf = getPipeHalf((NARROW_X0 + NARROW_X1) / 2, nf);
      const fullHalf = PIPE_H / 2;
      const vWide = BASE_SPEED;
      const vMid = Math.round(BASE_SPEED * (fullHalf / midHalf));

      ctx!.font = "bold 9px monospace";
      ctx!.textAlign = "center";
      ctx!.fillStyle = "#5ab8d8";
      ctx!.fillText(`v=${vWide}`, W * 0.08, PIPE_CY - wideHalf - 7);
      ctx!.fillStyle = "#80f0ff";
      ctx!.fillText(
        `v=${vMid}`,
        (NARROW_X0 + NARROW_X1) / 2,
        PIPE_CY - midHalf - 7,
      );
      ctx!.font = "8px monospace";
      ctx!.fillStyle = "rgba(128,240,255,0.45)";
      ctx!.fillText(
        "Bernoulli: A\u2081v\u2081 = A\u2082v\u2082",
        (NARROW_X0 + NARROW_X1) / 2,
        PIPE_CY + midHalf + 14,
      );
      ctx!.textAlign = "left";

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#06101a]"
      style={{ height: 176 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height: 144 }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#040c14] flex items-center gap-2 px-3">
        <span className="text-[9px] text-[#2a9aae] font-mono shrink-0">
          Wide
        </span>
        <input
          type="range"
          min={20}
          max={80}
          value={100 - narrowPct}
          onChange={(e) => {
            const v = 100 - +e.target.value;
            setNarrowPct(v);
            narrowRef.current = v / 100;
          }}
          className="flex-1 h-1 cursor-pointer"
          style={{ accentColor: "#38d8e8" }}
          data-ocid="concepts.toggle"
        />
        <span className="text-[9px] text-[#80f0ff] font-mono shrink-0">
          Narrow
        </span>
      </div>
    </div>
  );
}
