"use client";

import { useState } from "react";
import { exportJson, importJson, resetToDefaults } from "@/lib/storage";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [importErr, setImportErr] = useState<string | null>(null);

  const onExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `witness-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    try {
      const text = await file.text();
      importJson(text);
      setImportErr(null);
      alert("import done.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setImportErr(`couldn't read that file: ${msg}`);
    }
  };

  const onReset = () => {
    if (confirm("reset everything to defaults? you can export first to back up.")) {
      resetToDefaults();
    }
  };

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-label="settings">
        <h2>settings & about</h2>

        <section className="prose" style={{ marginTop: 0 }}>
          <h3>the principle</h3>
          <p>
            the deserted self needs a witness, not a manager. this app is a witness tool —
            tracking, not optimizing. imperfect entries count. usage gaps aren&apos;t failures.
          </p>

          <h3>about the booth</h3>
          <p>
            the booth is the observational/managerial mode of self that runs the show
            for self-deserting avoidant patterns. it&apos;s been load-bearing — that&apos;s why it&apos;s
            still here. the work is dismantling it slowly where it&apos;s safe to, not all
            at once and not from inside itself. management can stay; it just doesn&apos;t
            have to be the whole texture.
          </p>

          <h3>somatic lineage</h3>
          <p>
            the floor descriptions weave generative somatics / strozzi vocabulary
            (soma, shape, conditioned tendency, practice) without being prescriptive.
            this is not a method. you bring your own.
          </p>

          <h3>your data</h3>
          <p>
            everything lives in your browser&apos;s local storage. nothing is sent to a server.
            you can export at any time as JSON and re-import on another device or after
            clearing browser data.
          </p>
        </section>

        <div className="divider"></div>

        <h3 style={{ fontStyle: "italic", fontWeight: "normal", marginTop: 0 }}>
          export / import
        </h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-soft" onClick={onExport}>
            export as JSON
          </button>
          <label className="btn-soft" style={{ cursor: "pointer" }}>
            import from JSON
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
              }}
            />
          </label>
          <button className="btn-soft danger" onClick={onReset}>
            reset to defaults
          </button>
        </div>
        {importErr && <p style={{ color: "#b14a3a", marginTop: 8 }}>{importErr}</p>}

        <div className="divider"></div>

        <p className="faint" style={{ fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
          built with kit & coya for jerika · v1 · feature-frozen on purpose
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn-soft subtle" onClick={onClose}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}
