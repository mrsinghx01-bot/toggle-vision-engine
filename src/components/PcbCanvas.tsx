import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Procedural pseudo-3D PCB rendered on canvas.
 * No external 3D assets: geometry, traces, pads and components are generated.
 */

type Vec3 = { x: number; y: number; z: number };

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Part = { x: number; y: number; w: number; h: number; z: number; kind: number };

function buildBoard(seed: number) {
  const rnd = mulberry(seed);
  const parts: Part[] = [
    { x: -0.1, y: -0.05, w: 0.34, h: 0.3, z: 0.055, kind: 0 }, // MCU
    { x: 0.5, y: -0.42, w: 0.16, h: 0.14, z: 0.04, kind: 0 }, // sensor
    { x: -0.6, y: 0.34, w: 0.2, h: 0.16, z: 0.04, kind: 0 }, // pmic
    { x: -0.86, y: -0.1, w: 0.12, h: 0.24, z: 0.07, kind: 1 }, // usb-c
    { x: 0.52, y: 0.4, w: 0.22, h: 0.1, z: 0.012, kind: 2 }, // antenna
    { x: 0.14, y: 0.52, w: 0.07, h: 0.05, z: 0.025, kind: 3 }, // led
    { x: -0.4, y: -0.5, w: 0.2, h: 0.1, z: 0.05, kind: 1 }, // batt conn
  ];
  for (let i = 0; i < 16; i++) {
    parts.push({
      x: rnd() * 1.7 - 0.85,
      y: rnd() * 1.6 - 0.8,
      w: 0.055,
      h: 0.035,
      z: 0.018,
      kind: 3,
    });
  }

  // Manhattan traces between believable endpoints.
  const traces: { pts: Vec3[]; layer: number }[] = [];
  const addTrace = (ax: number, ay: number, bx: number, by: number, layer: number) => {
    const midX = ax + (bx - ax) * (0.35 + rnd() * 0.3);
    const pts: Vec3[] = [
      { x: ax, y: ay, z: 0 },
      { x: midX, y: ay, z: 0 },
      { x: midX, y: by, z: 0 },
      { x: bx, y: by, z: 0 },
    ];
    traces.push({ pts, layer });
  };
  for (const p of parts.slice(1)) {
    addTrace(0.05, 0.02, p.x, p.y, rnd() > 0.55 ? 1 : 0);
  }
  for (let i = 0; i < 22; i++) {
    const ax = rnd() * 1.8 - 0.9;
    const ay = rnd() * 1.7 - 0.85;
    addTrace(ax, ay, ax + (rnd() * 0.8 - 0.4), ay + (rnd() * 0.8 - 0.4), rnd() > 0.5 ? 1 : 0);
  }

  const vias: Vec3[] = [];
  for (let i = 0; i < 34; i++) {
    vias.push({ x: rnd() * 1.8 - 0.9, y: rnd() * 1.7 - 0.85, z: 0 });
  }
  return { parts, traces, vias };
}

export function PcbCanvas({
  className,
  seed = 7,
  spin = 0.12,
  interactive = true,
}: {
  className?: string;
  seed?: number;
  spin?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const board = buildBoard(seed);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = true;
    let t = 0;
    let dpr = 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((es) => {
            running = es.some((e) => e.isIntersecting);
          })
        : null;
    io?.observe(canvas);

    const project = (p: Vec3, yaw: number, pitch: number) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const x1 = p.x * cy - p.z * sy;
      const z1 = p.x * sy + p.z * cy;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;
      const f = 3.2;
      const scale = (f / (f + z2)) * Math.min(w, h) * 0.42;
      return { x: w / 2 + x1 * scale, y: h / 2 + y2 * scale, s: scale, z: z2 };
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      t += reduced ? 0 : 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      const yaw = (reduced ? 0.5 : t * spin) + pointer.x * 0.35;
      const pitch = 1.02 + pointer.y * 0.18;

      ctx.clearRect(0, 0, w, h);

      // board substrate
      const corners: Vec3[] = [
        { x: -1, y: -0.92, z: 0 },
        { x: 1, y: -0.92, z: 0 },
        { x: 1, y: 0.92, z: 0 },
        { x: -1, y: 0.92, z: 0 },
      ].map((c) => c);
      const pc = corners.map((c) => project(c, yaw, pitch));
      ctx.beginPath();
      pc.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      const g = ctx.createLinearGradient(pc[0]!.x, pc[0]!.y, pc[2]!.x, pc[2]!.y);
      g.addColorStop(0, "oklch(0.26 0.05 158 / 0.92)");
      g.addColorStop(1, "oklch(0.19 0.03 160 / 0.92)");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "oklch(0.82 0.19 148 / 0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // ground plane hatch
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = "oklch(0.82 0.19 148 / 0.06)";
      ctx.lineWidth = 1;
      for (let i = -1; i <= 1.01; i += 0.08) {
        const a = project({ x: i, y: -0.92, z: 0 }, yaw, pitch);
        const b = project({ x: i, y: 0.92, z: 0 }, yaw, pitch);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();

      // traces
      board.traces.forEach((tr, i) => {
        const pulse = reduced ? 0.5 : (Math.sin(t * 1.1 + i * 0.9) + 1) / 2;
        ctx.strokeStyle =
          tr.layer === 0
            ? `oklch(0.82 0.19 148 / ${0.2 + pulse * 0.5})`
            : `oklch(0.74 0.13 62 / ${0.14 + pulse * 0.3})`;
        ctx.lineWidth = tr.layer === 0 ? 1.6 : 1.1;
        ctx.beginPath();
        tr.pts.forEach((p, j) => {
          const q = project(p, yaw, pitch);
          if (j) ctx.lineTo(q.x, q.y);
          else ctx.moveTo(q.x, q.y);
        });
        ctx.stroke();
      });

      // vias
      ctx.fillStyle = "oklch(0.86 0.02 160 / 0.55)";
      board.vias.forEach((v) => {
        const q = project(v, yaw, pitch);
        ctx.beginPath();
        ctx.arc(q.x, q.y, Math.max(1, q.s * 0.008), 0, Math.PI * 2);
        ctx.fill();
      });

      // components (extruded boxes, painter-sorted)
      const sorted = [...board.parts].sort((a, b) => {
        const za = project({ x: a.x, y: a.y, z: 0 }, yaw, pitch).z;
        const zb = project({ x: b.x, y: b.y, z: 0 }, yaw, pitch).z;
        return zb - za;
      });
      for (const p of sorted) {
        const base: Vec3[] = [
          { x: p.x - p.w, y: p.y - p.h, z: 0 },
          { x: p.x + p.w, y: p.y - p.h, z: 0 },
          { x: p.x + p.w, y: p.y + p.h, z: 0 },
          { x: p.x - p.w, y: p.y + p.h, z: 0 },
        ];
        const top = base.map((b) => ({ ...b, z: p.z }));
        const pb = base.map((b) => project(b, yaw, pitch));
        const pt = top.map((b) => project(b, yaw, pitch));

        // sides
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          ctx.beginPath();
          ctx.moveTo(pb[i]!.x, pb[i]!.y);
          ctx.lineTo(pb[j]!.x, pb[j]!.y);
          ctx.lineTo(pt[j]!.x, pt[j]!.y);
          ctx.lineTo(pt[i]!.x, pt[i]!.y);
          ctx.closePath();
          ctx.fillStyle = "oklch(0.2 0.01 160 / 0.95)";
          ctx.fill();
        }
        // top face
        ctx.beginPath();
        pt.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
        ctx.closePath();
        ctx.fillStyle =
          p.kind === 0
            ? "oklch(0.28 0.008 160)"
            : p.kind === 1
              ? "oklch(0.62 0.01 160)"
              : p.kind === 2
                ? "oklch(0.74 0.13 62 / 0.5)"
                : "oklch(0.34 0.008 160)";
        ctx.fill();
        ctx.strokeStyle = "oklch(0.86 0.02 160 / 0.28)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (p.kind === 3 && !reduced) {
          const q = project({ x: p.x, y: p.y, z: p.z }, yaw, pitch);
          const glow = (Math.sin(t * 2 + p.x * 6) + 1) / 2;
          ctx.fillStyle = `oklch(0.82 0.19 148 / ${0.1 + glow * 0.5})`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, Math.max(1.5, q.s * 0.014), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      io?.disconnect();
    };
  }, [seed, spin, interactive, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    />
  );
}
