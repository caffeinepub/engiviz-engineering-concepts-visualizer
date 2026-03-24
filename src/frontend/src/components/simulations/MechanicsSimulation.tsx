import { useEffect, useRef, useState } from "react";

const FRICTION_MAX = 40;
const BW = 48;
const BH = 28;

export function MechanicsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const forceRef = useRef(20);
  const blockXRef = useRef(150);
  const [force, setForce] = useState(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || 380;
    canvas.height = canvas.offsetHeight || 144;
    const W = canvas.width;
    const H = canvas.height;
    blockXRef.current = W / 2;
    const groundY = H - 24;
    let last = 0;

    function arrow(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
    ) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (Math.hypot(dx, dy) < 3) return;
      const a = Math.atan2(dy, dx);
      ctx!.save();
      ctx!.strokeStyle = color;
      ctx!.fillStyle = color;
      ctx!.lineWidth = 2;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(x1, y1);
      ctx!.lineTo(x2, y2);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(x2, y2);
      ctx!.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
      ctx!.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
      ctx!.closePath();
      ctx!.fill();
      ctx!.restore();
    }

    function draw(t: number) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const f = forceRef.current;
      const moving = f > FRICTION_MAX;
      const friction = moving ? FRICTION_MAX : f;
      const net = f - friction;

      if (moving) {
        blockXRef.current += net * dt * 1.8;
        if (blockXRef.current > W - BW / 2 - 14)
          blockXRef.current = BW / 2 + 14;
      } else {
        blockXRef.current = W / 2;
      }

      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "#08111e";
      ctx!.fillRect(0, 0, W, H);

      // Ground line
      ctx!.strokeStyle = "#2a6a7a";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(8, groundY);
      ctx!.lineTo(W - 8, groundY);
      ctx!.stroke();

      // Hatch marks
      ctx!.strokeStyle = "rgba(42,106,122,0.45)";
      ctx!.lineWidth = 1;
      for (let x = 16; x < W - 8; x += 11) {
        ctx!.beginPath();
        ctx!.moveTo(x, groundY);
        ctx!.lineTo(x - 6, groundY + 9);
        ctx!.stroke();
      }

      const bx = blockXRef.current;
      const by = groundY - BH;

      // Block gradient
      const grad = ctx!.createLinearGradient(
        bx - BW / 2,
        by,
        bx - BW / 2,
        by + BH,
      );
      grad.addColorStop(0, "#2563a8");
      grad.addColorStop(1, "#163e6e");
      ctx!.fillStyle = grad;
      ctx!.fillRect(bx - BW / 2, by, BW, BH);
      ctx!.strokeStyle = "#4da8d8";
      ctx!.lineWidth = 1.5;
      ctx!.strokeRect(bx - BW / 2, by, BW, BH);

      // Applied force →
      const fLen = 12 + (f / 100) * 55;
      arrow(
        bx + BW / 2,
        by + BH / 2,
        bx + BW / 2 + fLen,
        by + BH / 2,
        "#38d8e8",
      );

      // Friction ←
      const ffLen = 12 + (friction / 100) * 55;
      if (friction > 0) {
        arrow(
          bx - BW / 2,
          by + BH / 2,
          bx - BW / 2 - ffLen,
          by + BH / 2,
          "#fb923c",
        );
      }

      // Net force arrow (above block, only when sliding)
      if (net > 1) {
        const netLen = 10 + (net / 60) * 45;
        arrow(bx, by - 10, bx + netLen, by - 10, "#ef4444");
        ctx!.font = "8px monospace";
        ctx!.fillStyle = "#ef4444";
        ctx!.fillText(`net=${net.toFixed(0)}N`, bx + netLen + 3, by - 7);
      }

      // Status + force labels
      ctx!.font = "bold 9px monospace";
      ctx!.fillStyle = moving ? "#ef4444" : "#4ade80";
      ctx!.fillText(moving ? "\u25b6 SLIDING" : "\u2298 STATIC", 6, 13);

      ctx!.font = "9px monospace";
      ctx!.fillStyle = "#38d8e8";
      ctx!.fillText(`F=${f}N`, bx + BW / 2 + fLen + 4, by + BH / 2 + 3);

      if (friction > 0) {
        ctx!.fillStyle = "#fb923c";
        ctx!.fillText(
          `f=${friction}N`,
          bx - BW / 2 - ffLen - 34,
          by + BH / 2 + 3,
        );
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#08111e]"
      style={{ height: 176 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height: 144 }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#060d18] flex items-center gap-2 px-3">
        <span className="text-[9px] text-[#38d8e8] font-mono shrink-0">
          F: {force}N
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={force}
          onChange={(e) => {
            const v = +e.target.value;
            setForce(v);
            forceRef.current = v;
          }}
          className="flex-1 h-1 cursor-pointer"
          style={{ accentColor: "#0fa6b3" }}
          data-ocid="concepts.toggle"
        />
        <span
          className="text-[9px] font-mono shrink-0 w-10 text-right"
          style={{ color: force > FRICTION_MAX ? "#ef4444" : "#4ade80" }}
        >
          {force > FRICTION_MAX ? "MOVE" : "HOLD"}
        </span>
      </div>
    </div>
  );
}
