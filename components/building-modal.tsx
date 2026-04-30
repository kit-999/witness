"use client";

import { useState } from "react";
import { WitnessData, Floor } from "@/lib/types";
import { updateFloor, updateState } from "@/lib/storage";

export default function BuildingModal({
  data,
  onClose,
}: {
  data: WitnessData;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-label="building view">
        <h2>the building</h2>
        <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
          floor 100 is theoretical — nobody lives there. target band {data.state.targetLow}–{data.state.targetHigh}.
          tap a floor to edit notes from b. tap your current floor at the top to update where you are.
        </p>

        <div className="modal-row" style={{ margin: "8px 0 16px" }}>
          <span className="soft">currently at floor</span>
          <input
            type="number"
            min={0}
            max={100}
            value={data.state.currentFloor}
            onChange={(e) =>
              updateState({ currentFloor: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })
            }
            style={{
              width: 64,
              padding: "6px 8px",
              border: "1px solid var(--line)",
              borderRadius: 6,
              background: "var(--bg-soft)",
              color: "var(--ink)",
              fontFamily: "var(--sans)",
            }}
          />
          <span className="grow" />
          <button className="btn-soft subtle" onClick={onClose}>
            close
          </button>
        </div>

        <div className="building-view">
          {data.floors
            .slice()
            .sort((a, b) => b.number - a.number) // top floor first (climbing up)
            .map((f) => (
              <FloorRow
                key={f.number}
                floor={f}
                current={f.number === data.state.currentFloor}
                inTarget={f.number >= data.state.targetLow && f.number <= data.state.targetHigh}
                editing={editing === f.number}
                onEdit={() => setEditing(editing === f.number ? null : f.number)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function FloorRow({
  floor,
  current,
  inTarget,
  editing,
  onEdit,
}: {
  floor: Floor;
  current: boolean;
  inTarget: boolean;
  editing: boolean;
  onEdit: () => void;
}) {
  const [bNotes, setBNotes] = useState(floor.bNotes ?? "");

  return (
    <div
      className={`floor-row ${current ? "current" : ""} ${inTarget ? "target-edge" : ""}`}
      onClick={() => onEdit()}
      role="button"
      tabIndex={0}
    >
      <span className="num">f{floor.number}</span>
      <div className="right">
        <div className="floor-name">{floor.name}</div>
        <div className="what-changes">{floor.whatChanges}</div>
        {editing && (
          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 8 }}>
            <textarea
              placeholder="notes from b sessions about this floor (optional)"
              value={bNotes}
              onChange={(e) => setBNotes(e.target.value)}
              onBlur={() => updateFloor(floor.number, { bNotes: bNotes.trim() || undefined })}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid var(--line)",
                borderRadius: 6,
                background: "var(--bg)",
                color: "var(--ink)",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                resize: "vertical",
              }}
            />
          </div>
        )}
        {!editing && floor.bNotes && (
          <div className="b-notes">— b: {floor.bNotes}</div>
        )}
      </div>
    </div>
  );
}
