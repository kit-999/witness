"use client";

import { Entry } from "@/lib/types";

/**
 * Patterns view: word cloud of recurring texture words.
 * - All-time only. No time slicing.
 * - No integer counts visible. Visual weight via size class.
 * - Empty state: "patterns will surface as you log." No numeric threshold.
 */
export default function PatternsView({ entries }: { entries: Entry[] }) {
  // Tokenize all texture fields into normalized words
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (!e.texture) continue;
    const tokens = e.texture
      .toLowerCase()
      .replace(/[^a-zA-ZÀ-ſ\s-]/g, " ")
      .split(/[\s,;]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  const list = Array.from(counts.entries())
    .filter(([, n]) => n >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80);

  // Need at least a few distinct words to show as a "pattern"
  const distinct = list.length;

  return (
    <section style={{ marginTop: 36 }}>
      <div className="log-header">
        <span className="log-title">patterns</span>
        <span className="faint" style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
          texture, all-time
        </span>
      </div>

      {distinct < 3 ? (
        <div className="empty-state">
          patterns will surface as you log.
        </div>
      ) : (
        <div className="word-cloud">
          {(() => {
            // Bucket counts into 5 visual weight tiers
            const max = list[0][1];
            return list.map(([word, n]) => {
              const ratio = max > 0 ? n / max : 0;
              const tier =
                ratio >= 0.85 ? 5 :
                ratio >= 0.6 ? 4 :
                ratio >= 0.4 ? 3 :
                ratio >= 0.2 ? 2 : 1;
              return (
                <span key={word} className={`w l${tier}`}>
                  {word}
                </span>
              );
            });
          })()}
        </div>
      )}
    </section>
  );
}

const STOPWORDS = new Set([
  "and", "the", "but", "for", "with", "this", "that", "from", "into",
  "are", "was", "were", "have", "had", "has", "not", "you", "your", "all",
  "any", "can", "out", "one", "two", "now", "yet", "feel", "felt", "feels",
  "been", "being", "very", "more", "less", "just", "than",
]);
