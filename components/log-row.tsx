"use client";

import { Entry } from "@/lib/types";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  // fall back to short date
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function LogRow({ entry, warm }: { entry: Entry; warm?: boolean }) {
  return (
    <div className="log-row">
      <div className={`ts ${warm ? "warm" : ""}`}>
        {relativeTime(entry.ts)}
      </div>

      {entry.kind === "checkin" && (
        <div>
          <span className="kind-tag">check-in</span>
          {!entry.body && !entry.preference && !entry.texture && !entry.want && (
            <span className="faint italic">submitted blank — that counts.</span>
          )}
          {entry.body && (
            <div className="field">
              <div className="field-label">body</div>
              <div className="field-text">{entry.body}</div>
            </div>
          )}
          {entry.preference && (
            <div className="field">
              <div className="field-label">preference</div>
              <div className="field-text">{entry.preference}</div>
            </div>
          )}
          {entry.texture && (
            <div className="field">
              <div className="field-label">texture</div>
              <div className="field-text">{entry.texture}</div>
            </div>
          )}
          {entry.want && (
            <div className="field">
              <div className="field-label">want</div>
              <div className="field-text">{entry.want}</div>
            </div>
          )}
        </div>
      )}

      {entry.kind === "presence" && (
        <div>
          <span className="kind-tag">just here</span>
          <span className="soft italic">no entry, just present.</span>
        </div>
      )}

      {entry.kind === "chute" && (
        <div>
          <span className="kind-tag">noticed</span>
          <span className="italic">{entry.ref_name ?? "a chute"}</span>
          {entry.note && <div className="note">— {entry.note}</div>}
        </div>
      )}

      {entry.kind === "ladder" && (
        <div>
          <span className="kind-tag">tried</span>
          <span className="italic">{entry.ref_name ?? "a ladder"}</span>
          {entry.note && <div className="note">— {entry.note}</div>}
        </div>
      )}
    </div>
  );
}
