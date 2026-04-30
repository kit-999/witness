// localStorage wrapper for witness data.
// Single key under "witness:v1" holding the full WitnessData shape.

"use client";

import { WitnessData, Entry, Ladder, Chute, Floor, AppState, SCHEMA_VERSION } from "./types";
import { defaultData } from "./seed";

const KEY = "witness:v1";

function readRaw(): WitnessData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as WitnessData;
    if (parsed.state?.schemaVersion !== SCHEMA_VERSION) {
      // Future: run migrations. For v1: trust the version.
      return { ...defaultData(), ...parsed, state: { ...defaultData().state, ...parsed.state, schemaVersion: SCHEMA_VERSION } };
    }
    return parsed;
  } catch {
    return defaultData();
  }
}

function write(d: WitnessData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(d));
  // Notify any listeners on the same page (storage event only fires across tabs)
  window.dispatchEvent(new CustomEvent("witness:change"));
}

export function load(): WitnessData {
  return readRaw();
}

export function save(d: WitnessData) {
  write(d);
}

// Convenience mutators

export function addEntry(e: Omit<Entry, "id" | "ts"> & { ts?: string }) {
  const d = readRaw();
  const entry: Entry = {
    id: crypto.randomUUID(),
    ts: e.ts ?? new Date().toISOString(),
    ...e,
  };
  d.entries.unshift(entry);
  write(d);
  return entry;
}

export function deleteEntry(id: string) {
  const d = readRaw();
  d.entries = d.entries.filter((x) => x.id !== id);
  write(d);
}

export function addLadder(name: string, description: string, category: Ladder["category"], floor?: number) {
  const d = readRaw();
  const l: Ladder = {
    id: crypto.randomUUID(),
    name,
    description,
    category,
    floor,
    createdAt: new Date().toISOString(),
  };
  d.ladders.push(l);
  write(d);
  return l;
}

export function updateLadder(id: string, patch: Partial<Ladder>) {
  const d = readRaw();
  const i = d.ladders.findIndex((l) => l.id === id);
  if (i >= 0) {
    d.ladders[i] = { ...d.ladders[i], ...patch };
    write(d);
  }
}

export function deleteLadder(id: string) {
  const d = readRaw();
  d.ladders = d.ladders.filter((l) => l.id !== id);
  write(d);
}

export function addChute(name: string, description: string, floor?: number) {
  const d = readRaw();
  const c: Chute = {
    id: crypto.randomUUID(),
    name,
    description,
    floor,
    createdAt: new Date().toISOString(),
  };
  d.chutes.push(c);
  write(d);
  return c;
}

export function updateChute(id: string, patch: Partial<Chute>) {
  const d = readRaw();
  const i = d.chutes.findIndex((c) => c.id === id);
  if (i >= 0) {
    d.chutes[i] = { ...d.chutes[i], ...patch };
    write(d);
  }
}

export function deleteChute(id: string) {
  const d = readRaw();
  d.chutes = d.chutes.filter((c) => c.id !== id);
  write(d);
}

export function updateFloor(number: number, patch: Partial<Floor>) {
  const d = readRaw();
  const i = d.floors.findIndex((f) => f.number === number);
  if (i >= 0) {
    d.floors[i] = { ...d.floors[i], ...patch };
    write(d);
  }
}

export function updateState(patch: Partial<AppState>) {
  const d = readRaw();
  d.state = { ...d.state, ...patch };
  write(d);
}

export function exportJson(): string {
  return JSON.stringify(readRaw(), null, 2);
}

export function importJson(json: string) {
  const d = JSON.parse(json) as WitnessData;
  // Trust + light validation
  if (!d.state || !Array.isArray(d.entries)) {
    throw new Error("not a valid witness export");
  }
  write(d);
}

export function resetToDefaults() {
  write(defaultData());
}
