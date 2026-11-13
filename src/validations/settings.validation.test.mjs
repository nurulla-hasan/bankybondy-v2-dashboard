import assert from "node:assert/strict";
import { test } from "node:test";
import * as validation from "./settings.validation.ts";

const settings = Object.freeze({
  candidateMode: "vector",
  frontierEnabled: true,
  cacheTtlMinutes: 60,
  surpriseFloor: 0.45,
  surpriseMargin: 0.1,
  emptyEncounter: 0.45,
  emptyMixed: 0.42,
  minScore: 0.4,
  minServeScore: 0.4,
  wMin: 0.7,
  weightSem: 0.5,
  weightRep: 0.25,
  weightProx: 0.15,
  weightFresh: 0.1,
  pairBias: 0.02,
  maxResults: 100,
  frontierSeeds: 5,
  sweepEnabled: true,
  sweepBatch: 1500,
  sweepCron: "*/5 * * * *",
  revision: 7,
  computeRevision: 3,
  updatedAt: "2026-11-11T00:00:00.000Z",
  updatedBy: null,
});

for (const candidateMode of ["vector", "knn"]) {
  test(`accepts ${candidateMode} with independent frontier disabled`, () => {
    const parsed = validation.matchingSettingsSchema.parse({
      ...settings, candidateMode, frontierEnabled: false,
    });
    assert.equal(parsed.candidateMode, candidateMode);
    assert.equal(parsed.frontierEnabled, false);
  });
}

for (const candidateMode of ["hybrid", "frontier"]) {
  test(`rejects mock ${candidateMode} candidate mode`, () => {
    assert.equal(validation.matchingSettingsSchema.safeParse({
      ...settings, candidateMode,
    }).success, false);
  });
}

for (const [key, min, max] of [
  ["cacheTtlMinutes", 0, 43200],
  ["frontierSeeds", 1, 20],
  ["sweepBatch", 1, 20000],
  ["surpriseFloor", 0, 1],
  ["surpriseMargin", 0, 1],
  ["minServeScore", 0, 1],
  ["wMin", 0, 1],
  ["pairBias", 0, 1],
  ["maxResults", 1, 500],
]) {
  test(`${key} accepts both boundaries and rejects out-of-range values`, () => {
    for (const value of [min, max]) {
      assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, [key]: value }).success, true);
    }
    for (const value of [min - 1, max + 1, NaN, Infinity, ""]) {
      assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, [key]: value }).success, false);
    }
  });
}

for (const key of ["cacheTtlMinutes", "frontierSeeds", "sweepBatch", "maxResults"]) {
  test(`${key} rejects fractional values`, () => {
    assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, [key]: 1.5 }).success, false);
  });
}

test("cron is trimmed and bounded without rejecting optional seconds", () => {
  const parsed = validation.matchingSettingsSchema.parse({ ...settings, sweepCron: "  0 */5 * * * *  " });
  assert.equal(parsed.sweepCron, "0 */5 * * * *");
  for (const sweepCron of ["", "   ", "x".repeat(121)]) {
    assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, sweepCron }).success, false);
  }
});

test("no-op and normalized no-op drafts do not produce a PATCH", () => {
  assert.equal(validation.createMatchingSettingsPatch(settings, settings), null);
  assert.equal(validation.createMatchingSettingsPatch(settings, { ...settings, sweepCron: ` ${settings.sweepCron} ` }), null);
});

test("patch includes changed writable fields and opening revision only", () => {
  const draft = { ...settings, candidateMode: "knn", frontierEnabled: false, cacheTtlMinutes: 0, revision: 99, updatedBy: "ignored", unknown: true };
  assert.deepEqual(validation.createMatchingSettingsPatch(settings, draft), {
    expectedRevision: 7, candidateMode: "knn", frontierEnabled: false, cacheTtlMinutes: 0,
  });
  assert.equal(settings.frontierEnabled, true);
  assert.equal(settings.revision, 7);
});

test("draft contains only writable settings, never audit metadata", () => {
  const draft = validation.matchingSettingsSchema.parse(settings);
  assert.deepEqual(Object.keys(draft).sort(), [
    "candidateMode", "frontierEnabled", "cacheTtlMinutes", "surpriseFloor", "surpriseMargin",
    "emptyEncounter", "emptyMixed", "minScore", "minServeScore", "wMin",
    "weightSem", "weightRep", "weightProx", "weightFresh", "pairBias", "maxResults",
    "frontierSeeds", "sweepEnabled", "sweepBatch", "sweepCron",
  ].sort());
});

test("cross-field rules keep the empty bands ordered and weights normalized", () => {
  for (const valid of [
    { minScore: 0, emptyMixed: 0.01, emptyEncounter: 0.02 },
    { emptyMixed: 0.99, emptyEncounter: 1 },
    { weightSem: 0, weightRep: 0, weightProx: 0, weightFresh: 1 },
    { weightSem: 1, weightRep: 0, weightProx: 0, weightFresh: 0 },
  ]) {
    assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, ...valid }).success, true, JSON.stringify(valid));
  }
  for (const invalid of [
    { emptyMixed: 0.5 },
    { emptyEncounter: 0.4 },
    { emptyEncounter: 1.1 },
    { minScore: 0.43 },
    { weightSem: 0.4 },
    { weightFresh: 1.1 },
  ]) {
    assert.equal(validation.matchingSettingsSchema.safeParse({ ...settings, ...invalid }).success, false, JSON.stringify(invalid));
  }
  const draft = validation.matchingSettingsSchema.parse({ ...settings, emptyMixed: 0.43, weightSem: 0.55, weightFresh: 0.05 });
  assert.equal(draft.emptyMixed, 0.43);
});

test("profile and password schemas still enforce their existing rules", () => {
  assert.equal(validation.updateProfileSchema.safeParse({ name: "A" }).success, false);
  assert.equal(validation.updateProfileSchema.parse({ name: "  Admin  " }).name, "Admin");
  assert.equal(validation.changePasswordSchema.safeParse({ oldPassword: "current", newPassword: "newpass", confirmNewPassword: "different" }).success, false);
});
