import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)



    
