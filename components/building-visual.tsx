"use client";

import { useMemo } from "react";
import { WitnessData } from "@/lib/types";

/**
 * SVG visualization of the 100-story building.
 *
 * Aesthetic: an actual apartment building, not a cathedral. Grounded.
 * - Each floor is a horizontal band. Windows lit on floors with content.
 * - Current floor: warm coral glow.
 * - Target band (low..high): faint dashed coral outline at top + bottom.
 * - Ladders attached to a floor: small upward "↑" tick on the right side
 *   of that floor band, soft blue.
 * - Chutes attached to a floor: small downward "↓" tick on the right side,
 *   slightly darker blue.
 * - Tap a floor to scroll to its floor card below.
 */
export default function BuildingVisual({
  data,
  onFloorClick,
}: {
  data: WitnessData;
  onFloorClick?: (floor: number) => void;
}) {
  const { state, floors, ladders, chutes } = data;

  // Layout
  const floorH = 6; // height of each floor band in px
  const totalH = 101 * floorH; // floors 0..100 inclusive
  const W = 240;

  // Building structure
  const buildingW = 160;
  const buildingX = 40;
  const labelGap = 20;

  // Index ladders/chutes by floor number
  const ladderFloors = useMemo(() => {
    const set = new Set<number>();
    for (const l of ladders) if (l.floor !== undefined) set.add(l.floor);
    return set;
  }, [ladders]);

  const chuteFloors = useMemo(() => {
    const set = new Set<number>();
    for (const c of chutes) if (c.floor !== undefined) set.add(c.floor);
    return set;
  }, [chutes]);

  // Floors with any seeded or user-written content (for "lit windows")
  const litFloors = useMemo(() => {
    const set = new Set<number>();
    for (const f of floors) {
      if ((f.name && f.name.length > 0) || (f.whatChanges && f.whatChanges.length > 0) || f.bNotes) {
        set.add(f.number);
      }
    }
    return set;
  }, [floors]);

  // y coordinate: floor 0 at bottom, floor 100 at top
  const floorY = (n: number) => totalH - (n + 1) * floorH;

  // Mark target band edges with dashed lines
  const targetTopY = floorY(state.targetHigh);
  const targetBottomY = floorY(state.targetLow) + floorH; // bottom of target low band

  return (
    <div className="building-visual">
      <svg
        viewBox={`0 0 ${W} ${totalH + 30}`}
        width="100%"
        height={Math.min(560, totalH)}
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="building overview"
      >
        {/* ground line */}
        <line
          x1={0}
          x2={W}
          y1={totalH}
          y2={totalH}
          stroke="var(--ink-faint)"
          strokeWidth={0.5}
        />

        {/* building outline */}
        <rect
          x={buildingX}
          y={0}
          width={buildingW}
          height={totalH}
          fill="var(--bg-soft)"
          stroke="var(--line)"
          strokeWidth={1}
        />

        {/* roof — small triangle/cap */}
        <line
          x1={buildingX}
          x2={buildingX + buildingW}
          y1={0}
          y2={0}
          stroke="var(--ink-soft)"
          strokeWidth={1}
        />

        {/* target band — soft horizontal lines */}
        <line
          x1={buildingX - 4}
          x2={buildingX + buildingW + 4}
          y1={targetTopY}
          y2={targetTopY}
          stroke="var(--blue)"
          strokeWidth={0.6}
          strokeDasharray="3 3"
        />
        <line
          x1={buildingX - 4}
          x2={buildingX + buildingW + 4}
          y1={targetBottomY}
          y2={targetBottomY}
          stroke="var(--blue)"
          strokeWidth={0.6}
          strokeDasharray="3 3"
        />
        {/* target band fill */}
        <rect
          x={buildingX}
          y={targetTopY}
          width={buildingW}
          height={targetBottomY - targetTopY}
          fill="var(--blue-pale)"
          opacity={0.4}
        />

        {/* floor bands (skip 0 — ground) */}
        {Array.from({ length: 101 }, (_, n) => {
          const y = floorY(n);
          const isCurrent = n === state.currentFloor;
          const lit = litFloors.has(n);
          const hasLadder = ladderFloors.has(n);
          const hasChute = chuteFloors.has(n);

          return (
            <g
              key={n}
              onClick={() => onFloorClick?.(n)}
              style={{ cursor: onFloorClick ? "pointer" : "default" }}
            >
              {/* Hover/click target */}
              <rect
                x={buildingX - 6}
                y={y}
                width={buildingW + 12}
                height={floorH}
                fill="transparent"
              />

              {/* current-floor coral fill */}
              {isCurrent && (
                <rect
                  x={buildingX}
                  y={y}
                  width={buildingW}
                  height={floorH}
                  fill="var(--coral-soft)"
                  opacity={0.9}
                />
              )}

              {/* floor divider */}
              {n > 0 && (
                <line
                  x1={buildingX}
                  x2={buildingX + buildingW}
                  y1={y + floorH}
                  y2={y + floorH}
                  stroke="var(--line)"
                  strokeWidth={0.4}
                />
              )}

              {/* windows — small rectangles. lit if floor has content. */}
              {n > 0 && Array.from({ length: 4 }, (_, w) => {
                const wx = buildingX + 14 + w * 35;
                const wy = y + 1.5;
                const ww = 18;
                const wh = floorH - 3;
                return (
                  <rect
                    key={w}
                    x={wx}
                    y={wy}
                    width={ww}
                    height={wh}
                    fill={lit ? "var(--coral)" : "var(--ink-faint)"}
                    opacity={lit ? (isCurrent ? 1 : 0.6) : 0.18}
                  />
                );
              })}

              {/* ladder marker — left side, upward chevron */}
              {hasLadder && (
                <g>
                  <line
                    x1={buildingX - 16}
                    x2={buildingX - 6}
                    y1={y + floorH / 2}
                    y2={y + floorH / 2}
                    stroke="var(--coral)"
                    strokeWidth={1}
                  />
                  <polyline
                    points={`${buildingX - 12},${y + floorH / 2 + 2} ${buildingX - 6},${y + floorH / 2} ${buildingX - 12},${y + floorH / 2 - 2}`}
                    fill="none"
                    stroke="var(--coral)"
                    strokeWidth={1}
                  />
                </g>
              )}

              {/* chute marker — right side, downward chevron */}
              {hasChute && (
                <g>
                  <line
                    x1={buildingX + buildingW + 6}
                    x2={buildingX + buildingW + 16}
                    y1={y + floorH / 2}
                    y2={y + floorH / 2}
                    stroke="var(--blue)"
                    strokeWidth={1}
                  />
                  <polyline
                    points={`${buildingX + buildingW + 6},${y + floorH / 2 + 2} ${buildingX + buildingW + 12},${y + floorH / 2} ${buildingX + buildingW + 6},${y + floorH / 2 - 2}`}
                    fill="none"
                    stroke="var(--blue)"
                    strokeWidth={1}
                  />
                </g>
              )}

              {/* labels every 10 floors for orientation */}
              {n % 10 === 0 && (
                <text
                  x={buildingX + buildingW + labelGap}
                  y={y + floorH / 2 + 3}
                  fontSize={8}
                  fontFamily="-apple-system, system-ui, sans-serif"
                  fill="var(--ink-faint)"
                >
                  {n}
                </text>
              )}

              {/* current floor — small "you" marker */}
              {isCurrent && (
                <text
                  x={buildingX - labelGap - 8}
                  y={y + floorH / 2 + 3}
                  fontSize={9}
                  fontFamily="-apple-system, system-ui, sans-serif"
                  fontStyle="italic"
                  fill="var(--coral)"
                  textAnchor="end"
                >
                  here
                </text>
              )}
            </g>
          );
        })}

        {/* ground label */}
        <text
          x={buildingX + buildingW / 2}
          y={totalH + 14}
          fontSize={9}
          fontFamily="-apple-system, system-ui, sans-serif"
          fill="var(--ink-faint)"
          textAnchor="middle"
        >
          ground
        </text>
      </svg>
    </div>
  );
}
