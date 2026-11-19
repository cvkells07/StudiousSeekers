import json
import random
from threading import Lock
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, constr

app = FastAPI()
SPOTS_PATH = Path(__file__).parent / "spots.json"
SPOTS_LOCK = Lock()


@app.exception_handler(RequestValidationError)
async def handle_validation_error(_, error):
    messages = "; ".join(item["msg"] for item in error.errors())
    return JSONResponse(
        status_code=422,
        content={"error": f"Invalid study spot: {messages}"},
    )


class SpotCreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=120)
    description: constr(strip_whitespace=True, min_length=1, max_length=500)
    building: constr(strip_whitespace=True, min_length=1, max_length=120)
    quiet_level: Literal["silent", "quiet", "moderate", "loud"]
    has_outlets: bool
    capacity: Literal["solo", "small", "large"]
    hours: constr(strip_whitespace=True, min_length=1, max_length=120)
    tags: list[constr(strip_whitespace=True, min_length=1, max_length=40)] = Field(
        default_factory=list, max_length=20
    )

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


@app.post("/spots", status_code=201)
def create_spot(spot: SpotCreate):
    with SPOTS_LOCK:
        spots = load_spots()
        created_spot = spot.dict()
        created_spot["id"] = max((item["id"] for item in spots), default=0) + 1
        created_spot["upvotes"] = 0
        spots.append(created_spot)
        save_spots(spots)

    return created_spot


@app.post("/spots/{spot_id}/boost")
def boost_spot(spot_id: int):
    with SPOTS_LOCK:
        spots = load_spots()
        spot = next((item for item in spots if item["id"] == spot_id), None)
        if spot is None:
            raise HTTPException(status_code=404, detail="Study spot not found")

        spot["upvotes"] += 1
        save_spots(spots)

    return {"id": spot_id, "upvotes": spot["upvotes"], "voted": True}


@app.delete("/spots/{spot_id}/boost")
def unboost_spot(spot_id: int):
    with SPOTS_LOCK:
        spots = load_spots()
        spot = next((item for item in spots if item["id"] == spot_id), None)
        if spot is None:
            raise HTTPException(status_code=404, detail="Study spot not found")

        spot["upvotes"] = max(0, spot["upvotes"] - 1)
        save_spots(spots)

    return {"id": spot_id, "upvotes": spot["upvotes"], "voted": False}