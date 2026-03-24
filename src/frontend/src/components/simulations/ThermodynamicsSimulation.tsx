import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function heatColor(t: number): string {
  const r = Math.round(40 + t * 2.15);
  const g = Math.round(80 + t * 0.2);
  const b = Math.round(220 - t * 2.1);
  return `rgb(${r},${g},${b})`;
}

function toKelvin(t: number): number {
  return Math.round(200 + t * 8);
}

const N = 30;

export function ThermodynamicsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const tempRef = useRef(50);
  const particlesRef = useRef<Particle[]>([]);
  const [temp, setTemp] = useState(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || 380;
    canvas.height = canvas.offsetHeight || 144;
    const W = canvas.width;
    const H = canvas.height;

    particlesRef.current = Array.from({ length: N }, () => ({
      x: 12 + Math.random() * (W - 24),
      y: 12 + Math.random() * (H - 24),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      r: 3 + Math.random() * 1.5,
    }));

    ctx.fillStyle = "#08121f";
    ctx.fillRect(0, 0, W, H);

    function draw() {
      const t = tempRef.current;
      const speed = 0.4 + (t / 100) * 3.8;

      ctx!.fillStyle = "rgba(8,18,31,0.32)";
      ctx!.fillRect(0, 0, W, H);

      for (const p of particlesRef.current) {
        const mag = Math.hypot(p.vx, p.vy);
        if (mag > 0.01) {
          p.vx = (p.vx / mag) * speed;
          p.vy = (p.vy / mag) * speed;
        } else {
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.r) {
          p.x = p.r;
          p.vx = Math.abs(p.vx);
        }
        if (p.x > W - p.r) {
          p.x = W - p.r;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < p.r) {
          p.y = p.r;
          p.vy = Math.abs(p.vy);
        }
        if (p.y > H - p.r) {
          p.y = H - p.r;
          p.vy = -Math.abs(p.vy);
        }

        const color = heatColor(t);
        const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grd.addColorStop(0, color);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = grd;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }

      const kelvin = toKelvin(t);
      ctx!.font = "bold 22px monospace";
      ctx!.textAlign = "center";
      ctx!.fillStyle = "rgba(255,255,255,0.85)";
      ctx!.fillText(`${kelvin} K`, W / 2, H / 2 + 8);
      ctx!.font = "9px monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.fillText("Temperature", W / 2, H / 2 + 22);
      ctx!.textAlign = "left";

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const sliderColor = heatColor(temp);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#08121f]"
      style={{ height: 176 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height: 144 }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#050e18] flex items-center gap-2 px-3">
        <span className="text-[9px] text-[#4080ff] font-mono shrink-0">
          Cold
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={temp}
          onChange={(e) => {
            const v = +e.target.value;
            setTemp(v);
            tempRef.current = v;
          }}
          className="flex-1 h-1 cursor-pointer"
          style={{ accentColor: sliderColor }}
          data-ocid="concepts.toggle"
        />
        <span className="text-[9px] text-[#ff5040] font-mono shrink-0">
          Hot
        </span>
      </div>
    </div>
  );
}
