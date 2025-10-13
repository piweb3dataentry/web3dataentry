# backend/ai_model.py
"""
AI model wrapper for verification.
Provide: verify_entry(payload, progress_sender=None)
- payload: a dict, e.g. {"text": "..."}
- progress_sender: async callable progress_sender(message) -> None
This file will try to reuse ai_api.py if present. If not, it will run a safe dummy rule-based verifier.
"""

import asyncio
import logging

log = logging.getLogger("ai_model")
logging.basicConfig(level=logging.INFO)

# Try to import ai_api (if your repo already defines model/API calls)
try:
    import ai_api  # this should provide functions to call external AI or model
    HAS_AI_API = True
except Exception:
    ai_api = None
    HAS_AI_API = False

async def _send_progress(progress_sender, msg):
    if progress_sender:
        try:
            # progress_sender may be async
            if asyncio.iscoroutinefunction(progress_sender):
                await progress_sender(msg)
            else:
                # sync callable
                progress_sender(msg)
        except Exception:
            log.exception("progress_sender failed")

# Example rule: if payload.text contains word "hello" => real; else fake
# You asked simple rule in earlier messages. You can replace logic to call ai_api.
async def verify_entry(payload, progress_sender=None):
    """
    Async verify_entry implementation.
    Returns a dict result, e.g.
    { "is_fake": False, "confidence": 0.92, "notes": "..." }
    """
    text = ""
    if isinstance(payload, dict):
        # common key choices
        text = payload.get("text") or payload.get("entry") or payload.get("content") or ""
    else:
        text = str(payload)

    await _send_progress(progress_sender, "received payload")
    await asyncio.sleep(0.05)
    await _send_progress(progress_sender, "preprocessing")

    # If ai_api exists and defines `analyze_text` use it
    if HAS_AI_API and hasattr(ai_api, "analyze_text"):
        await _send_progress(progress_sender, "calling ai_api.analyze_text")
        try:
            # ai_api.analyze_text may be sync or async
            if asyncio.iscoroutinefunction(ai_api.analyze_text):
                api_result = await ai_api.analyze_text(text)
            else:
                loop = asyncio.get_running_loop()
                api_result = await loop.run_in_executor(None, lambda: ai_api.analyze_text(text))
            # Expect api_result to be dict-like; pass through
            await _send_progress(progress_sender, "ai_api returned result")
            return {"is_fake": api_result.get("is_fake", False),
                    "confidence": api_result.get("confidence", 0.5),
                    "meta": api_result}
        except Exception as e:
            await _send_progress(progress_sender, f"ai_api error: {e}")
            # fallback to rule-based below

    # Simple rule-based fallback:
    await _send_progress(progress_sender, "running fallback rules")
    await asyncio.sleep(0.1)

    lower = (text or "").lower()
    if "hello" in lower or "hi " in lower or lower.strip().startswith("dear"):
        is_fake = False
        confidence = 0.9
        notes = "Contains greeting-like tokens -> likely real."
    elif len(lower) < 10:
        is_fake = True
        confidence = 0.6
        notes = "Too short -> suspicious."
    else:
        # moderate confidence
        is_fake = False
        confidence = 0.55
        notes = "No obvious signs of fake; moderate confidence."

    await _send_progress(progress_sender, "done")
    return {"is_fake": is_fake, "confidence": confidence, "notes": notes}
  
