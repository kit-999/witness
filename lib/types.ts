// Shared types for the witness app.
// All data lives in localStorage on the user's device.

export type EntryKind = "checkin" | "chute" | "ladder" | "presence";

/**
 * A single row in the unified field log.
 * Every kind of entry — check-ins, chute notices, ladder attempts,
 * "just here" presences — is one of these.
 */
export type Entry = {
  id: string;
  ts: string; // ISO 8601
  kind: EntryKind;
  // for kind="checkin"
  body?: string;
  preference?: string;
  texture?: string; // 1-2 words for felt-sense
  want?: string;
  // for kind="chute" or "ladder"
  ref_id?: string; // chute or ladder id
  ref_name?: string; // captured name at time of entry (so renames don't break history)
  note?: string; // optional one-line "i noticed ___"
};

export type Floor = {
  number: number; // 0..100
  name: string; // capacity name
  whatChanges: string; // embodied marker — "what will have changed"
  bNotes?: string; // notes from somatic coach b sessions
};

export type Ladder = {
  id: string;
  name: string;
  description?: string;
  category: "witness" | "relational" | "self-occupation" | "other";
  /** Optional floor this ladder is the move toward. Unattached = general practice. */
  floor?: number;
  createdAt: string;
};

export type Chute = {
  id: string;
  name: string;
  description?: string;
  /** Optional floor this chute drops you from. Unattached = general pattern. */
  floor?: number;
  createdAt: string;
};

export type AppState = {
  currentFloor: number; // default 0
  targetLow: number; // default 30
  targetHigh: number; // default 40
  schemaVersion: number;
};

export type WitnessData = {
  state: AppState;
  entries: Entry[];
  floors: Floor[];
  ladders: Ladder[];
  chutes: Chute[];
};

export const SCHEMA_VERSION = 1;
