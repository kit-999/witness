"use client";

import { useState } from "react";
import { WitnessData, Ladder } from "@/lib/types";
import { addLadder, updateLadder, deleteLadder, addEntry } from "@/lib/storage";

export default function LaddersModal({
  data,
  onClose,
  unattachedOnly,
}: {
  data: WitnessData;
  onClose: () => void;
  unattachedOnly?: boolean;
}) {
  const visibleLadders = unattachedOnly
    ? data.ladders.filter((l) => l.floor === undefined)
    : data.ladders;
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-label="ladders">
        <h2>ladders</h2>
        <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
          practices to try. tap a ladder to log an attempt. attempts go into the field log
          alongside everything else — no separate scoring.
        </p>

        <div className="modal-row">
          <button
            className="btn-soft"
            onClick={() => setAdding(true)}
            style={{ marginBottom: 8 }}
          >
            + add ladder
          </button>
          <span className="grow" />
          <button className="btn-soft subtle" onClick={onClose}>
            close
          </button>
        </div>

        {adding && (
          <LadderForm
            onSave={(l) => {
              addLadder(l.name, l.description, l.category);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}

        <div className="ladder-list">
          {visibleLadders.length === 0 && (
            <div className="empty-state">
              {unattachedOnly
                ? "no unattached ladders. all your ladders are tied to specific floors above."
                : "no ladders yet."}
            </div>
          )}
          {visibleLadders.map((l) => (
            <LadderCard
              key={l.id}
              ladder={l}
              isEditing={editing === l.id}
              onEdit={() => setEditing(editing === l.id ? null : l.id)}
              onCloseEdit={() => setEditing(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LadderCard({
  ladder,
  isEditing,
  onEdit,
  onCloseEdit,
}: {
  ladder: Ladder;
  isEditing: boolean;
  onEdit: () => void;
  onCloseEdit: () => void;
}) {
  const [name, setName] = useState(ladder.name);
  const [desc, setDesc] = useState(ladder.description ?? "");
  const [category, setCategory] = useState<Ladder["category"]>(ladder.category);
  const [note, setNote] = useState("");

  if (isEditing) {
    return (
      <div className="ladder-card" style={{ background: "var(--bg)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ladder name"
            style={inputStyle}
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="description"
            rows={3}
            style={inputStyle}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Ladder["category"])}
            style={inputStyle}
          >
            <option value="witness">witness</option>
            <option value="relational">relational</option>
            <option value="self-occupation">self-occupation</option>
            <option value="other">other</option>
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-soft"
              onClick={() => {
                updateLadder(ladder.id, {
                  name: name.trim() || ladder.name,
                  description: desc.trim() || undefined,
                  category,
                });
                onCloseEdit();
              }}
            >
              save
            </button>
            <button
              className="btn-soft danger"
              onClick={() => {
                if (confirm(`delete "${ladder.name}"? attempts already in the log will stay.`)) {
                  deleteLadder(ladder.id);
                  onCloseEdit();
                }
              }}
            >
              delete
            </button>
            <button className="btn-soft subtle" onClick={onCloseEdit}>
              cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ladder-card">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div className="name">{ladder.name}</div>
        <span className="faint" style={{ fontSize: 11, fontFamily: "var(--sans)", letterSpacing: "0.05em" }}>
          {ladder.category}
        </span>
      </div>
      {ladder.description && <div className="desc">{ladder.description}</div>}

      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='optional one-line "i tried..."'
          style={{ ...inputStyle, flex: 1, minWidth: 140 }}
        />
        <button
          className="btn-soft"
          onClick={() => {
            addEntry({
              kind: "ladder",
              ref_id: ladder.id,
              ref_name: ladder.name,
              note: note.trim() || undefined,
            });
            setNote("");
          }}
        >
          log attempt
        </button>
        <button className="btn-link" onClick={onEdit}>
          edit
        </button>
      </div>
    </div>
  );
}

function LadderForm({
  onSave,
  onCancel,
}: {
  onSave: (l: { name: string; description: string; category: Ladder["category"] }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<Ladder["category"]>("witness");

  return (
    <div className="ladder-card" style={{ background: "var(--coral-pale)", marginBottom: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ladder name"
          style={inputStyle}
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="description (optional)"
          rows={3}
          style={inputStyle}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Ladder["category"])}
          style={inputStyle}
        >
          <option value="witness">witness</option>
          <option value="relational">relational</option>
          <option value="self-occupation">self-occupation</option>
          <option value="other">other</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-soft"
            disabled={!name.trim()}
            onClick={() => onSave({ name: name.trim(), description: desc.trim(), category })}
          >
            add
          </button>
          <button className="btn-soft subtle" onClick={onCancel}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid var(--line)",
  borderRadius: 6,
  background: "var(--bg)",
  color: "var(--ink)",
  fontFamily: "var(--serif)",
};
