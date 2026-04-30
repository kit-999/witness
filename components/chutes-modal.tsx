"use client";

import { useState } from "react";
import { WitnessData, Chute } from "@/lib/types";
import { addChute, updateChute, deleteChute, addEntry } from "@/lib/storage";

export default function ChutesModal({
  data,
  onClose,
}: {
  data: WitnessData;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-label="chutes">
        <h2>chutes</h2>
        <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
          patterns to notice. tap a chute when you notice one — that&apos;s the practice.
          no counts, no totals. notices go into the field log.
        </p>

        <div className="modal-row">
          <button
            className="btn-soft"
            onClick={() => setAdding(true)}
            style={{ marginBottom: 8 }}
          >
            + add chute
          </button>
          <span className="grow" />
          <button className="btn-soft subtle" onClick={onClose}>
            close
          </button>
        </div>

        {adding && (
          <ChuteForm
            onSave={(c) => {
              addChute(c.name, c.description);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}

        <div className="chute-list">
          {data.chutes.map((c) => (
            <ChuteCard
              key={c.id}
              chute={c}
              isEditing={editing === c.id}
              onEdit={() => setEditing(editing === c.id ? null : c.id)}
              onCloseEdit={() => setEditing(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChuteCard({
  chute,
  isEditing,
  onEdit,
  onCloseEdit,
}: {
  chute: Chute;
  isEditing: boolean;
  onEdit: () => void;
  onCloseEdit: () => void;
}) {
  const [name, setName] = useState(chute.name);
  const [desc, setDesc] = useState(chute.description ?? "");
  const [note, setNote] = useState("");

  if (isEditing) {
    return (
      <div className="chute-card" style={{ background: "var(--bg)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="chute name"
            style={inputStyle}
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="description"
            rows={3}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-soft"
              onClick={() => {
                updateChute(chute.id, {
                  name: name.trim() || chute.name,
                  description: desc.trim() || undefined,
                });
                onCloseEdit();
              }}
            >
              save
            </button>
            <button
              className="btn-soft danger"
              onClick={() => {
                if (confirm(`delete "${chute.name}"? notices already in the log will stay.`)) {
                  deleteChute(chute.id);
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
    <div className="chute-card">
      <div className="name">{chute.name}</div>
      {chute.description && <div className="desc">{chute.description}</div>}

      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder='optional "i noticed ___"'
          style={{ ...inputStyle, flex: 1, minWidth: 140 }}
        />
        <button
          className="btn-soft"
          onClick={() => {
            addEntry({
              kind: "chute",
              ref_id: chute.id,
              ref_name: chute.name,
              note: note.trim() || undefined,
            });
            setNote("");
          }}
        >
          i noticed this
        </button>
        <button className="btn-link" onClick={onEdit}>
          edit
        </button>
      </div>
    </div>
  );
}

function ChuteForm({
  onSave,
  onCancel,
}: {
  onSave: (c: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="chute-card" style={{ background: "var(--coral-pale)", marginBottom: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="chute name"
          style={inputStyle}
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="description (optional)"
          rows={3}
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-soft"
            disabled={!name.trim()}
            onClick={() => onSave({ name: name.trim(), description: desc.trim() })}
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
