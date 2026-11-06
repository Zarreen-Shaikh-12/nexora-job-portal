const assert = require("assert");
const { calculateMatchScore } = require("../utils/matchScore");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`PASS: ${name}`);
};

test("dry run example gives 75", () => {
  const r = calculateMatchScore(
    ["React", "Node.js", " MongoDB", "Express", "react"],
    ["react", "NODE.JS", "Python", "mongodb "]
  );
  assert.strictEqual(r.score, 75);
  assert.deepStrictEqual(r.matchedSkills, ["react", "node.js", "mongodb"]);
  assert.deepStrictEqual(r.missingSkills, ["express"]);
  assert.strictEqual(r.totalRequirements, 4);
});

test("full match gives 100", () => {
  assert.strictEqual(calculateMatchScore(["a", "b"], ["b", "a", "c"]).score, 100);
});

test("no match gives 0 and lists all as missing", () => {
  const r = calculateMatchScore(["a", "b"], ["x"]);
  assert.strictEqual(r.score, 0);
  assert.deepStrictEqual(r.missingSkills, ["a", "b"]);
});

test("rounding: 1 of 3 gives 33, 2 of 3 gives 67", () => {
  assert.strictEqual(calculateMatchScore(["a", "b", "c"], ["a"]).score, 33);
  assert.strictEqual(calculateMatchScore(["a", "b", "c"], ["a", "b"]).score, 67);
});

test("empty requirements are handled safely", () => {
  const r = calculateMatchScore([], ["a"]);
  assert.strictEqual(r.score, 0);
  assert.strictEqual(r.totalRequirements, 0);
});

test("empty candidate skills give 0", () => {
  assert.strictEqual(calculateMatchScore(["a"], []).score, 0);
});

test("invalid inputs do not crash", () => {
  assert.strictEqual(calculateMatchScore(null, undefined).score, 0);
  assert.strictEqual(calculateMatchScore("react", "react").score, 0);
  assert.strictEqual(calculateMatchScore([1, null, "a", {}], ["a"]).score, 100);
});

test("inner spaces and case are normalized", () => {
  assert.strictEqual(calculateMatchScore(["Machine   Learning"], ["machine learning"]).score, 100);
});

test("known limitation: nodejs and node.js are different", () => {
  assert.strictEqual(calculateMatchScore(["node.js"], ["nodejs"]).score, 0);
});

console.log(`\nAll ${passed} tests passed`);
