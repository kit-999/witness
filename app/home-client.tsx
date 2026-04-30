"use client";

import { useEffect, useState } from "react";
import { load, save, addEntry } from "@/lib/storage";
import { WitnessData, Entry } from "@/lib/types";
import CheckinModal from "@/components/checkin-modal";
import BuildingModal from "@/components/building-modal";
import LaddersModal from "@/components/ladders-modal";
import ChutesModal from "@/components/chutes-modal";
import LogRow from "@/components/log-row";
import PatternsView from "@/components/patterns-view";
import SettingsModal from "@/components/settings-modal";

export default function HomeClient() {
  const [data, setData] = useState<WitnessData | null>(null);
  const [activeModal, setActiveModal] = useState<
    null | "checkin" | "building" | "ladders" | "chutes" | "settings"
  >(null);
  const [warmId, setWarmId] = useState<string | null>(null);

  useEffect(() => {
    setData(load());
    const onChange = () => setData(load());
    window.addEventListener("witness:change", onChange);
    return () => window.removeEventListener("witness:change", onChange);
  }, []);

  if (!data) {
    return <div className="empty-state">loading…</div>;
  }

  const onJustHere = () => {
    const e = addEntry({ kind: "presence" });
    setWarmId(e.id);
    setTimeout(() => setWarmId(null), 800);
  };

  return (
    <>
      {/* building badge — top */}
      <button
        className="building-badge"
        onClick={() => setActiveModal("building")}
        aria-label="open building view"
      >
        <span>
          <span className="floor-num">floor {data.state.currentFloor}</span>
          <span className="lowercase soft" style={{ marginLeft: 10, fontStyle: "italic" }}>
            witness
          </span>
        </span>
        <span className="target">target {data.state.targetLow}–{data.state.targetHigh}</span>
      </button>

      {/* primary cta */}
      <button className="cta-primary" onClick={() => setActiveModal("checkin")}>
        check in
      </button>

      {/* just here — micro-witness */}
      <button className="just-here" onClick={onJustHere}>
        just here
      </button>

      {/* field log */}
      <section className="log-section">
        <div className="log-header">
          <span className="log-title">field log</span>
          <span className="faint" style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
            {data.entries.length === 0 ? "no entries yet" : `${data.entries.length} ${data.entries.length === 1 ? "entry" : "entries"}`}
          </span>
        </div>

        {data.entries.length === 0 && (
          <div className="empty-state">
            the log will hold check-ins, things you noticed, and just-here taps.
            nothing yet — that&apos;s fine. there&apos;s no streak.
          </div>
        )}

        {data.entries.map((e) => (
          <LogRow key={e.id} entry={e} warm={warmId === e.id} />
        ))}
      </section>

      <PatternsView entries={data.entries} />

      {/* scaffolding — collapsed by default */}

      <details className="collapsible">
        <summary>ladders — practices</summary>
        <div className="body">
          <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
            things to try. add or edit. attempts go into the field log.
          </p>
          <button className="btn-soft" onClick={() => setActiveModal("ladders")}>
            open ladders
          </button>
        </div>
      </details>

      <details className="collapsible">
        <summary>chutes — patterns to notice</summary>
        <div className="body">
          <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
            patterns that drop you. notice without scoring. notices go into the field log.
            no counts visible anywhere.
          </p>
          <button className="btn-soft" onClick={() => setActiveModal("chutes")}>
            open chutes
          </button>
        </div>
      </details>

      <details className="collapsible">
        <summary>settings & about</summary>
        <div className="body">
          <button className="btn-soft" onClick={() => setActiveModal("settings")}>
            open settings
          </button>
        </div>
      </details>

      {/* modals */}
      {activeModal === "checkin" && (
        <CheckinModal
          onClose={() => setActiveModal(null)}
          onSubmitted={(id) => {
            setWarmId(id);
            setTimeout(() => setWarmId(null), 800);
            setActiveModal(null);
          }}
        />
      )}
      {activeModal === "building" && (
        <BuildingModal data={data} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "ladders" && (
        <LaddersModal data={data} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "chutes" && (
        <ChutesModal data={data} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "settings" && (
        <SettingsModal onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
