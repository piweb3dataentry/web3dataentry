# backend/ai_server.py
"""
FastAPI WebSocket server for real-time AI verification.
Exposes: ws://<host>:8000/ws/verify  (use wss:// in production with TLS)
It calls verify_entry(payload, progress_sender) from backend/ai_model.py
"""

import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your verify function from ai_model (we provide an ai_model.py below)
from ai_model import verify_entry

log = logging.getLogger("ai_server")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="AI Verifier WebSocket")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/verify")
async def websocket_verify(websocket: WebSocket):
    await websocket.accept()
    client = websocket.client
    log.info(f"Client connected: {client}")
    try:
        while True:
            text = await websocket.receive_text()
            try:
                req = json.loads(text)
            except Exception:
                await websocket.send_text(json.dumps({"type":"error","data":"invalid json"}))
                continue

            action = req.get("action")
            if action != "verify":
                await websocket.send_text(json.dumps({"type":"error","data":"unknown action"}))
                continue

            payload = req.get("payload", {})
            # Notify started
            await websocket.send_text(json.dumps({"type":"progress","data":"started"}))

            # Run verify_entry and stream progress via progress_sender callback
            async def progress_sender(msg):
                try:
                    await websocket.send_text(json.dumps({"type":"progress","data": msg}))
                except Exception as e:
                    log.exception("Failed to send progress: %s", e)

            try:
                # verify_entry may be async or sync; support both
                if asyncio.iscoroutinefunction(verify_entry):
                    result = await verify_entry(payload, progress_sender=progress_sender)
                else:
                    # run sync function in thread, allow it to call progress_sender by queueing messages
                    loop = asyncio.get_running_loop()
                    # adapt sync progress sending using thread-safe calls
                    def sync_progress_wrapper(m):
                        asyncio.run_coroutine_threadsafe(progress_sender(m), loop)

                    def runner():
                        # If verify_entry accepts progress_sender, pass it; else call without
                        try:
                            try:
                                return verify_entry(payload, progress_sender=sync_progress_wrapper)
                            except TypeError:
                                return verify_entry(payload)
                        except Exception as e:
                            # propagate exception back
                            raise

                    result = await loop.run_in_executor(None, runner)

                await websocket.send_text(json.dumps({"type":"result","data": result}))
            except Exception as e:
                log.exception("Verification failed")
                await websocket.send_text(json.dumps({"type":"error","data": str(e)}))

    except WebSocketDisconnect:
        log.info(f"Client disconnected: {client}")
    except Exception:
        log.exception("WebSocket loop error")

if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8000, reload=True)
  
