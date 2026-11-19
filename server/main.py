import json
import random
from threading import Lock
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()
SPOTS_PATH = Path(__file__).parent / "spots.json"
SPOTS_LOCK = Lock()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_spots():
    with SPOTS_PATH.open(encoding="utf-8") as file:
        return json.load(file)


def save_spots(spots):
    temporary_path = SPOTS_PATH.with_name(f".{SPOTS_PATH.name}.tmp")
    with temporary_path.open("w", encoding="utf-8") as file:
        json.dump(spots, file, indent=2)
        file.write("\n")
    temporary_path.replace(SPOTS_PATH)


@app.get("/")
def read_root():
    return {"message": "StudiousSeekers API is running"}

@app.get("/spots")
def get_spots():
    return {"spots": load_spots()}


@app.post("/spots/{spot_id}/boost")
def boost_spot(spot_id: int):
    with SPOTS_LOCK:
        spots = load_spots()
        spot = next((item for item in spots if item.get("id") == spot_id), None)
        if spot is None:
            raise HTTPException(status_code=404, detail="Spot not found")

        spot["upvotes"] = spot.get("upvotes", 0) + 1
        save_spots(spots)
        return {"id": spot_id, "upvotes": spot["upvotes"], "voted": True}


@app.delete("/spots/{spot_id}/boost")
def remove_boost(spot_id: int):
    with SPOTS_LOCK:
        spots = load_spots()
        spot = next((item for item in spots if item.get("id") == spot_id), None)
        if spot is None:
            raise HTTPException(status_code=404, detail="Spot not found")

        spot["upvotes"] = max(0, spot.get("upvotes", 0) - 1)
        save_spots(spots)
        return {"id": spot_id, "upvotes": spot["upvotes"], "voted": False}


@app.get("/spots/random")
def get_random_spot():
    spots = load_spots()
    if not spots:
        return JSONResponse(
            status_code=404,
            content={"error": "No study spots available"},
        )
    return random.choice(spots)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)