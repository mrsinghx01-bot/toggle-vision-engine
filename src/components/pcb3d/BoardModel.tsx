import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BoardDef, Part } from "@/lib/pcb-boards";
import { makeBoardTexture, routeNets, type NetPath } from "./board-texture";

/** mm → scene units */
const MM = 0.1;

function useMaterials() {
  return useMemo(() => {
    const m = {
      fr4Side: new THREE.MeshPhysicalMaterial({
        color: "#3c4a3a",
        roughness: 0.85,
        metalness: 0,
      }),
      maskTop: new THREE.MeshPhysicalMaterial({
        roughness: 0.42,
        metalness: 0.08,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
      }),
      icBody: new THREE.MeshPhysicalMaterial({
        color: "#15181c",
        roughness: 0.55,
        metalness: 0.15,
        clearcoat: 0.25,
      }),
      icTop: new THREE.MeshPhysicalMaterial({
        color: "#22262b",
        roughness: 0.35,
        metalness: 0.2,
      }),
      metal: new THREE.MeshPhysicalMaterial({
        color: "#c9ced4",
        roughness: 0.28,
        metalness: 1,
      }),
      darkMetal: new THREE.MeshPhysicalMaterial({
        color: "#7d848b",
        roughness: 0.42,
        metalness: 1,
      }),
      gold: new THREE.MeshPhysicalMaterial({
        color: "#d8b45e",
        roughness: 0.3,
        metalness: 1,
      }),
      solder: new THREE.MeshPhysicalMaterial({
        color: "#b9bec4",
        roughness: 0.35,
        metalness: 0.95,
      }),
      blackPlastic: new THREE.MeshPhysicalMaterial({
        color: "#0e1114",
        roughness: 0.6,
        metalness: 0.05,
      }),
      whitePlastic: new THREE.MeshPhysicalMaterial({
        color: "#d7dade",
        roughness: 0.6,
        metalness: 0,
      }),
      bluePlastic: new THREE.MeshPhysicalMaterial({
        color: "#1c4f9c",
        roughness: 0.55,
        metalness: 0,
      }),
      capBody: new THREE.MeshPhysicalMaterial({
        color: "#1b2126",
        roughness: 0.4,
        metalness: 0.35,
      }),
      capSleeve: new THREE.MeshPhysicalMaterial({
        color: "#12212e",
        roughness: 0.3,
        metalness: 0.5,
      }),
      resBody: new THREE.MeshPhysicalMaterial({
        color: "#1a1a1a",
        roughness: 0.7,
        metalness: 0.05,
      }),
      ceramic: new THREE.MeshPhysicalMaterial({
        color: "#a68b62",
        roughness: 0.75,
        metalness: 0,
      }),
      quartz: new THREE.MeshPhysicalMaterial({
        color: "#b7bcc2",
        roughness: 0.22,
        metalness: 1,
      }),
    };
    return m;
  }, []);
}

type Mats = ReturnType<typeof useMaterials>;

function Pins({
  part,
  mats,
  top,
}: {
  part: Part;
  mats: Mats;
  top: number;
}) {
  const rows = part.rows ?? 1;
  const n = part.pins ?? 0;
  const items: React.ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 2.54;
      const roff = (r - (rows - 1) / 2) * 2.54;
      const x = (part.rot ? roff : off) * MM;
      const z = (part.rot ? off : roff) * MM;
      items.push(
        <mesh key={`${r}-${i}`} position={[x, top + 3 * MM, z]} material={mats.gold} castShadow>
          <boxGeometry args={[0.64 * MM, 8.5 * MM, 0.64 * MM]} />
        </mesh>,
      );
    }
  }
  return <>{items}</>;
}

function PartMesh({ part, mats }: { part: Part; mats: Mats }) {
  const w = part.w * MM;
  const d = part.h * MM;
  const zh = (part.z ?? 1) * MM;

  switch (part.kind) {
    case "ic-qfp":
    case "ic-so": {
      const n = Math.max(3, Math.floor((part.pins ?? 16) / 4));
      const legs: React.ReactElement[] = [];
      for (let i = 0; i < n; i++) {
        const t = (i - (n - 1) / 2) * (w / (n + 0.6));
        legs.push(
          <mesh key={`a${i}`} position={[t, zh * 0.18, d / 2 + 0.05 * MM * 10]} material={mats.solder}>
            <boxGeometry args={[w / (n * 2.4), zh * 0.22, 0.1]} />
          </mesh>,
          <mesh key={`b${i}`} position={[t, zh * 0.18, -d / 2 - 0.05 * MM * 10]} material={mats.solder}>
            <boxGeometry args={[w / (n * 2.4), zh * 0.22, 0.1]} />
          </mesh>,
        );
        if (part.kind === "ic-qfp") {
          legs.push(
            <mesh key={`c${i}`} position={[w / 2 + 0.05, zh * 0.18, t]} material={mats.solder}>
              <boxGeometry args={[0.1, zh * 0.22, d / (n * 2.4)]} />
            </mesh>,
            <mesh key={`d${i}`} position={[-w / 2 - 0.05, zh * 0.18, t]} material={mats.solder}>
              <boxGeometry args={[0.1, zh * 0.22, d / (n * 2.4)]} />
            </mesh>,
          );
        }
      }
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.icBody} castShadow receiveShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          <mesh position={[0, zh + 0.001, 0]} material={mats.icTop}>
            <boxGeometry args={[w * 0.92, 0.004, d * 0.92]} />
          </mesh>
          {/* pin-1 dot */}
          <mesh
            position={[-w * 0.36, zh + 0.006, -d * 0.34]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={mats.whitePlastic}
          >
            <circleGeometry args={[Math.min(w, d) * 0.07, 12]} />
          </mesh>
          {legs}
        </group>
      );
    }
    case "ic-dip": {
      const n = Math.floor((part.pins ?? 28) / 2);
      const legs: React.ReactElement[] = [];
      for (let i = 0; i < n; i++) {
        const x = (i - (n - 1) / 2) * 2.54 * MM;
        legs.push(
          <mesh key={`l${i}`} position={[x, zh * 0.25, d / 2 + 0.03]} material={mats.solder}>
            <boxGeometry args={[0.5 * MM, zh * 0.5, 0.06]} />
          </mesh>,
          <mesh key={`r${i}`} position={[x, zh * 0.25, -d / 2 - 0.03]} material={mats.solder}>
            <boxGeometry args={[0.5 * MM, zh * 0.5, 0.06]} />
          </mesh>,
        );
      }
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.icBody} castShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          {/* notch */}
          <mesh
            position={[-w / 2 + 0.01, zh + 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={mats.icTop}
          >
            <circleGeometry args={[d * 0.16, 16, 0, Math.PI]} />
          </mesh>
          {legs}
        </group>
      );
    }
    case "shield": {
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.darkMetal} castShadow receiveShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          {/* module PCB skirt below the can */}
          <mesh position={[0, 0.008, 0]} material={mats.blackPlastic}>
            <boxGeometry args={[w + 0.02, 0.016, d + 0.02]} />
          </mesh>
          {/* stamped ventilation dimples */}
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (-0.4 + (i % 4) * 0.26) * (w / 2),
                zh + 0.001,
                (-0.5 + Math.floor(i / 4) * 0.5) * (d / 2),
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={mats.metal}
            >
              <circleGeometry args={[0.035, 10]} />
            </mesh>
          ))}
        </group>
      );
    }
    case "header": {
      const rows = part.rows ?? 1;
      const n = part.pins ?? 0;
      const bw = part.rot ? 2.54 * rows * MM : n * 2.54 * MM;
      const bd = part.rot ? n * 2.54 * MM : 2.54 * rows * MM;
      return (
        <group>
          <mesh position={[0, 2.5 * MM * 0.5, 0]} material={mats.blackPlastic} castShadow>
            <boxGeometry args={[bw, 2.5 * MM, bd]} />
          </mesh>
          <Pins part={part} mats={mats} top={2.5 * MM} />
        </group>
      );
    }
    case "usb-b":
    case "usb-a":
    case "rj45": {
      const bw = part.rot ? d : w;
      const bd = part.rot ? w : d;
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.metal} castShadow receiveShadow>
            <boxGeometry args={[bw, zh, bd]} />
          </mesh>
          <mesh position={[0, zh * 0.5, bd / 2 - 0.005]} material={mats.blackPlastic}>
            <boxGeometry args={[bw * 0.78, zh * 0.6, 0.03]} />
          </mesh>
          {part.kind === "usb-a" && (
            <>
              <mesh position={[0, zh * 0.68, bd / 2 - 0.02]} material={mats.bluePlastic}>
                <boxGeometry args={[bw * 0.66, zh * 0.16, 0.06]} />
              </mesh>
              <mesh position={[0, zh * 0.28, bd / 2 - 0.02]} material={mats.bluePlastic}>
                <boxGeometry args={[bw * 0.66, zh * 0.16, 0.06]} />
              </mesh>
            </>
          )}
          {part.kind === "rj45" && (
            <mesh position={[0, zh * 0.55, bd / 2 - 0.03]} material={mats.gold}>
              <boxGeometry args={[bw * 0.5, zh * 0.28, 0.02]} />
            </mesh>
          )}
        </group>
      );
    }
    case "usb-c":
    case "usb-micro":
    case "usb-mini": {
      const r = part.kind === "usb-c" ? zh / 2 : zh * 0.35;
      return (
        <group>
          <mesh
            position={[0, zh / 2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={mats.metal}
            castShadow
          >
            <capsuleGeometry args={[r, Math.max(0.001, w - r * 2), 4, 12]} />
          </mesh>
          <mesh position={[0, zh / 2, d / 2 - 0.01]} material={mats.blackPlastic}>
            <boxGeometry args={[w * 0.7, zh * 0.4, 0.04]} />
          </mesh>
        </group>
      );
    }
    case "hdmi":
    case "fpc": {
      const mat = part.kind === "fpc" ? mats.whitePlastic : mats.metal;
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mat} castShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          <mesh position={[0, zh * 0.55, 0]} material={mats.blackPlastic}>
            <boxGeometry args={[w * 0.6, zh * 0.3, d * 0.9]} />
          </mesh>
        </group>
      );
    }
    case "barrel": {
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.blackPlastic} castShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          <mesh
            position={[-w / 2, zh / 2, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={mats.blackPlastic}
          >
            <cylinderGeometry args={[zh * 0.42, zh * 0.42, 0.05, 20]} />
          </mesh>
          <mesh
            position={[-w / 2 - 0.02, zh / 2, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={mats.darkMetal}
          >
            <cylinderGeometry args={[zh * 0.2, zh * 0.2, 0.06, 14]} />
          </mesh>
        </group>
      );
    }
    case "cap-elec": {
      const r = w / 2;
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.capSleeve} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, zh, 24]} />
          </mesh>
          <mesh position={[0, zh + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.metal}>
            <circleGeometry args={[r * 0.92, 24]} />
          </mesh>
          {/* polarity stripe */}
          <mesh position={[-r * 0.99, zh / 2, 0]} material={mats.whitePlastic}>
            <boxGeometry args={[0.004, zh * 0.8, r * 0.7]} />
          </mesh>
        </group>
      );
    }
    case "crystal": {
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.quartz} castShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
        </group>
      );
    }
    case "button": {
      return (
        <group>
          <mesh position={[0, zh * 0.35, 0]} material={mats.whitePlastic} castShadow>
            <boxGeometry args={[w, zh * 0.7, d]} />
          </mesh>
          <mesh position={[0, zh * 0.85, 0]} material={mats.blackPlastic}>
            <cylinderGeometry args={[Math.min(w, d) * 0.28, Math.min(w, d) * 0.28, zh * 0.35, 16]} />
          </mesh>
        </group>
      );
    }
    case "sdcard": {
      return (
        <group>
          <mesh position={[0, zh / 2, 0]} material={mats.darkMetal} castShadow>
            <boxGeometry args={[w, zh, d]} />
          </mesh>
          <mesh position={[-w / 2 + 0.01, zh * 0.5, 0]} material={mats.blackPlastic}>
            <boxGeometry args={[0.03, zh * 0.7, d * 0.8]} />
          </mesh>
        </group>
      );
    }
    case "led": {
      const color = part.color ?? "#6ee36e";
      return (
        <group>
          <mesh position={[0, zh / 2 + 0.004, 0]} castShadow>
            <boxGeometry args={[w * 0.62, 0.045, d]} />
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.6}
              roughness={0.3}
              transmission={0.2}
            />
          </mesh>
          <mesh position={[-w * 0.42, 0.02, 0]} material={mats.solder}>
            <boxGeometry args={[w * 0.3, 0.03, d]} />
          </mesh>
          <mesh position={[w * 0.42, 0.02, 0]} material={mats.solder}>
            <boxGeometry args={[w * 0.3, 0.03, d]} />
          </mesh>
        </group>
      );
    }
    case "cap-smd":
    case "res-smd":
    default: {
      const body = part.kind === "cap-smd" ? mats.ceramic : mats.resBody;
      const hh = part.kind === "cap-smd" ? 0.055 : 0.04;
      return (
        <group>
          <mesh position={[0, hh / 2 + 0.002, 0]} material={body} castShadow>
            <boxGeometry args={[w * 0.68, hh, d]} />
          </mesh>
          <mesh position={[-w * 0.4, hh / 2, 0]} material={mats.solder}>
            <boxGeometry args={[w * 0.28, hh * 1.05, d * 1.02]} />
          </mesh>
          <mesh position={[w * 0.4, hh / 2, 0]} material={mats.solder}>
            <boxGeometry args={[w * 0.28, hh * 1.05, d * 1.02]} />
          </mesh>
        </group>
      );
    }
  }
}

/** Animated electrical pulses that travel along the routed copper. */
function Pulses({ nets, y, count = 22 }: { nets: NetPath[]; y: number; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const curves = useMemo(
    () =>
      nets.slice(0, count).map((p) => {
        const pts = p.map((pt) => new THREE.Vector3(pt.x * MM, y, -pt.y * MM));
        return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.02);
      }),
    [nets, count, y],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    curves.forEach((c, i) => {
      const speed = 0.16 + (i % 5) * 0.05;
      const u = (t * speed + i * 0.37) % 1;
      const p = c.getPointAt(u);
      dummy.position.copy(p);
      const s = 0.5 + Math.sin(u * Math.PI) * 0.9;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, curves.length]} frustumCulled={false}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color="#8ef7b0" toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  );
}

export function BoardModel({
  board,
  explode = 0,
  onHover,
  pulses = true,
}: {
  board: BoardDef;
  explode?: number;
  onHover?: (part: Part | null) => void;
  pulses?: boolean;
}) {
  const mats = useMaterials();
  const nets = useMemo(() => routeNets(board), [board]);
  const texture = useMemo(() => {
    const canvas = makeBoardTexture(board, nets);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [board, nets]);

  const topMat = useMemo(() => {
    const m = mats.maskTop.clone();
    m.map = texture;
    return m;
  }, [mats.maskTop, texture]);

  const th = board.thickness * MM;
  const boardMats = useMemo(
    () => [mats.fr4Side, mats.fr4Side, topMat, mats.fr4Side, mats.fr4Side, mats.fr4Side],
    [mats.fr4Side, topMat],
  );

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        material={boardMats}
        onPointerOut={() => onHover?.(null)}
      >
        <boxGeometry args={[board.w * MM, th, board.h * MM]} />
      </mesh>

      {board.parts.map((part, i) => {
        const lift = explode * (0.35 + ((i * 37) % 11) * 0.11);
        return (
          <group
            key={part.id + i}
            position={[part.x * MM, th / 2 + lift, -part.y * MM]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover?.(part);
            }}
          >
            <PartMesh part={part} mats={mats} />
          </group>
        );
      })}

      {pulses && <Pulses nets={nets} y={th / 2 + 0.012} />}
    </group>
  );
}
