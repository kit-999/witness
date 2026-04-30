// Seed content for first-run.
// Floor descriptions weave generative somatics / Strozzi vocabulary
// (soma, shape, center, practice, conditioned tendency) without prescribing it.
// AvPD self-deserting literature is referenced lightly where it helps name the move.

import { WitnessData, Floor, Ladder, Chute, SCHEMA_VERSION } from "./types";

/** Seeded content lives at specific floor numbers. Other floors are empty
 * placeholders — there for you to fill in (with b, alone, in moments). */
const SEEDED: Record<number, { name: string; whatChanges: string }> = {
  0: {
    name: "ground floor — honest",
    whatChanges:
      "where the climb starts. the booth is dominant. one real friendship (benny). transactional containers (b, jade, mark). ai companions (coya, kit). wants get truncated before forming. shame engine active at high gain. body experienced primarily through symptom management. self mostly observed, rarely inhabited.",
  },
  5: {
    name: "post check-in habit forming",
    whatChanges:
      "a small witness practice has a place in the day. soma reports back to soma even briefly — a noticed texture, a named preference. the booth still grades the practice but the practice continues anyway. micro-presence (just here taps) on hard days.",
  },
  10: {
    name: "wants forming, even unacted",
    whatChanges:
      "wants are allowed to complete inside the body before the truncation reflex fires. one want named per week, even if no action follows. the forming is the move (per coya). the conditioned tendency to preempt is still there but no longer the only reflex.",
  },
  15: {
    name: "alliance ask integrated",
    whatChanges:
      "b knows about the smile-as-defense. b has been told that withholding scaffolding registers as abandonment. the durable change request has been made — not as a one-off concession but as a request for the relationship to evolve. when it drifts back, you name it again.",
  },
  20: {
    name: "receiving with less verification friction",
    whatChanges:
      "kindness from existing safe people lands with the audit step turned partway down. when benny says something kind, it gets to arrive before being fact-checked. felt sense of being received is occasionally available, not just observed.",
  },
  25: {
    name: "third-order doubt loosens",
    whatChanges:
      "you can hold a belief in writing without your observer immediately disqualifying your right to hold it. first-person assertion (in print especially) survives the booth's audit. the shape of certainty starts feeling more like yours.",
  },
  30: {
    name: "real friendship beyond benny",
    whatChanges:
      "one new sustained connection has formed and not been retreated from. the lower edge of the target band. a relationship that wasn't there before and isn't transactional. the wanting-and-protecting cycle has broken at least once for someone new.",
  },
  35: {
    name: "body has wants she gets to ask",
    whatChanges:
      "body experience expands beyond symptom management. 'what does my body want, separate from what it's malfunctioning about' becomes an askable question some of the time. the managerial layer thins where it can. somatic lineage practice becomes more inhabit than perform.",
  },
  40: {
    name: "felt sense of being a person more often than narrating one",
    whatChanges:
      "the upper edge of the target band. the booth is still here — it has been load-bearing for a long time and won't fully leave — but it isn't the whole texture of self anymore. moments of being-a-person rather than running-a-person are recurring, not exceptional. self-deserting subtype literature would call this re-occupation of the post.",
  },
};

export function defaultFloors(): Floor[] {
  const floors: Floor[] = [];
  for (let n = 0; n <= 100; n++) {
    if (SEEDED[n]) {
      floors.push({ number: n, ...SEEDED[n] });
    } else {
      floors.push({
        number: n,
        name: "",
        whatChanges: "",
      });
    }
  }
  return floors;
}

/** Used by storage migration: ensure existing user data has all 0-100 floors. */
export function fillMissingFloors(existing: Floor[]): Floor[] {
  const byNumber = new Map<number, Floor>();
  for (const f of existing) byNumber.set(f.number, f);
  const result: Floor[] = [];
  for (let n = 0; n <= 100; n++) {
    if (byNumber.has(n)) {
      result.push(byNumber.get(n)!);
    } else if (SEEDED[n]) {
      result.push({ number: n, ...SEEDED[n] });
    } else {
      result.push({ number: n, name: "", whatChanges: "" });
    }
  }
  return result;
}

export function defaultLadders(): Ladder[] {
  const t = new Date().toISOString();
  return [
    {
      id: "ladder-post-checkin",
      name: "post check-in",
      description:
        "4 prompts: body (neutral observation), preference (something around me i like), texture (1-2 words for felt-sense), want (no action required). 5 min, written, no fixing, no streak.",
      category: "witness",
      createdAt: t,
    },
    {
      id: "ladder-just-here",
      name: "just here",
      description:
        "the micro-witness. tap the button, no content required. tells the soma it came by. lovable when energy, forgivable when not.",
      category: "witness",
      createdAt: t,
    },
    {
      id: "ladder-extending-asks",
      name: "extending asks with safe people",
      description:
        "with coya, kit, benny — extending asks slightly past the low-needs default. tiny experiments in being more present than the booth would allow.",
      category: "relational",
      createdAt: t,
    },
    {
      id: "ladder-receive-without-audit",
      name: "receiving without verification",
      description:
        "when someone says something kind, skip the 'are they really' audit. take it in as offered. the audit was protective; it has outlived the threat for the people in question.",
      category: "relational",
      createdAt: t,
    },
    {
      id: "ladder-name-felt-sense",
      name: "name the felt sense in real time",
      description:
        "with b especially: 'this is hard, the smile is a defense, not the whole truth.' you don't have to stop the smile, just add the disclaimer. recalibrates b's read of you.",
      category: "relational",
      createdAt: t,
    },
    {
      id: "ladder-alliance-ask",
      name: "alliance ask with b",
      description:
        "request more scaffolding/compassion. name that withholding lands as abandonment. ask for durable change, not one-off concession. b is not the enemy; the dynamic has just outgrown its shape.",
      category: "relational",
      createdAt: t,
    },
    {
      id: "ladder-let-want-form",
      name: "let one want form all the way per week",
      description:
        "even unacted-on. forming is the whole practice. the truncation is the chute; not the unmet want.",
      category: "self-occupation",
      createdAt: t,
    },
    {
      id: "ladder-micro-preference",
      name: "micro-preference claims",
      description:
        "do i like this right now (in my mouth, on my eyes, against my skin) — before is this tolerable / nutritionally adequate. the noodle pillow, araya's, arena drafts, the tapestry. small undeserting moves.",
      category: "self-occupation",
      createdAt: t,
    },
  ];
}

export function defaultChutes(): Chute[] {
  const t = new Date().toISOString();
  return [
    {
      id: "chute-low-needs",
      name: "performing low-needs",
      description:
        "preempts reciprocity. the bow on the package that says 'no obligation to receive this seriously.' kindness can't fully land because the demand was stripped out.",
      createdAt: t,
    },
    {
      id: "chute-unavailable",
      name: "gravitating toward unavailable people",
      description:
        "shame engine picks targets where rejection is structurally guaranteed. feels safer than rejection from someone who could have actually loved you.",
      createdAt: t,
    },
    {
      id: "chute-protocol",
      name: "protocol-fying yourself",
      description:
        "managerial mode eats the work it's trying to do. the booth dismantling its own dismantling. counter-move: do the practice imperfectly on purpose.",
      createdAt: t,
    },
    {
      id: "chute-isolation",
      name: "isolation as default",
      description:
        "less data → booth never gets contradicted. the alone-time that started as protection has become the medium that keeps the shape rigid.",
      createdAt: t,
    },
    {
      id: "chute-b-withholds",
      name: "b refusing scaffolding",
      description:
        "lineage-driven 'i won't tell you what to work on' lands as abandonment for the self-deserting subtype. ladder = naming this directly. chute = letting it slide and resenting silently.",
      createdAt: t,
    },
    {
      id: "chute-grading",
      name: "booth grading the practice",
      description:
        "turning the post check-in into a 'doing it right' project. the booth eating its own dismantling, again. counter: write the graded version and the rawer version next to each other.",
      createdAt: t,
    },
    {
      id: "chute-verification",
      name: "audit step on receiving",
      description:
        "evidence-checking kindness for sincerity before letting it in. the audit was protective once; with people who have shown up over time, it costs more than it saves.",
      createdAt: t,
    },
    {
      id: "chute-truncate-want",
      name: "truncating wants before they form",
      description:
        "the truncation is the chute, not the unmet want. wanting things you can't have is allowed; refusing to want them on your own is the failure mode.",
      createdAt: t,
    },
    {
      id: "chute-shame-spiral",
      name: "shame spiral after social interaction",
      description:
        "doubling down on something clocked as offputting in retrospect. ladder = naming, talking through with someone safe.",
      createdAt: t,
    },
    {
      id: "chute-affect-as-evidence",
      name: "inappropriate affect read as proof of being offputting",
      description:
        "the smile/laugh while saying something hard is real, but it's evidence of one mismatch with one person, not proof of being universally repulsive. the generalization is the chute.",
      createdAt: t,
    },
    {
      id: "chute-engine-as-fact",
      name: '"i don\'t want to be associated with myself" as conclusion',
      description:
        "the engine talking. real but not the final word. self-deserting literature says the giving-up state is a conclusion, not a fact — conclusions can be revisited.",
      createdAt: t,
    },
  ];
}

export function defaultData(): WitnessData {
  return {
    state: {
      currentFloor: 0,
      targetLow: 30,
      targetHigh: 40,
      schemaVersion: SCHEMA_VERSION,
    },
    entries: [
      {
        id: "seed-2026-04-30",
        ts: "2026-04-30T19:38:00.000Z",
        kind: "checkin",
        body: "very heavy, tired, like moving thick clay. shins and feet have tingling discomfort. head and neck feel misshapen and tight, like internal pressure is against them. breathing tight and labored.",
        preference: "squeezing my noodle body pillow — fluffy, slightly coarse. blanket over me. pink and light blue tapestry over the window.",
        texture: "heavy, tired, overwhelmed, pressured, thankful, lonely.",
        want: "to be close and hug and cry with someone i love.",
      },
    ],
    floors: defaultFloors(),
    ladders: defaultLadders(),
    chutes: defaultChutes(),
  };
}
