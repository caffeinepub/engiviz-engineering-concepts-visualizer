import { useEffect, useRef, useState } from "react";

const RESISTANCE = 6; // ohms
const N_DOTS = 6;

interface Dot {
  progress: number;
}

function posOnPath(
  rawProg: number,
  L: number,
  T: number,
  R: number,
  B: number,
): { x: number; y: number } {
  const s0 = R - L; // top: L→R
  const s1 = B - T; // right: T→B
  const s2 = R - L; // bottom: R→L
  const s3 = B - T; // left: B→T
  let p = rawProg;
  if (p < s0) return { x: L + p, y: T };
  p -= s0;
  if (p < s1) return { x: R, y: T + p };
  p -= s1;
  if (p < s2) return { x: R - p, y: B };
  p -= s2;
  return { x: L, y: B - Math.min(p, s3) };
}

export function CircuitSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const voltageRef = useRef(6);
  const closedRef = useRef(true);
  const dotsRef = useRef<Dot[]>([]);
  const [voltage, setVoltage] = useState(6);
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth || 380;
    canvas.height = canvas.offsetHeight || 144;
    const W = canvas.width;
    const H = canvas.height;

    const L = 38;
    const T = 18;
    const Rx = W - 38;
    const B = H - 18;
    const total = 2 * (Rx - L) + 2 * (B - T);
    const spacing = total / N_DOTS;
    dotsRef.current = Array.from({ length: N_DOTS }, (_, i) => ({
      progress: i * spacing,
    }));

    let last = 0;

    function draw(t: number) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const v = voltageRef.current;
      const current = v / RESISTANCE;
      const speed = current * 28;

      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "#060f1a";
      ctx!.fillRect(0, 0, W, H);

      // Advance dots
      if (closedRef.current) {
        for (const d of dotsRef.current) {
          d.progress = (d.progress + speed * dt) % total;
        }
      }

      // --- Circuit wires ---
      ctx!.lineWidth = 2;
      const resX = (L + Rx) / 2;
      ctx!.strokeStyle = "#1a4a6e";

      // Top wire (resistor gap)
      ctx!.beginPath();
      ctx!.moveTo(L, T);
      ctx!.lineTo(resX - 22, T);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(resX + 22, T);
      ctx!.lineTo(Rx, T);
      ctx!.stroke();

      // Right wire (LED gap)
      const ledY = (T + B) / 2;
      ctx!.beginPath();
      ctx!.moveTo(Rx, T);
      ctx!.lineTo(Rx, ledY - 12);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(Rx, ledY + 12);
      ctx!.lineTo(Rx, B);
      ctx!.stroke();

      // Bottom wire (switch)
      const swMid = (L + Rx) / 2;
      if (closedRef.current) {
        ctx!.beginPath();
        ctx!.moveTo(L, B);
        ctx!.lineTo(Rx, B);
        ctx!.stroke();
      } else {
        ctx!.beginPath();
        ctx!.moveTo(L, B);
        ctx!.lineTo(swMid - 18, B);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(swMid + 18, B);
        ctx!.lineTo(Rx, B);
        ctx!.stroke();
        ctx!.strokeStyle = "#ef4444";
        ctx!.lineWidth = 1;
        ctx!.setLineDash([3, 3]);
        ctx!.beginPath();
        ctx!.moveTo(swMid - 18, B);
        ctx!.lineTo(swMid - 4, B - 14);
        ctx!.stroke();
        ctx!.setLineDash([]);
        ctx!.lineWidth = 2;
        ctx!.strokeStyle = "#1a4a6e";
      }

      // Left wire (battery gap)
      const batY = (T + B) / 2;
      ctx!.beginPath();
      ctx!.moveTo(L, T);
      ctx!.lineTo(L, batY - 20);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(L, batY + 20);
      ctx!.lineTo(L, B);
      ctx!.stroke();

      // --- Battery symbol ---
      ctx!.strokeStyle = "#60d8e8";
      ctx!.lineWidth = 2.5;
      ctx!.beginPath();
      ctx!.moveTo(L - 11, batY - 10);
      ctx!.lineTo(L + 11, batY - 10);
      ctx!.stroke();
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(L - 7, batY + 10);
      ctx!.lineTo(L + 7, batY + 10);
      ctx!.stroke();
      ctx!.font = "8px monospace";
      ctx!.fillStyle = "#60d8e8";
      ctx!.fillText("+", L - 20, batY - 7);
      ctx!.fillText("\u2212", L - 20, batY + 14);

      // --- Resistor zigzag ---
      ctx!.strokeStyle = "#fb923c";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      const zigW = 44 / 5;
      for (let i = 0; i <= 5; i++) {
        const zx = resX - 22 + i * zigW;
        const zy = i % 2 === 0 ? T - 7 : T + 7;
        if (i === 0) ctx!.moveTo(resX - 22, T);
        ctx!.lineTo(zx, zy);
      }
      ctx!.lineTo(resX + 22, T);
      ctx!.stroke();
      ctx!.fillStyle = "#fb923c";
      ctx!.font = "8px monospace";
      ctx!.textAlign = "center";
      ctx!.fillText(`${RESISTANCE}\u03a9`, resX, T - 10);
      ctx!.textAlign = "left";

      // --- LED symbol ---
      const ledColor = closedRef.current ? "#fbbf24" : "#4a4a2a";
      ctx!.strokeStyle = ledColor;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(Rx - 10, ledY - 10);
      ctx!.lineTo(Rx + 10, ledY - 10);
      ctx!.lineTo(Rx, ledY + 8);
      ctx!.closePath();
      ctx!.stroke();
      if (closedRef.current) {
        ctx!.fillStyle = "rgba(251,191,36,0.25)";
        ctx!.fill();
        ctx!.strokeStyle = "rgba(251,191,36,0.5)";
        ctx!.lineWidth = 1;
        for (let ray = 0; ray < 4; ray++) {
          const angle = -0.5 + ray * 0.35;
          ctx!.beginPath();
          ctx!.moveTo(Rx + 11 * Math.cos(angle), ledY + 11 * Math.sin(angle));
          ctx!.lineTo(Rx + 17 * Math.cos(angle), ledY + 17 * Math.sin(angle));
          ctx!.stroke();
        }
      }
      ctx!.strokeStyle = ledColor;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(Rx - 10, ledY + 8);
      ctx!.lineTo(Rx + 10, ledY + 8);
      ctx!.stroke();

      // --- Switch label ---
      ctx!.fillStyle = closedRef.current ? "#4ade80" : "#ef4444";
      ctx!.font = "8px monospace";
      ctx!.textAlign = "center";
      ctx!.fillText(
        closedRef.current ? "SW\u22c5ON" : "SW\u22c5OFF",
        swMid,
        B + 12,
      );
      ctx!.textAlign = "left";

      // --- Current dots ---
      if (closedRef.current) {
        for (const d of dotsRef.current) {
          const pos = posOnPath(d.progress, L, T, Rx, B);
          const grd = ctx!.createRadialGradient(
            pos.x,
            pos.y,
            0,
            pos.x,
            pos.y,
            5,
          );
          grd.addColorStop(0, "#38e8ff");
          grd.addColorStop(1, "rgba(56,232,255,0)");
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          ctx!.fillStyle = grd;
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = "#38e8ff";
          ctx!.fill();
        }
      }

      // Current readout
      ctx!.font = "bold 9px monospace";
      ctx!.fillStyle = "#60d8e8";
      ctx!.fillText(`I = ${(v / RESISTANCE).toFixed(2)} A`, 6, 13);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const toggle = () => {
    const next = !closed;
    setClosed(next);
    closedRef.current = next;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-[#060f1a]"
      style={{ height: 176 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height: 144 }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#040a12] flex items-center gap-2 px-3">
        <button
          type="button"
          onClick={toggle}
          className="text-[9px] font-mono px-2 py-0.5 rounded border shrink-0 cursor-pointer"
          style={{
            borderColor: closed ? "#4ade80" : "#ef4444",
            color: closed ? "#4ade80" : "#ef4444",
            background: "transparent",
          }}
          data-ocid="concepts.toggle"
        >
          {closed ? "\u29be ON" : "\u29bf OFF"}
        </button>
        <span className="text-[9px] text-[#60d8e8] font-mono shrink-0">V:</span>
        <input
          type="range"
          min={1}
          max={12}
          value={voltage}
          onChange={(e) => {
            const v = +e.target.value;
            setVoltage(v);
            voltageRef.current = v;
          }}
          className="flex-1 h-1 cursor-pointer"
          style={{ accentColor: "#fbbf24" }}
          data-ocid="concepts.toggle"
        />
        <span className="text-[9px] text-[#fb923c] font-mono shrink-0">
          {voltage}V / {(voltage / RESISTANCE).toFixed(2)}A
        </span>
      </div>
    </div>
  );
}
