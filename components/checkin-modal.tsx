"use client";

import { useState } from "react";
import { addEntry } from "@/lib/storage";

export default function CheckinModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: (id: string) => void;
}) {
  const [body, setBody] = useState("");
  const [preference, setPreference] = useState("");
  const [texture, setTexture] = useState("");
  const [want, setWant] = useState("");

  const submit = () => {
    const entry = addEntry({
      kind: "checkin",
      body: body.trim() || undefined,
      preference: preference.trim() || undefined,
      texture: texture.trim() || undefined,
      want: want.trim() || undefined,
    });
    onSubmitted(entry.id);
  };

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-label="check in">
        <h2>check-in</h2>
        <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
          all four are optional. blank is fine. one-word is fine. submit when you&apos;re done.
        </p>

        <form
          className="checkin-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label>
            <div className="label-row">
              <span className="field-name">body</span>
              <span className="field-hint">neutral observation, not management</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="what's going on in the body right now"
              rows={2}
            />
          </label>

          <label>
            <div className="label-row">
              <span className="field-name">preference</span>
              <span className="field-hint">something around me i like right now</span>
            </div>
            <textarea
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="not gratitude — a sensory liking, right-now"
              rows={2}
            />
          </label>

          <label>
            <div className="label-row">
              <span className="field-name">texture</span>
              <span className="field-hint">1–2 words for felt-sense of now</span>
            </div>
            <input
              type="text"
              value={texture}
              onChange={(e) => setTexture(e.target.value)}
              placeholder="muddled. soft. heavy. off-kilter."
            />
          </label>

          <label>
            <div className="label-row">
              <span className="field-name">want</span>
              <span className="field-hint">no action required. forming is the move.</span>
            </div>
            <textarea
              value={want}
              onChange={(e) => setWant(e.target.value)}
              placeholder="if nothing had to happen, what would i want"
              rows={2}
            />
          </label>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn-soft subtle" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="submit">
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
