"use client";

import { useState } from "react";
import { WitnessData, Floor, Ladder, Chute } from "@/lib/types";
import {
  updateFloor,
  updateState,
  addLadder,
  addChute,
  deleteLadder,
  deleteChute,
  updateLadder,
  updateChute,
  addEntry,
} from "@/lib/storage";

/**
 * The interactive building. Vertical column of floor cards.
 * Default view: current floor + 10 above. Slider to change the window.
 * Each floor card: name (italic), "what would be true if" (editable inline),
 * attached ladders + chutes, b-notes, add buttons inline.
 */
export default function Building({
  data,
  windowLow,
  setWindowLow,
}: {
  data: WitnessData;
  windowLow: number;
  setWindowLow: (n: number) => void;
}) {
  const { state, floors } = data;
  const windowSize = 11;
  const windowHigh = Math.min(100, windowLow + windowSize - 1);

  const visibleFloors = floors
    .filter((f) => f.number >= windowLow && f.number <= windowHigh)
    .sort((a, b) => b.number - a.number); // higher floors at top

  const ladderByFloor = (n: number) => data.ladders.filter((l) => l.floor === n);
  const chuteByFloor = (n: number) => data.chutes.filter((c) => c.floor === n);

  return (
    <section className="building-section">
      {/* Header — current floor + slider */}
      <div className="building-head">
        <div className="head-row">
          <div>
            <span className="floor-num">floor {state.currentFloor}</span>
            <span className="head-target">target {state.targetLow}–{state.targetHigh}</span>
          </div>
          <div className="head-current-edit">
            <label className="soft" style={{ fontSize: 13 }}>
              currently at
              <input
                type="number"
                min={0}
                max={100}
                value={state.currentFloor}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                  updateState({ currentFloor: v });
                  // recenter the window if needed
                  if (v < windowLow || v > windowHigh) setWindowLow(v);
                }}
              />
            </label>
          </div>
        </div>

        {/* Floor range slider */}
        <div className="head-row" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
          <span className="soft" style={{ fontSize: 12, fontFamily: "var(--sans)" }}>
            viewing
          </span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, minWidth: 70 }}>
            f{windowLow}–f{windowHigh}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, 100 - windowSize + 1)}
            value={windowLow}
            onChange={(e) => setWindowLow(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--coral)" }}
          />
          <button
            className="btn-soft subtle"
            style={{ padding: "4px 10px", fontSize: 12 }}
            onClick={() => setWindowLow(state.currentFloor)}
            title="recenter on current floor"
          >
            ↺ here
          </button>
        </div>
      </div>

      <div className="building-body">
        {visibleFloors.length === 0 && (
          <div className="empty-state">no floors in this range.</div>
        )}
        {visibleFloors.map((f) => (
          <div key={f.number} id={`floor-card-${f.number}`}>
            <FloorCard
              floor={f}
              current={f.number === state.currentFloor}
              inTarget={f.number >= state.targetLow && f.number <= state.targetHigh}
              ladders={ladderByFloor(f.number)}
              chutes={chuteByFloor(f.number)}
              onSetCurrent={() => updateState({ currentFloor: f.number })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function FloorCard({
  floor,
  current,
  inTarget,
  ladders,
  chutes,
  onSetCurrent,
}: {
  floor: Floor;
  current: boolean;
  inTarget: boolean;
  ladders: Ladder[];
  chutes: Chute[];
  onSetCurrent: () => void;
}) {
  const [editingDesc, setEditingDesc] = useState(false);
  const [desc, setDesc] = useState(floor.whatChanges);
  const [editingBNotes, setEditingBNotes] = useState(false);
  const [bNotes, setBNotes] = useState(floor.bNotes ?? "");
  const [addingLadder, setAddingLadder] = useState(false);
  const [addingChute, setAddingChute] = useState(false);

  return (
    <div className={`floor-card ${current ? "current" : ""} ${inTarget ? "in-target" : ""}`}>
      <div className="floor-card-head">
        <div>
          <span className="floor-num-small">f{floor.number}</span>
          <span className="floor-name-inline">{floor.name}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!current && (
            <button
              className="btn-link"
              onClick={onSetCurrent}
              style={{ fontSize: 12 }}
              title="mark as your current floor"
            >
              i&apos;m here
            </button>
          )}
          {current && <span className="here-tag">← here</span>}
          {inTarget && !current && <span className="target-tag">target</span>}
        </div>
      </div>

      {/* What would be true if (description) */}
      <div className="floor-section">
        <div className="floor-section-label">
          what would be true if you were here{" "}
          {!editingDesc && (
            <button
              className="btn-link"
              style={{ fontSize: 11, marginLeft: 6 }}
              onClick={() => setEditingDesc(true)}
            >
              edit
            </button>
          )}
        </div>
        {editingDesc ? (
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={() => {
              updateFloor(floor.number, { whatChanges: desc.trim() });
              setEditingDesc(false);
            }}
            autoFocus
            rows={4}
            style={inputStyle}
          />
        ) : (
          <div className="what-would-be-true">{floor.whatChanges}</div>
        )}
      </div>

      {/* Ladders attached to this floor */}
      <div className="floor-section">
        <div className="floor-section-label">
          ladders to f{floor.number}
          <button
            className="btn-link"
            style={{ fontSize: 11, marginLeft: 6 }}
            onClick={() => setAddingLadder(!addingLadder)}
          >
            {addingLadder ? "cancel" : "+ add"}
          </button>
        </div>

        {ladders.length === 0 && !addingLadder && (
          <div className="floor-empty">no ladders attached to this floor yet.</div>
        )}

        {ladders.map((l) => (
          <FloorLadderRow key={l.id} ladder={l} />
        ))}

        {addingLadder && (
          <FloorAddForm
            kind="ladder"
            placeholder="practice that lifts toward this floor"
            onSave={(name, desc) => {
              addLadder(name, desc, "witness", floor.number);
              setAddingLadder(false);
            }}
          />
        )}
      </div>

      {/* Chutes attached to this floor */}
      <div className="floor-section">
        <div className="floor-section-label">
          chutes from f{floor.number}
          <button
            className="btn-link"
            style={{ fontSize: 11, marginLeft: 6 }}
            onClick={() => setAddingChute(!addingChute)}
          >
            {addingChute ? "cancel" : "+ add"}
          </button>
        </div>

        {chutes.length === 0 && !addingChute && (
          <div className="floor-empty">no chutes attached to this floor yet.</div>
        )}

        {chutes.map((c) => (
          <FloorChuteRow key={c.id} chute={c} />
        ))}

        {addingChute && (
          <FloorAddForm
            kind="chute"
            placeholder="pattern that drops you from this floor"
            onSave={(name, desc) => {
              addChute(name, desc, floor.number);
              setAddingChute(false);
            }}
          />
        )}
      </div>

      {/* B notes */}
      <div className="floor-section">
        <div className="floor-section-label">
          notes from b{" "}
          {!editingBNotes && (
            <button
              className="btn-link"
              style={{ fontSize: 11, marginLeft: 6 }}
              onClick={() => setEditingBNotes(true)}
            >
              {floor.bNotes ? "edit" : "+ add"}
            </button>
          )}
        </div>
        {editingBNotes ? (
          <textarea
            value={bNotes}
            onChange={(e) => setBNotes(e.target.value)}
            onBlur={() => {
              updateFloor(floor.number, { bNotes: bNotes.trim() || undefined });
              setEditingBNotes(false);
            }}
            autoFocus
            rows={3}
            placeholder="what came out of session about this floor"
            style={inputStyle}
          />
        ) : floor.bNotes ? (
          <div className="b-notes-line">— b: {floor.bNotes}</div>
        ) : null}
      </div>
    </div>
  );
}

function FloorLadderRow({ ladder }: { ladder: Ladder }) {
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ladder.name);
  const [desc, setDesc] = useState(ladder.description ?? "");

  if (editing) {
    return (
      <div className="floor-attachment edit">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="ladder name"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder="description"
          style={{ ...inputStyle, marginTop: 6 }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button
            className="btn-soft"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => {
              updateLadder(ladder.id, { name: name.trim() || ladder.name, description: desc.trim() || undefined });
              setEditing(false);
            }}
          >
            save
          </button>
          <button
            className="btn-soft danger"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => {
              if (confirm(`delete "${ladder.name}"?`)) {
                deleteLadder(ladder.id);
              }
            }}
          >
            delete
          </button>
          <button
            className="btn-soft subtle"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => setEditing(false)}
          >
            cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="floor-attachment ladder">
      <div className="att-name">↑ {ladder.name}</div>
      {ladder.description && <div className="att-desc">{ladder.description}</div>}
      <div className="att-actions">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='optional "i tried..."'
          style={{ ...inputStyle, flex: 1, minWidth: 100, fontSize: 13 }}
        />
        <button
          className="btn-soft"
          style={{ fontSize: 12, padding: "4px 10px" }}
          onClick={() => {
            addEntry({ kind: "ladder", ref_id: ladder.id, ref_name: ladder.name, note: note.trim() || undefined });
            setNote("");
          }}
        >
          log attempt
        </button>
        <button
          className="btn-link"
          style={{ fontSize: 11 }}
          onClick={() => setEditing(true)}
        >
          edit
        </button>
      </div>
    </div>
  );
}

function FloorChuteRow({ chute }: { chute: Chute }) {
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(chute.name);
  const [desc, setDesc] = useState(chute.description ?? "");

  if (editing) {
    return (
      <div className="floor-attachment edit">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="chute name"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder="description"
          style={{ ...inputStyle, marginTop: 6 }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button
            className="btn-soft"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => {
              updateChute(chute.id, { name: name.trim() || chute.name, description: desc.trim() || undefined });
              setEditing(false);
            }}
          >
            save
          </button>
          <button
            className="btn-soft danger"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => {
              if (confirm(`delete "${chute.name}"?`)) {
                deleteChute(chute.id);
              }
            }}
          >
            delete
          </button>
          <button
            className="btn-soft subtle"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => setEditing(false)}
          >
            cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="floor-attachment chute">
      <div className="att-name">↓ {chute.name}</div>
      {chute.description && <div className="att-desc">{chute.description}</div>}
      <div className="att-actions">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='optional "i noticed ___"'
          style={{ ...inputStyle, flex: 1, minWidth: 100, fontSize: 13 }}
        />
        <button
          className="btn-soft"
          style={{ fontSize: 12, padding: "4px 10px" }}
          onClick={() => {
            addEntry({ kind: "chute", ref_id: chute.id, ref_name: chute.name, note: note.trim() || undefined });
            setNote("");
          }}
        >
          i noticed this
        </button>
        <button
          className="btn-link"
          style={{ fontSize: 11 }}
          onClick={() => setEditing(true)}
        >
          edit
        </button>
      </div>
    </div>
  );
}

function FloorAddForm({
  placeholder,
  onSave,
}: {
  kind: "ladder" | "chute";
  placeholder: string;
  onSave: (name: string, desc: string) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div className="floor-attachment edit">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        autoFocus
        style={inputStyle}
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={2}
        placeholder="description (optional)"
        style={{ ...inputStyle, marginTop: 6 }}
      />
      <button
        className="btn-soft"
        style={{ marginTop: 6, fontSize: 12, padding: "4px 10px" }}
        disabled={!name.trim()}
        onClick={() => onSave(name.trim(), desc.trim())}
      >
        save
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  border: "1px solid var(--line)",
  borderRadius: 6,
  background: "var(--bg)",
  color: "var(--ink)",
  fontFamily: "var(--serif)",
  fontSize: 14,
};
