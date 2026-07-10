import { strict as assert } from "node:assert";
import { buildPayload, getModel, validateParams } from "./schema.ts";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("muapi-client schema tests\n");

test("resolves flux-dev endpoint from schema_data.json", () => {
  const model = getModel("flux-dev");
  assert.equal(model.endpoint, "flux-dev-image");
  assert.ok(model.category.includes("Text to Image"));
});

test("validates prompt is required for flux-dev", () => {
  const result = validateParams("flux-dev", {});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("prompt")));
});

test("builds payload with aspect ratio mapped to width/height", () => {
  const { endpoint, payload } = buildPayload("flux-dev", {
    prompt: "a sunset",
    aspect_ratio: "16:9",
  });
  assert.equal(endpoint, "flux-dev-image");
  assert.equal(payload.prompt, "a sunset");
  assert.equal(payload.width, 1344);
  assert.equal(payload.height, 768);
});

test("resolves nano-banana-pro-edit for UGC workflows", () => {
  const model = getModel("nano-banana-pro-edit");
  assert.equal(model.endpoint, "nano-banana-pro-edit");
});

console.log("\nAll tests passed.");
