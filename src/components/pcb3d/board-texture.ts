import type { BoardDef, Part } from "@/lib/pcb-boards";

export type Pt = { x: number; y: number };
/** Manhattan-routed net path in board mm coordinates. */
export type NetPath = Pt[];

const rand = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 8) & 0xffff) / 0xffff;
  };
};

/** Deterministic manhattan route between two parts. */
export function routeNets(board: BoardDef): NetPath[] {
  const rnd = rand(board.id.length * 977 + board.parts.length);
  const out: NetPath[] = [];
  for (const [a, b] of board.nets) {
    const pa = board.parts[a];
    const pb = board.parts[b];
    if (!pa || !pb) continue;
    const ax = pa.x + (rnd() - 0.5) * pa.w * 0.5;
    const ay = pa.y + (rnd() - 0.5) * pa.h * 0.5;
    const bx = pb.x + (rnd() - 0.5) * pb.w * 0.5;
    const by = pb.y + (rnd() - 0.5) * pb.h * 0.5;
    const midX = ax + (bx - ax) * (0.35 + rnd() * 0.35);
    out.push([
      { x: ax, y: ay },
      { x: midX, y: ay },
      { x: midX, y: by },
      { x: bx, y: by },
    ]);
  }
  // filler routing for visual density
  for (let i = 0; i < 26; i++) {
    const ax = (rnd() - 0.5) * board.w * 0.88;
    const ay = (rnd() - 0.5) * board.h * 0.86;
    const bx = ax + (rnd() - 0.5) * board.w * 0.35;
    const by = ay + (rnd() - 0.5) * board.h * 0.4;
    const midX = ax + (bx - ax) * 0.5;
    out.push([
      { x: ax, y: ay },
      { x: midX, y: ay },
      { x: midX, y: by },
      { x: bx, y: by },
    ]);
  }
  return out;
}

function pads(part: Part, ctx: CanvasRenderingContext2D, toPx: (x: number, y: number) => Pt) {
  ctx.fillStyle = "#d9b25c";
  const drawPad = (x: number, y: number, w: number, h: number) => {
    const p = toPx(x - w / 2, y + h / 2);
    const q = toPx(x + w / 2, y - h / 2);
    ctx.fillRect(Math.min(p.x, q.x), Math.min(p.y, q.y), Math.abs(q.x - p.x), Math.abs(q.y - p.y));
  };
  const ring = (x: number, y: number, r: number) => {
    const c = toPx(x, y);
    const e = toPx(x + r, y);
    ctx.beginPath();
    ctx.arc(c.x, c.y, Math.abs(e.x - c.x), 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "#0b0d0f";
    ctx.beginPath();
    ctx.arc(c.x, c.y, Math.abs(e.x - c.x) * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  switch (part.kind) {
    case "header": {
      const rows = part.rows ?? 1;
      for (let r = 0; r < rows; r++) {
        for (let i = 0; i < (part.pins ?? 0); i++) {
          const off = (i - ((part.pins ?? 1) - 1) / 2) * 2.54;
          const roff = (r - (rows - 1) / 2) * 2.54;
          const x = part.rot ? part.x + roff : part.x + off;
          const y = part.rot ? part.y + off : part.y + roff;
          ring(x, y, 0.9);
        }
      }
      break;
    }
    case "ic-dip": {
      const n = Math.floor((part.pins ?? 28) / 2);
      for (let i = 0; i < n; i++) {
        const x = part.x + (i - (n - 1) / 2) * 2.54;
        ring(x, part.y + part.h / 2 + 1.2, 0.8);
        ring(x, part.y - part.h / 2 - 1.2, 0.8);
      }
      break;
    }
    case "ic-qfp":
    case "ic-so": {
      const n = Math.max(3, Math.floor((part.pins ?? 16) / 4));
      for (let i = 0; i < n; i++) {
        const t = (i - (n - 1) / 2) * (part.w / (n + 1));
        drawPad(part.x + t, part.y + part.h / 2 + 0.6, part.w / (n * 2.2), 1.1);
        drawPad(part.x + t, part.y - part.h / 2 - 0.6, part.w / (n * 2.2), 1.1);
        if (part.kind === "ic-qfp") {
          drawPad(part.x + part.w / 2 + 0.6, part.y + t, 1.1, part.h / (n * 2.2));
          drawPad(part.x - part.w / 2 - 0.6, part.y + t, 1.1, part.h / (n * 2.2));
        }
      }
      break;
    }
    case "res-smd":
    case "cap-smd":
    case "led": {
      drawPad(part.x - part.w * 0.42, part.y, part.w * 0.36, part.h);
      drawPad(part.x + part.w * 0.42, part.y, part.w * 0.36, part.h);
      break;
    }
    default: {
      drawPad(part.x - part.w / 2, part.y, 1.6, part.h * 0.7);
      drawPad(part.x + part.w / 2, part.y, 1.6, part.h * 0.7);
    }
  }
}

/**
 * Bakes soldermask, copper pour hatch, traces, pads and silkscreen into a texture
 * for the top face of the board.
 */
export function makeBoardTexture(board: BoardDef, nets: NetPath[], flipV = false) {
  const S = 16; // px per mm
  const W = Math.round(board.w * S);
  const H = Math.round(board.h * S);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const toPx = (x: number, y: number): Pt => ({
    x: (x + board.w / 2) * S,
    y: flipV ? (y + board.h / 2) * S : (board.h / 2 - y) * S,
  });

  // soldermask base with subtle non-uniformity
  ctx.fillStyle = board.mask;
  ctx.fillRect(0, 0, W, H);
  const grd = ctx.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, "rgba(255,255,255,0.06)");
  grd.addColorStop(0.5, "rgba(0,0,0,0.05)");
  grd.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // copper ground pour: fine hatch, visible through the mask
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#c98f42";
  ctx.lineWidth = 1.2;
  for (let i = -H; i < W; i += 7) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // traces (mask-covered copper reads darker/greener than exposed pads)
  const drawPath = (p: NetPath, width: number, color: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * S;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    p.forEach((pt, i) => {
      const q = toPx(pt.x, pt.y);
      if (i) ctx.lineTo(q.x, q.y);
      else ctx.moveTo(q.x, q.y);
    });
    ctx.stroke();
  };
  nets.forEach((p, i) => {
    drawPath(p, 0.5, "#000000", 0.22);
    drawPath(p, 0.35, i % 3 === 0 ? "#caa15f" : "#a8考".slice(0, 0) + "#b2854a", 0.55);
  });
  ctx.globalAlpha = 1;

  // exposed pads
  for (const part of board.parts) pads(part, ctx, toPx);

  // silkscreen
  ctx.strokeStyle = board.silk;
  ctx.fillStyle = board.silk;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.6;
  // board outline inset
  ctx.strokeRect(3, 3, W - 6, H - 6);
  for (const part of board.parts) {
    const a = toPx(part.x - part.w / 2 - 0.4, part.y + part.h / 2 + 0.4);
    const b = toPx(part.x + part.w / 2 + 0.4, part.y - part.h / 2 - 0.4);
    ctx.strokeRect(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y),
    );
    const label = part.id;
    const size = Math.max(7, Math.min(14, part.w * S * 0.22));
    ctx.font = `500 ${size}px ui-monospace, monospace`;
    const c = toPx(part.x, part.y + part.h / 2 + 1.4);
    ctx.fillText(label, c.x - ctx.measureText(label).width / 2, c.y);
  }
  ctx.globalAlpha = 1;

  // mounting holes
  for (const h of board.holes) {
    const c = toPx(h.x, h.y);
    const e = toPx(h.x + h.r + 0.7, h.y);
    ctx.fillStyle = "#cfcfcf";
    ctx.beginPath();
    ctx.arc(c.x, c.y, Math.abs(e.x - c.x), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#05070a";
    ctx.beginPath();
    ctx.arc(c.x, c.y, Math.abs(e.x - c.x) * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}
