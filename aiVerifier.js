// /frontend/src/utils/aiVerifier.js

/**
 * Flexible AI Verification Logic (Client-Side)
 * 
 * Rules:
 * 1. If payload has "text":
 *      - If text contains "hello" → return { is_fake: false }
 *      - Otherwise → return { is_fake: true }
 * 
 * 2. If payload has "name" AND "nid":
 *      - If both are non-empty → return { verified: true }
 *      - Else → return { verified: false }
 * 
 * 3. Otherwise:
 *      - return { status: "unknown_format" }
 */

export function verifyPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { status: "invalid_payload" };
  }

  // Rule 1: Text Verification
  if (payload.text !== undefined) {
    const text = String(payload.text).toLowerCase();
    return text.includes("hello")
      ? { is_fake: false }
      : { is_fake: true };
  }

  // Rule 2: Name + NID Verification
  if (payload.name !== undefined && payload.nid !== undefined) {
    const nameValid = String(payload.name).trim() !== "";
    const nidValid = String(payload.nid).trim() !== "";
    return (nameValid && nidValid)
      ? { verified: true }
      : { verified: false };
  }

  // Rule 3: Unknown Format
  return { status: "unknown_format" };
}
