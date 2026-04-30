"use client";

import { useEffect, useRef, useState } from "react";
import { load, addEntry } from "@/lib/storage";
import { WitnessData } from "@/lib/types";
import CheckinModal from "@/components/checkin-modal";
import LaddersModal from "@/components/ladders-modal";
import ChutesModal from "@/components/chutes-modal";
import LogRow from "@/components/log-row";
import PatternsView from "@/components/patterns-view";
import SettingsModal from "@/components/settings-modal";
import Building from "@/components/building";
import BuildingVisual from "@/components/building-visual";

export default function HomeClient() {
  const [data, setData] = useState<WitnessData | null>(null);
  const [activeModal, setActiveModal] = useState<
    null | "checkin" | "ladders" | "chutes" | "settings"
  >(null);
  const [warmId, setWarmId] = useState<string | null>(null);
  const [windowLow, setWindowLow] = useState<number>(0);
  const buildingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = load();
    setData(d);
    setWindowLow(d.state.currentFloor);
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

  const focusFloor = (n: number) => {
    // Slide the building window so this floor is in view (with some context above)
    setWindowLow(Math.max(0, Math.min(100 - 10, n - 2)));
    // Then scroll the page after the DOM updates
    requestAnimationFrame(() => {
      const el = document.getElementById(`floor-card-${n}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        buildingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  return (
    <>
      {/* primary cta */}
      <button className="cta-primary" onClick={() => setActiveModal("checkin")}>
        check in
      </button>

      {/* just here — micro-witness */}
      <button className="just-here" onClick={onJustHere}>
        just here
      </button>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="home-grid">
        <div ref={buildingRef}>
          <Building data={data} windowLow={windowLow} setWindowLow={setWindowLow} />
        </div>

        <aside className="building-visual-wrap">
          <BuildingVisual data={data} onFloorClick={focusFloor} />
          <div className="building-legend">
            <span className="legend-key">
              <span className="legend-swatch" style={{ background: "var(--coral)" }} />
              lit floor
            </span>
            <span className="legend-key">
              <span className="legend-swatch" style={{ background: "var(--coral-soft)" }} />
              you
            </span>
            <span className="legend-key">
              <span className="legend-swatch" style={{ background: "var(--blue-pale)" }} />
              target
            </span>
            <span className="legend-key">
              ↑ ladder · ↓ chute
            </span>
          </div>
        </aside>
      </div>

      {/* field log */}
      <section className="log-section">
        <div className="log-header">
          <span className="log-title">field log</span>
          <span className="faint" style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
            {data.entries.length === 0
              ? "no entries yet"
              : `${data.entries.length} ${data.entries.length === 1 ? "entry" : "entries"}`}
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

      {/* unattached lists for general practice/pattern items */}

      <details className="collapsible">
        <summary>ladders — unattached practices</summary>
        <div className="body">
          <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
            general practices that aren&apos;t tied to a specific floor. ladders attached
            to floors live in those floor cards above.
          </p>
          <button className="btn-soft" onClick={() => setActiveModal("ladders")}>
            open
          </button>
        </div>
      </details>

      <details className="collapsible">
        <summary>chutes — unattached patterns</summary>
        <div className="body">
          <p className="soft" style={{ fontSize: 14, fontStyle: "italic", marginTop: 0 }}>
            general patterns to notice. floor-specific chutes live in those floor cards.
          </p>
          <button className="btn-soft" onClick={() => setActiveModal("chutes")}>
            open
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
      {activeModal === "ladders" && (
        <LaddersModal data={data} onClose={() => setActiveModal(null)} unattachedOnly />
      )}
      {activeModal === "chutes" && (
        <ChutesModal data={data} onClose={() => setActiveModal(null)} unattachedOnly />
      )}
      {activeModal === "settings" && (
        <SettingsModal onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
