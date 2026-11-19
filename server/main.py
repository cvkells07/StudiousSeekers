import json
import random
from threading import Lock
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, constr

app = FastAPI()
spots_lock = Lock()


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
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_spots():
    with (Path(__file__).parent / "spots.json").open(encoding="utf-8") as file:
        return json.load(file)

@app.get("/")
def read_root():
    return {"message": "StudiousSeekers API is running"}

@app.get("/spots")
def get_spots():
    return {"spots": load_spots()}


@app.post("/spots", status_code=201)
def create_spot(spot: SpotCreate):
    with spots_lock:
        spots = load_spots()
        created_spot = spot.dict()
        created_spot["id"] = max((item["id"] for item in spots), default=0) + 1
        created_spot["upvotes"] = 0
        spots.append(created_spot)

        spots_path = Path(__file__).parent / "spots.json"
        temporary_path = spots_path.with_suffix(".json.tmp")
        temporary_path.write_text(json.dumps(spots, indent=2) + "\n", encoding="utf-8")
        temporary_path.replace(spots_path)

    return created_spot


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